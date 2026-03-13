import { jsonrepair } from 'jsonrepair';
import {
  SKILL_DIAGNOSIS_PROMPT,
  SKILL_KEYWORD_GENERATOR_PROMPT,
  SKILL_MAIN_PROMPT,
  SKILL_QUALITY_CHECKER_PROMPT,
} from '../constants/kolkeywordsskill';
import type {
  AiReasoning,
  DiagnosisDecisionResponse,
  KeywordDraftResponse,
  KeywordStrategyGroup,
  ProjectForm,
  ProjectSummary,
  QualityCheckerResponse,
  SkillOrchestratedStrategyResponse,
  StrategyResponse,
} from '../types';

export type StrategyGenerationProgressStage = 'diagnosis' | 'draft' | 'quality' | 'orchestrator';
export type StrategyGenerationProgressStatus = 'started' | 'completed';

export interface StrategyGenerationProgressEvent {
  stage: StrategyGenerationProgressStage;
  status: StrategyGenerationProgressStatus;
  summary?: string;
  data?: unknown;
}

interface RequestStrategiesOptions {
  onProgress?: (event: StrategyGenerationProgressEvent) => void;
}

const DEFAULT_LLM_CONFIG = {
  apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
  apiKey: '',
  model: 'gemini-2.5-pro',
  temperature: 0.1,
} as const;

interface GeminiPart {
  text?: string;
}

interface GeminiCandidate {
  content?: {
    parts?: GeminiPart[];
  };
}

interface GeminiGenerateContentResponse {
  candidates?: GeminiCandidate[];
  error?: {
    message?: string;
  };
}

function getEnvConfig() {
  const envApiKey = import.meta.env.VITE_LLM_API_KEY?.trim();
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
  const pickedApiKey = envApiKey || geminiApiKey || DEFAULT_LLM_CONFIG.apiKey;
  const normalizedApiKey =
    !pickedApiKey || pickedApiKey === 'YOUR_LLM_API_KEY' || pickedApiKey === 'MY_LLM_API_KEY'
      ? ''
      : pickedApiKey;

  return {
    apiUrl: import.meta.env.VITE_LLM_API_URL?.trim() || DEFAULT_LLM_CONFIG.apiUrl,
    apiKey: normalizedApiKey,
    model: import.meta.env.VITE_LLM_MODEL?.trim() || DEFAULT_LLM_CONFIG.model,
    temperature: Number(import.meta.env.VITE_LLM_TEMPERATURE ?? String(DEFAULT_LLM_CONFIG.temperature)),
  };
}

function extractMessageContent(content: unknown): string {
  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') {
          return part;
        }

        if (typeof part === 'object' && part && 'text' in part && typeof part.text === 'string') {
          return part.text;
        }

        return '';
      })
      .join('\n');
  }

  return '';
}

function buildGeminiGenerateUrl(apiUrl: string, model: string, apiKey: string) {
  const base = apiUrl.replace(/\/$/, '');
  return `${base}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
}

function normalizeJsonText(raw: string) {
  const stripped = raw
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");

  const start = stripped.indexOf('{');
  const end = stripped.lastIndexOf('}');

  if (start >= 0 && end > start) {
    return stripped.slice(start, end + 1);
  }

  return stripped;
}

function extractCodeBlockCandidates(raw: string): string[] {
  const candidates: string[] = [];
  const regex = /```(?:json)?\s*([\s\S]*?)```/gi;
  let match: RegExpExecArray | null = regex.exec(raw);
  while (match) {
    if (match[1]?.trim()) {
      candidates.push(match[1].trim());
    }
    match = regex.exec(raw);
  }
  return candidates;
}

function extractBalancedObjectCandidates(raw: string): string[] {
  const candidates: string[] = [];
  const stack: string[] = [];
  let start = -1;
  let inString = false;
  let escaped = false;

  for (let i = 0; i < raw.length; i += 1) {
    const ch = raw[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === '{' || ch === '[') {
      if (stack.length === 0) {
        start = i;
      }
      stack.push(ch);
      continue;
    }

    if (ch === '}' || ch === ']') {
      const last = stack[stack.length - 1];
      const matches = (last === '{' && ch === '}') || (last === '[' && ch === ']');
      if (!matches) {
        continue;
      }
      stack.pop();
      if (stack.length === 0 && start >= 0) {
        const segment = raw.slice(start, i + 1).trim();
        if (segment) {
          candidates.push(segment);
        }
        start = -1;
      }
    }
  }

  return candidates;
}

function cleanList(values: unknown) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values.map((item) => String(item).trim()).filter(Boolean);
}

function normalizeSummary(raw: Partial<ProjectSummary> | undefined, form: ProjectForm): ProjectSummary {
  return {
    industry_category: String(raw?.industry_category ?? form.industry_keywords[0] ?? '').trim(),
    product_name: String(raw?.product_name ?? form.product_name ?? '').trim(),
    brand_name: String(raw?.brand_name ?? form.brand_name ?? '').trim(),
    core_search_direction: cleanList(raw?.core_search_direction),
  };
}

function normalizeStrategy(raw: Record<string, unknown>, index: number): KeywordStrategyGroup {
  const recommendedCreatorTiers = cleanList(raw.recommended_creator_tiers);
  const tags = typeof raw.tags === 'object' && raw.tags ? raw.tags as Record<string, unknown> : {};

  return {
    strategy_type: String(raw.strategy_type ?? `strategy_${index + 1}`).trim(),
    keyword_group_name: String(raw.keyword_group_name ?? `策略组 ${index + 1}`).trim(),
    keyword_list: cleanList(raw.keyword_list),
    strategy_explanation: String(raw.strategy_explanation ?? '').trim(),
    tags: {
      创作者类型: cleanList(tags['创作者类型']),
      内容形态: cleanList(tags['内容形态']),
      适合层级: recommendedCreatorTiers.length > 0 ? recommendedCreatorTiers : cleanList(tags['适合层级']),
    },
    recommended_creator_tiers: recommendedCreatorTiers.length > 0 ? recommendedCreatorTiers : cleanList(tags['适合层级']),
    enabled: raw.enabled === false ? false : true,
    sendingStatus: 'idle',
    lastResponse: '',
    lastGeneratedAt: new Date().toISOString(),
  };
}

function parseJsonObject<T>(rawText: string): T {
  const candidates = [
    normalizeJsonText(rawText),
    ...extractCodeBlockCandidates(rawText),
    ...extractBalancedObjectCandidates(rawText),
  ].filter(Boolean);

  let lastError = '未知解析错误';
  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate) as T;
    } catch {
      try {
        return JSON.parse(jsonrepair(candidate)) as T;
      } catch (error) {
        lastError = error instanceof Error ? error.message : '未知解析错误';
      }
    }
  }

  const preview = rawText.replace(/\s+/g, ' ').slice(0, 220);
  throw new Error(`LLM 返回内容无法解析为策略 JSON：${lastError}；原始片段：${preview}`);
}

function normalizeAiReasoning(raw: unknown): AiReasoning {
  const reasoning = (typeof raw === 'object' && raw ? raw : {}) as Record<string, unknown>;
  const diagnosis = (typeof reasoning.diagnosis === 'object' && reasoning.diagnosis ? reasoning.diagnosis : {}) as Record<string, unknown>;
  const decisions = (typeof reasoning.strategy_decisions === 'object' && reasoning.strategy_decisions ? reasoning.strategy_decisions : {}) as Record<string, unknown>;

  const reflectionCheck = Array.isArray(reasoning.reflection_check)
    ? reasoning.reflection_check
        .map((item) => {
          if (!item || typeof item !== 'object') {
            return null;
          }
          const entry = item as Record<string, unknown>;
          return {
            keyword: String(entry.keyword ?? '').trim(),
            q1_search_result_quality: String(entry.q1_search_result_quality ?? '').trim(),
            q2_creator_language_match: String(entry.q2_creator_language_match ?? '').trim(),
            q3_tokenization_risk: String(entry.q3_tokenization_risk ?? '').trim(),
            verdict: String(entry.verdict ?? '').trim(),
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
    : [];

  return {
    diagnosis: {
      ecosystem_judgment: String(diagnosis.ecosystem_judgment ?? '').trim(),
      creator_content_driver: String(diagnosis.creator_content_driver ?? '').trim(),
      competitor_ecosystem: String(diagnosis.competitor_ecosystem ?? '').trim(),
      ambiguity_risk: String(diagnosis.ambiguity_risk ?? '').trim(),
    },
    strategy_decisions: {
      vertical_precision: String(decisions.vertical_precision ?? '').trim(),
      scenario_expansion: String(decisions.scenario_expansion ?? '').trim(),
      competitor_capture: String(decisions.competitor_capture ?? '').trim(),
      content_format_alignment: String(decisions.content_format_alignment ?? '').trim(),
      audience_interest_mapping: String(decisions.audience_interest_mapping ?? '').trim(),
    },
    reflection_check: reflectionCheck,
  };
}

function normalizeStrategyResponse(parsed: Partial<SkillOrchestratedStrategyResponse>, form: ProjectForm): StrategyResponse {
  const groups = Array.isArray(parsed.keyword_strategy_groups)
    ? parsed.keyword_strategy_groups.map((group, index) => normalizeStrategy(group as unknown as Record<string, unknown>, index))
    : [];

  if (groups.length === 0) {
    throw new Error('LLM 返回的关键词策略为空');
  }

  return {
    project_summary: normalizeSummary(parsed.project_summary, form),
    keyword_strategy_groups: groups,
    ai_reasoning: normalizeAiReasoning(parsed.ai_reasoning),
  };
}

function summarizeDiagnosis(result: DiagnosisDecisionResponse) {
  const decisions = Object.values(result.strategy_decisions);
  const outputCount = decisions.filter((item) => item.includes('输出')).length;
  return `已完成四项诊断，5 个策略中建议执行 ${outputCount} 个。`;
}

function summarizeDraft(result: KeywordDraftResponse) {
  const strategyCount = Array.isArray(result.keyword_strategy_groups_draft) ? result.keyword_strategy_groups_draft.length : 0;
  const keywordCount = Array.isArray(result.keyword_strategy_groups_draft)
    ? result.keyword_strategy_groups_draft.reduce((total, group) => total + group.keyword_list.length, 0)
    : 0;
  return `已生成 ${strategyCount} 个策略组草稿，共 ${keywordCount} 条候选关键词。`;
}

function summarizeQuality(result: QualityCheckerResponse) {
  const strategyCount = Array.isArray(result.keyword_strategy_groups_final) ? result.keyword_strategy_groups_final.length : 0;
  const passedCount = Array.isArray(result.reflection_check) ? result.reflection_check.length : 0;
  return `质检通过 ${passedCount} 条关键词，最终保留 ${strategyCount} 个策略组。`;
}

async function callGeminiJson<T>(prompt: string, payload: unknown, stageName: string): Promise<T> {
  const config = getEnvConfig();
  if (!config.apiKey || !config.apiKey.startsWith('AIza')) {
    throw new Error('Gemini API Key 无效：请在 .env.local 设置 VITE_LLM_API_KEY=AIza...（或 VITE_GEMINI_API_KEY=AIza...），然后重启 npm run dev。');
  }

  const response = await fetch(buildGeminiGenerateUrl(config.apiUrl, config.model, config.apiKey), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: prompt }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: `请严格按要求处理并只输出 JSON：\n${JSON.stringify(payload, null, 2)}` }],
        },
      ],
      generationConfig: {
        temperature: Number.isFinite(config.temperature) ? config.temperature : 0.1,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${stageName} 失败：${response.status} ${body}`);
  }

  const data = await response.json() as GeminiGenerateContentResponse;
  const rawText = extractMessageContent(data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? ''));

  if (!rawText) {
    const reason = data.error?.message ? `：${data.error.message}` : '';
    throw new Error(`${stageName} 失败：LLM 未返回可解析内容${reason}`);
  }

  try {
    return parseJsonObject<T>(rawText);
  } catch (error) {
    const detail = error instanceof Error ? error.message : '未知错误';
    throw new Error(`${stageName} 失败：${detail}`);
  }
}

async function runDiagnosisDecision(form: ProjectForm) {
  return callGeminiJson<DiagnosisDecisionResponse>(SKILL_DIAGNOSIS_PROMPT, form, '诊断决策阶段');
}

async function runKeywordGenerator(form: ProjectForm, diagnosisResult: DiagnosisDecisionResponse) {
  return callGeminiJson<KeywordDraftResponse>(
    SKILL_KEYWORD_GENERATOR_PROMPT,
    {
      project_input: form,
      diagnosis_result: diagnosisResult,
    },
    '关键词草稿生成阶段',
  );
}

async function runQualityChecker(draftResult: KeywordDraftResponse) {
  return callGeminiJson<QualityCheckerResponse>(
    SKILL_QUALITY_CHECKER_PROMPT,
    draftResult,
    '质量检查阶段',
  );
}

async function runSkillOrchestrator(
  form: ProjectForm,
  diagnosisResult: DiagnosisDecisionResponse,
  draftResult: KeywordDraftResponse,
  qualityResult: QualityCheckerResponse,
) {
  return callGeminiJson<SkillOrchestratedStrategyResponse>(
    SKILL_MAIN_PROMPT,
    {
      project_input: form,
      diagnosis_result: diagnosisResult,
      draft_result: draftResult,
      quality_result: qualityResult,
    },
    '主调度汇总阶段',
  );
}

export async function requestStrategies(form: ProjectForm, options?: RequestStrategiesOptions) {
  options?.onProgress?.({ stage: 'diagnosis', status: 'started' });
  const diagnosisResult = await runDiagnosisDecision(form);
  options?.onProgress?.({
    stage: 'diagnosis',
    status: 'completed',
    summary: summarizeDiagnosis(diagnosisResult),
    data: diagnosisResult,
  });

  options?.onProgress?.({ stage: 'draft', status: 'started' });
  const draftResult = await runKeywordGenerator(form, diagnosisResult);
  options?.onProgress?.({
    stage: 'draft',
    status: 'completed',
    summary: summarizeDraft(draftResult),
    data: draftResult,
  });

  options?.onProgress?.({ stage: 'quality', status: 'started' });
  const qualityResult = await runQualityChecker(draftResult);
  options?.onProgress?.({
    stage: 'quality',
    status: 'completed',
    summary: summarizeQuality(qualityResult),
    data: qualityResult,
  });

  options?.onProgress?.({ stage: 'orchestrator', status: 'started' });
  const orchestratedResult = await runSkillOrchestrator(form, diagnosisResult, draftResult, qualityResult);
  options?.onProgress?.({
    stage: 'orchestrator',
    status: 'completed',
    summary: `主调度汇总完成，输出 ${orchestratedResult.keyword_strategy_groups?.length ?? 0} 个策略组。`,
    data: orchestratedResult,
  });

  return normalizeStrategyResponse(orchestratedResult, form);
}
