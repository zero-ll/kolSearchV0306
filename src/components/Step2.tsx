import React, { useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeft, Brain, CheckCircle2, CircleDotDashed, FileSearch, Info, ListChecks, RefreshCw, Send, Sparkles } from 'lucide-react';
import type {
  AiReasoning,
  DiagnosisDecisionResponse,
  GenerationStage,
  KeywordDraftResponse,
  KeywordStrategyGroup,
  ProjectSummary,
  QualityCheckerResponse,
} from '../types';
import { parseDelimitedInput } from '../utils/formTransform';

const STAGES = [
  { key: 'diagnosis', label: '诊断层', description: '判断生态和策略决策' },
  { key: 'draft', label: '关键词生成层', description: '产出候选关键词草稿' },
  { key: 'quality', label: '质检层', description: '三问反查和最终定稿' },
] as const;

type StepKey = typeof STAGES[number]['key'];
type StepStatus = 'pending' | 'running' | 'done' | 'error';

function TierSelector({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const options = ['头部', '腰部', '尾部'];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            onClick={() =>
              onChange(active ? selected.filter((item) => item !== option) : [...selected, option])
            }
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function StrategyCard({
  group,
  onChange,
}: {
  group: KeywordStrategyGroup;
  onChange: (next: KeywordStrategyGroup) => void;
}) {
  return (
    <div className="rounded-2xl border border-blue-600/15 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-600">{group.strategy_type}</span>
            {group.lastGeneratedAt && <span className="text-xs text-slate-400">最近生成于 {new Date(group.lastGeneratedAt).toLocaleString()}</span>}
          </div>
          <input
            value={group.keyword_group_name}
            type="text"
            className="w-full rounded-lg border-slate-200 text-lg font-bold text-slate-900 focus:border-blue-600 focus:ring-blue-600"
            onChange={(event) => onChange({ ...group, keyword_group_name: event.target.value })}
          />
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            checked={group.enabled}
            type="checkbox"
            className="peer sr-only"
            onChange={(event) => onChange({ ...group, enabled: event.target.checked })}
          />
          <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full" />
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">关键词组</span>
            <textarea
              value={group.keyword_list.join(', ')}
              rows={4}
              className="w-full resize-none rounded-lg border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-900 focus:border-blue-600 focus:ring-blue-600"
              onChange={(event) => onChange({ ...group, keyword_list: parseDelimitedInput(event.target.value) })}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">策略说明</span>
            <textarea
              value={group.strategy_explanation}
              rows={5}
              className="w-full resize-none rounded-lg border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 focus:border-blue-600 focus:ring-blue-600"
              onChange={(event) => onChange({ ...group, strategy_explanation: event.target.value })}
            />
          </label>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">创作者类型</span>
            <input
              value={group.tags['创作者类型'].join(', ')}
              type="text"
              className="w-full rounded-lg border-slate-200 text-sm focus:border-blue-600 focus:ring-blue-600"
              onChange={(event) =>
                onChange({
                  ...group,
                  tags: {
                    ...group.tags,
                    创作者类型: parseDelimitedInput(event.target.value),
                  },
                })
              }
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">内容形态</span>
            <input
              value={group.tags['内容形态'].join(', ')}
              type="text"
              className="w-full rounded-lg border-slate-200 text-sm focus:border-blue-600 focus:ring-blue-600"
              onChange={(event) =>
                onChange({
                  ...group,
                  tags: {
                    ...group.tags,
                    内容形态: parseDelimitedInput(event.target.value),
                  },
                })
              }
            />
          </label>
          <div>
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">适合层级</span>
            <TierSelector
              selected={group.recommended_creator_tiers}
              onChange={(next) =>
                onChange({
                  ...group,
                  recommended_creator_tiers: next,
                  tags: {
                    ...group.tags,
                    适合层级: next,
                  },
                })
              }
            />
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
            当前状态: {group.enabled ? '已启用，后续可参与任务投递' : '已禁用，不进入后续任务'}
          </div>
        </div>
      </div>
    </div>
  );
}

function getStepStatus(
  step: StepKey,
  generationStage: GenerationStage,
  isGenerating: boolean,
  failedStage: StepKey | null,
): StepStatus {
  const order: StepKey[] = ['diagnosis', 'draft', 'quality'];
  const stepIndex = order.indexOf(step);
  const currentIndex = generationStage === 'diagnosis'
    ? 0
    : generationStage === 'draft'
      ? 1
      : generationStage === 'quality'
        ? 2
        : 3;

  if (generationStage === 'done') {
    return 'done';
  }
  if (generationStage === 'error') {
    if (failedStage === step) {
      return 'error';
    }
    if (failedStage && stepIndex < order.indexOf(failedStage)) {
      return 'done';
    }
    return 'pending';
  }
  if (!isGenerating && generationStage === 'idle') {
    return 'pending';
  }
  if (stepIndex < currentIndex) {
    return 'done';
  }
  if (stepIndex === currentIndex && isGenerating) {
    return 'running';
  }
  return 'pending';
}

function statusClass(status: StepStatus) {
  if (status === 'done') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (status === 'running') return 'border-blue-200 bg-blue-50 text-blue-700';
  if (status === 'error') return 'border-red-200 bg-red-50 text-red-700';
  return 'border-slate-200 bg-white text-slate-500';
}

function statusLabel(status: StepStatus) {
  if (status === 'done') return '已完成';
  if (status === 'running') return '执行中';
  if (status === 'error') return '失败';
  return '待执行';
}

export default function Step2({
  summary,
  aiReasoning,
  strategies,
  isGenerating,
  generationStage,
  failedStage,
  stageSummaries,
  diagnosisPreview,
  draftPreview,
  qualityPreview,
  statusMessage,
  errorMessage,
  onBack,
  onRegenerate,
  onChangeStrategies,
  onSubmit,
}: {
  summary: ProjectSummary | null;
  aiReasoning: AiReasoning | null;
  strategies: KeywordStrategyGroup[];
  isGenerating: boolean;
  generationStage: GenerationStage;
  failedStage: StepKey | null;
  stageSummaries: Partial<Record<StepKey, string>>;
  diagnosisPreview: DiagnosisDecisionResponse | null;
  draftPreview: KeywordDraftResponse | null;
  qualityPreview: QualityCheckerResponse | null;
  statusMessage: string;
  errorMessage: string;
  onBack: () => void;
  onRegenerate: () => void;
  onChangeStrategies: (next: KeywordStrategyGroup[]) => void;
  onSubmit: () => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const enabledCount = strategies.filter((group) => group.enabled).length;

  const diagnosisSource = aiReasoning?.diagnosis ?? diagnosisPreview?.diagnosis ?? null;
  const decisionSource = aiReasoning?.strategy_decisions ?? diagnosisPreview?.strategy_decisions ?? null;
  const reflectionSource = aiReasoning?.reflection_check ?? qualityPreview?.reflection_check ?? [];

  const draftStats = useMemo(() => {
    if (!draftPreview?.keyword_strategy_groups_draft) return { groupCount: 0, keywordCount: 0 };
    return {
      groupCount: draftPreview.keyword_strategy_groups_draft.length,
      keywordCount: draftPreview.keyword_strategy_groups_draft.reduce((sum, group) => sum + group.keyword_list.length, 0),
    };
  }, [draftPreview]);

  const qualityStats = useMemo(() => {
    if (!qualityPreview) return { groupCount: 0, passedCount: 0 };
    return {
      groupCount: qualityPreview.keyword_strategy_groups_final.length,
      passedCount: qualityPreview.reflection_check.length,
    };
  }, [qualityPreview]);

  return (
    <div className="min-h-screen bg-slate-50 pb-32 text-slate-900">
      <header className="sticky top-0 z-40 w-full border-b border-blue-600/10 bg-white/80 px-6 py-3 backdrop-blur-md md:px-20">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Brain className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-blue-600">InfluencerSearch AI</h1>
          </div>
          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="hidden items-center gap-2 rounded-lg border border-blue-600/20 bg-white px-4 py-2 text-sm font-bold text-blue-600 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-blue-300 md:flex"
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            重新生成策略
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-6 py-8 md:px-10">
        <div className="mb-8">
          <button onClick={onBack} className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-600 transition-colors hover:text-blue-600">
            <ArrowLeft className="h-5 w-5" />
            返回需求详情
          </button>
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-black text-slate-900">AI 关键词方案确认</h2>
            <p className="flex items-center gap-2 text-sm italic text-slate-500">
              <Sparkles className="h-4 w-4 text-blue-600" />
              现在按 诊断层 → 关键词生成层 → 质检层 分阶段执行并展示中间结果。
            </p>
          </div>
        </div>

        {(statusMessage || errorMessage) && (
          <div className={`mb-6 rounded-xl border px-4 py-3 text-sm ${errorMessage ? 'border-red-200 bg-red-50 text-red-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>
            {errorMessage || statusMessage}
          </div>
        )}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <CircleDotDashed className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">AI 阶段执行进度</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {STAGES.map((stage) => {
              const status = getStepStatus(stage.key, generationStage, isGenerating, failedStage);
              return (
                <div key={stage.key} className={`rounded-xl border p-4 ${statusClass(status)}`}>
                  <div className="mb-1 flex items-center justify-between text-xs font-bold">
                    <span>{stage.label}</span>
                    <span>{statusLabel(status)}</span>
                  </div>
                  <p className="text-xs opacity-80">{stage.description}</p>
                  {stageSummaries[stage.key] && (
                    <p className="mt-2 text-xs font-medium">{stageSummaries[stage.key]}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {summary && (
          <section className="mb-6 rounded-2xl border border-blue-600/15 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">项目摘要</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">行业分类</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{summary.industry_category || '未返回'}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">品牌 / 产品</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {summary.brand_name || '未返回'} / {summary.product_name || '未返回'}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">核心搜索方向</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {summary.core_search_direction.length > 0 ? summary.core_search_direction.map((item) => (
                    <span key={item} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                      {item}
                    </span>
                  )) : <span className="text-sm text-slate-500">暂无</span>}
                </div>
              </div>
            </div>
          </section>
        )}

        {(diagnosisSource || decisionSource) && (
          <section className="mb-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <FileSearch className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">诊断层结论</h3>
              </div>
              {diagnosisSource ? (
                <div className="space-y-3 text-sm text-slate-700">
                  <div>
                    <p className="text-xs font-bold text-slate-400">内容生态判断</p>
                    <p>{diagnosisSource.ecosystem_judgment || '未返回'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400">创作者内容驱动力</p>
                    <p>{diagnosisSource.creator_content_driver || '未返回'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400">竞品生态</p>
                    <p>{diagnosisSource.competitor_ecosystem || '未返回'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400">歧义风险</p>
                    <p>{diagnosisSource.ambiguity_risk || '未返回'}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">诊断层尚未完成。</p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">策略决策</h3>
              </div>
              {decisionSource ? (
                <div className="space-y-3 text-sm text-slate-700">
                  {Object.entries(decisionSource).map(([key, value]) => (
                    <div key={key} className="rounded-lg border border-slate-200 p-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{key}</p>
                      <p className="mt-1">{value || '未返回'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">策略决策尚未生成。</p>
              )}
            </div>
          </section>
        )}

        <section className="mb-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">关键词草稿层结果摘要</h3>
            <p className="mt-2 text-sm text-slate-600">
              {stageSummaries.draft || '尚未完成关键词草稿生成。'}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              策略组：{draftStats.groupCount}，候选词：{draftStats.keywordCount}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">质检层结果摘要</h3>
            <p className="mt-2 text-sm text-slate-600">
              {stageSummaries.quality || '尚未完成质量检查。'}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              通过词：{qualityStats.passedCount}，最终策略组：{qualityStats.groupCount}
            </p>
          </div>
        </section>

        {reflectionSource.length > 0 && (
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">质检追踪（通过项）</h3>
            </div>
            <div className="space-y-3">
              {reflectionSource.map((item, index) => (
                <details key={`${item.keyword}-${index}`} className="rounded-lg border border-slate-200 p-3">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-800">
                    {item.keyword} · {item.verdict}
                  </summary>
                  <div className="mt-2 space-y-2 text-xs text-slate-600">
                    <p><strong>Q1：</strong>{item.q1_search_result_quality}</p>
                    <p><strong>Q2：</strong>{item.q2_creator_language_match}</p>
                    <p><strong>Q3：</strong>{item.q3_tokenization_risk}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        <section className="flex flex-col gap-6">
          {isGenerating && strategies.length === 0 && (
            <div className="rounded-2xl border border-dashed border-blue-200 bg-white p-10 text-center text-sm text-slate-500">
              正在按三阶段流程生成策略，请查看上方进度与阶段摘要。
            </div>
          )}

          {!isGenerating && strategies.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
              暂无策略结果，请重新生成或检查 LLM 配置。
            </div>
          )}

          {strategies.map((group, index) => (
            <div key={`${group.strategy_type}-${index}`}>
              <StrategyCard
                group={group}
                onChange={(next) =>
                  onChangeStrategies(strategies.map((current, currentIndex) => (currentIndex === index ? next : current)))
                }
              />
            </div>
          ))}
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-blue-600/10 bg-white/90 px-6 py-5 backdrop-blur-xl md:px-20">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <div className="text-sm text-slate-500">
            已启用 <span className="font-bold text-slate-900">{enabledCount}</span> / {strategies.length} 个策略组
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onRegenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 text-sm font-bold text-slate-600 transition-colors hover:text-blue-600 disabled:cursor-not-allowed disabled:text-slate-300 md:hidden"
            >
              <RefreshCw className={`h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
              重新生成
            </button>
            <button
              onClick={() => setShowModal(true)}
              disabled={enabledCount === 0 || isGenerating}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              确认关键词组
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </footer>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl">
            <div className="p-8">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <CheckCircle2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-2 text-center text-2xl font-bold text-slate-900">确认关键词组</h3>
              <p className="mb-8 text-center text-slate-500">已整理好的策略会进入后续任务执行流程，禁用的策略不会继续使用。</p>

              <div className="mb-8 space-y-4 rounded-xl bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">已启用方案数量</span>
                  <span className="text-lg font-bold text-blue-600">{enabledCount} 个方案</span>
                </div>
                <div className="h-px bg-slate-200" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">预计下一步</span>
                  <span className="text-lg font-bold text-slate-900">进入执行页</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowModal(false)} className="flex h-12 items-center justify-center rounded-xl border border-slate-200 font-bold text-slate-600 transition-colors hover:bg-slate-50">
                  返回修改
                </button>
                <button onClick={onSubmit} className="flex h-12 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700">
                  确认
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {generationStage === 'error' && (
        <div className="fixed bottom-28 right-6 z-50 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 shadow-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            当前流程在 {failedStage || '未知'} 阶段失败，请查看错误提示后重试。
          </div>
        </div>
      )}
    </div>
  );
}
