/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AI_REASONING_STORAGE_KEY, DEFAULT_PROJECT_FORM_DRAFT, FORM_STORAGE_KEY, STEP_STORAGE_KEY, STRATEGY_STORAGE_KEY, SUMMARY_STORAGE_KEY, isMeaningfulProjectFormDraft } from './constants/project';
import Dashboard from './components/Dashboard';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import TaskProgress from './components/TaskProgress';
import TaskResults from './components/TaskResults';
import { buildProjectFormPayload } from './utils/formTransform';
import { requestStrategies, type StrategyGenerationProgressEvent } from './utils/llmClient';
import { loadFromStorage, saveToStorage } from './utils/storage';
import type {
  AiReasoning,
  DiagnosisDecisionResponse,
  GenerationStage,
  KeywordDraftResponse,
  KeywordStrategyGroup,
  ProjectFormDraft,
  ProjectSummary,
  QualityCheckerResponse,
} from './types';

type ViewKey = 'dashboard' | 'step1' | 'step2' | 'progress' | 'results';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewKey>(() => loadFromStorage<ViewKey>(STEP_STORAGE_KEY, 'dashboard'));
  const [formDraft, setFormDraft] = useState<ProjectFormDraft>(() => {
    const storedDraft = loadFromStorage(FORM_STORAGE_KEY, DEFAULT_PROJECT_FORM_DRAFT);
    return isMeaningfulProjectFormDraft(storedDraft) ? storedDraft : DEFAULT_PROJECT_FORM_DRAFT;
  });
  const [summary, setSummary] = useState<ProjectSummary | null>(() => loadFromStorage<ProjectSummary | null>(SUMMARY_STORAGE_KEY, null));
  const [strategies, setStrategies] = useState<KeywordStrategyGroup[]>(() => loadFromStorage<KeywordStrategyGroup[]>(STRATEGY_STORAGE_KEY, []));
  const [aiReasoning, setAiReasoning] = useState<AiReasoning | null>(() => loadFromStorage<AiReasoning | null>(AI_REASONING_STORAGE_KEY, null));
  const [generationStage, setGenerationStage] = useState<GenerationStage>('idle');
  const [failedStage, setFailedStage] = useState<'diagnosis' | 'draft' | 'quality' | null>(null);
  const [stageSummaries, setStageSummaries] = useState<Partial<Record<'diagnosis' | 'draft' | 'quality', string>>>({});
  const [diagnosisPreview, setDiagnosisPreview] = useState<DiagnosisDecisionResponse | null>(null);
  const [draftPreview, setDraftPreview] = useState<KeywordDraftResponse | null>(null);
  const [qualityPreview, setQualityPreview] = useState<QualityCheckerResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    saveToStorage(STEP_STORAGE_KEY, currentView);
  }, [currentView]);

  useEffect(() => {
    saveToStorage(FORM_STORAGE_KEY, formDraft);
  }, [formDraft]);

  useEffect(() => {
    saveToStorage(SUMMARY_STORAGE_KEY, summary);
  }, [summary]);

  useEffect(() => {
    saveToStorage(STRATEGY_STORAGE_KEY, strategies);
  }, [strategies]);

  useEffect(() => {
    saveToStorage(AI_REASONING_STORAGE_KEY, aiReasoning);
  }, [aiReasoning]);

  function handleProgress(event: StrategyGenerationProgressEvent) {
    if (event.stage === 'diagnosis') {
      if (event.status === 'started') {
        setGenerationStage('diagnosis');
        setStatusMessage('阶段 1/3：AI 正在执行诊断层...');
        return;
      }
      if (event.summary) {
        setStageSummaries((prev) => ({ ...prev, diagnosis: event.summary }));
      }
      if (event.data) {
        setDiagnosisPreview(event.data as DiagnosisDecisionResponse);
      }
      return;
    }

    if (event.stage === 'draft') {
      if (event.status === 'started') {
        setGenerationStage('draft');
        setStatusMessage('阶段 2/3：AI 正在生成关键词草稿...');
        return;
      }
      if (event.summary) {
        setStageSummaries((prev) => ({ ...prev, draft: event.summary }));
      }
      if (event.data) {
        setDraftPreview(event.data as KeywordDraftResponse);
      }
      return;
    }

    if (event.stage === 'quality') {
      if (event.status === 'started') {
        setGenerationStage('quality');
        setStatusMessage('阶段 3/3：AI 正在执行质量检查...');
        return;
      }
      if (event.summary) {
        setStageSummaries((prev) => ({ ...prev, quality: event.summary }));
      }
      if (event.data) {
        setQualityPreview(event.data as QualityCheckerResponse);
      }
      return;
    }

    if (event.stage === 'orchestrator' && event.status === 'started') {
      setStatusMessage('正在汇总最终结构化结果...');
    }
  }

  async function handleGenerateStrategies() {
    let runningStage: 'diagnosis' | 'draft' | 'quality' = 'diagnosis';
    setIsGenerating(true);
    setCurrentView('step2');
    setErrorMessage('');
    setStatusMessage('阶段 1/3：AI 正在执行诊断层...');
    setGenerationStage('diagnosis');
    setFailedStage(null);
    setStageSummaries({});
    setDiagnosisPreview(null);
    setDraftPreview(null);
    setQualityPreview(null);

    try {
      const payload = buildProjectFormPayload(formDraft);
      const response = await requestStrategies(payload, {
        onProgress: (event) => {
          if (event.status === 'started' && (event.stage === 'diagnosis' || event.stage === 'draft' || event.stage === 'quality')) {
            runningStage = event.stage;
          }
          handleProgress(event);
        },
      });

      setSummary(response.project_summary);
      setStrategies(response.keyword_strategy_groups);
      setAiReasoning(response.ai_reasoning ?? null);
      setGenerationStage('done');
      setStatusMessage(`已生成 ${response.keyword_strategy_groups.length} 组关键词策略，包含完整诊断与质检信息`);
    } catch (error) {
      const message = error instanceof Error ? error.message : '生成策略失败';
      setGenerationStage('error');
      setFailedStage(runningStage);
      setErrorMessage(message);
      setStatusMessage('');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {currentView === 'dashboard' && (
        <Dashboard onStartTask={() => setCurrentView('step1')} onViewResults={() => setCurrentView('results')} />
      )}
      {currentView === 'step1' && (
        <Step1
          formDraft={formDraft}
          isGenerating={isGenerating}
          statusMessage={statusMessage}
          errorMessage={errorMessage}
          onBack={() => setCurrentView('dashboard')}
          onChange={setFormDraft}
          onGenerate={handleGenerateStrategies}
          onReset={() => setFormDraft(DEFAULT_PROJECT_FORM_DRAFT)}
        />
      )}
      {currentView === 'step2' && (
        <Step2
          summary={summary}
          aiReasoning={aiReasoning}
          strategies={strategies}
          isGenerating={isGenerating}
          generationStage={generationStage}
          failedStage={failedStage}
          stageSummaries={stageSummaries}
          diagnosisPreview={diagnosisPreview}
          draftPreview={draftPreview}
          qualityPreview={qualityPreview}
          statusMessage={statusMessage}
          errorMessage={errorMessage}
          onBack={() => setCurrentView('step1')}
          onRegenerate={handleGenerateStrategies}
          onChangeStrategies={setStrategies}
          onSubmit={() => setCurrentView('progress')}
        />
      )}
      {currentView === 'progress' && (
        <TaskProgress onBack={() => setCurrentView('dashboard')} onComplete={() => setCurrentView('results')} />
      )}
      {currentView === 'results' && (
        <TaskResults onBack={() => setCurrentView('dashboard')} />
      )}
    </div>
  );
}
