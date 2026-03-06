import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, CheckCircle2, Clock, Search, Database, Brain, Sparkles, ChevronRight } from 'lucide-react';

export default function TaskProgress({ onBack, onComplete }: { onBack: () => void, onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 1, title: '初始化搜索任务', desc: '分配计算资源，准备全网检索', icon: Clock },
    { id: 2, title: '执行关键词匹配', desc: '基于 AI 方案进行深度内容挖掘', icon: Search },
    { id: 3, title: '数据清洗与去重', desc: '过滤无效数据，提取核心指标', icon: Database },
    { id: 4, title: 'AI 智能评分', desc: '计算红人与品牌的综合匹配度', icon: Brain },
    { id: 5, title: '生成最终报告', desc: '汇总数据，准备可视化图表', icon: Sparkles },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 1000);
          return 100;
        }
        
        const newProgress = prev + 1;
        
        // Update current step based on progress
        if (newProgress < 20) setCurrentStep(0);
        else if (newProgress < 40) setCurrentStep(1);
        else if (newProgress < 60) setCurrentStep(2);
        else if (newProgress < 80) setCurrentStep(3);
        else setCurrentStep(4);

        return newProgress;
      });
    }, 100); // Fast simulation for demo

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b border-blue-600/10 bg-white/80 backdrop-blur-md px-6 md:px-20 py-3">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">任务执行中</h1>
              <p className="text-xs font-medium text-slate-500">智能降噪耳机推广</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[800px] flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full rounded-3xl bg-white p-10 shadow-xl shadow-blue-600/5 border border-slate-200 relative overflow-hidden">
          
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
            <div 
              className="h-full bg-blue-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-50 text-blue-600 mb-6 relative">
              {progress < 100 ? (
                <Loader2 className="w-12 h-12 animate-spin" />
              ) : (
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              )}
              <div className="absolute -bottom-2 bg-white px-3 py-1 rounded-full border border-slate-200 text-sm font-bold shadow-sm">
                {progress}%
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              {progress < 100 ? 'AI 正在全网搜寻匹配红人...' : '搜索完成！'}
            </h2>
            <p className="text-slate-500">
              {progress < 100 ? '预计还需 3 分钟，您可以离开此页面，任务将在后台继续执行。' : '正在为您跳转至结果页面...'}
            </p>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isPast = index < currentStep;

              return (
                <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm transition-colors duration-300 ${
                    isActive ? 'bg-blue-600 text-white' : 
                    isPast ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />}
                  </div>
                  
                  <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-xl border transition-all duration-300 ${
                    isActive ? 'border-blue-600/30 bg-blue-50/50 shadow-md shadow-blue-600/5' : 
                    isPast ? 'border-slate-200 bg-white opacity-70' : 'border-dashed border-slate-200 bg-slate-50 opacity-50'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-bold ${isActive ? 'text-blue-700' : isPast ? 'text-slate-900' : 'text-slate-500'}`}>
                        {step.title}
                      </h3>
                      {isActive && <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">执行中</span>}
                    </div>
                    <p className="text-xs text-slate-500">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-slate-500">
          <Sparkles className="w-4 h-4 text-blue-600" />
          AI 已为您节省约 45 小时的人工筛选时间
        </div>
      </main>
    </div>
  );
}
