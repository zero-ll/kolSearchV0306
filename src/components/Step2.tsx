import React, { useState } from 'react';
import { Brain, ArrowLeft, Sparkles, TrendingUp, Heart, Zap, AlertTriangle, Info, CheckCircle2, Send, Rocket, X, RefreshCw } from 'lucide-react';

export default function Step2({ onBack, onSubmit }: { onBack: () => void, onSubmit: () => void }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-32">
      <header className="sticky top-0 z-40 w-full border-b border-blue-600/10 bg-white/80 backdrop-blur-md px-6 md:px-20 py-3">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Brain className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-blue-600">InfluencerSearch AI</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-6 md:px-10 py-8">
        <div className="mb-8">
          <button onClick={onBack} className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            返回需求详情
          </button>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-900">AI 关键词方案确认</h2>
                <p className="mt-2 text-sm text-slate-500 italic flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  AI 已根据您的营销目标生成了以下方案，您可以直接点击修改关键词。
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Plan A */}
          <div className="group relative flex flex-col rounded-xl border-2 border-blue-600/40 bg-white p-6 shadow-md shadow-blue-600/5 transition-all">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">细分领域权威方案</h3>
              </div>
              <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
              </label>
            </div>
            <div className="mb-4 space-y-4">
              <div>
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">关键词 (正在编辑)</span>
                <textarea className="w-full resize-none rounded-lg border-blue-600 bg-white p-3 text-sm font-medium text-slate-900 outline-none ring-2 ring-blue-600/20" rows={2} defaultValue="#科技评测, #开箱视频, #数码产品, #硬核测评, #黑科技|" autoFocus></textarea>
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-blue-600">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-semibold">AI 正在校验方案风险...</span>
                </div>
              </div>
              <div>
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">推荐理由</span>
                <p className="text-sm text-slate-600">精准触达具有高购买意向、追求技术验证和购买建议的核心受众。</p>
              </div>
            </div>
          </div>

          {/* Plan B */}
          <div className="group relative flex flex-col rounded-xl border border-red-500/30 bg-white p-6 shadow-sm transition-all hover:border-red-500/50 hover:shadow-md">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">广泛覆盖策略</h3>
              </div>
              <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
              </label>
            </div>
            <div className="mb-4 space-y-4">
              <div>
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">关键词 (点击修改)</span>
                <textarea className="w-full resize-none rounded-lg border-red-500/30 bg-red-50 p-3 text-sm font-medium text-red-600 transition-colors focus:border-red-500 focus:ring-1 focus:ring-red-500" rows={2} defaultValue="#生活方式, #日常Vlog, #晨间仪式, #生产力工具, #内卷, #躺平"></textarea>
                <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-red-700">
                    <AlertTriangle className="w-4 h-4" />
                    存在潜在风险
                  </p>
                  <ul className="mb-3 space-y-1.5 text-xs text-red-600">
                    <li><strong className="font-semibold">风险点：</strong> 包含负面或极化词汇（#内卷, #躺平）。</li>
                    <li><strong className="font-semibold">影响范围：</strong> 可能引发现状焦虑讨论，偏离品牌正向调性。</li>
                    <li><strong className="font-semibold">AI 优化建议：</strong> 建议移除极化词汇，替换为 #自我提升, #高效生活。</li>
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    <button className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors">一键优化</button>
                    <button className="rounded-md border border-red-600 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors">重新调整</button>
                    <button className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">仍要使用</button>
                  </div>
                </div>
              </div>
              <div>
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">推荐理由</span>
                <p className="text-sm text-slate-600">通过渗透多样化的日常内容，最大化品牌曝光，提高受众认知度。</p>
              </div>
            </div>
          </div>

          {/* Plan C */}
          <div className="group relative flex flex-col rounded-xl border border-amber-500/30 bg-white p-6 shadow-sm transition-all hover:border-amber-500/50 hover:shadow-md">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">高参与度中心</h3>
              </div>
              <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
              </label>
            </div>
            <div className="mb-4 space-y-4">
              <div>
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-800">
                  <Info className="w-3 h-3" />
                  用户确认使用，存在风险
                </div>
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">关键词 (点击修改)</span>
                <textarea className="w-full resize-none rounded-lg border-blue-600/20 bg-blue-600/5 p-3 text-sm font-medium text-blue-600 transition-colors focus:border-blue-600 focus:ring-1 focus:ring-blue-600" rows={2} defaultValue="#粉丝互动, #有问必答, #直播带货, #便宜好货"></textarea>
              </div>
              <div>
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">推荐理由</span>
                <p className="text-sm text-slate-600">优先选择具有高互动率和深厚粉丝粘性的社区领袖。</p>
              </div>
            </div>
          </div>

          {/* Plan D */}
          <div className="group relative flex flex-col rounded-xl border border-blue-600/10 bg-white p-6 shadow-sm transition-all hover:border-blue-600/40 hover:shadow-md">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">趋势引领方案</h3>
              </div>
              <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
              </label>
            </div>
            <div className="mb-4 space-y-4">
              <div>
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">关键词 (点击修改)</span>
                <textarea className="w-full resize-none rounded-lg border-blue-600/20 bg-blue-600/5 p-3 text-sm font-medium text-blue-600 transition-colors focus:border-blue-600 focus:ring-1 focus:ring-blue-600" rows={2} defaultValue="#热门挑战, #爆款推荐, #当下最火, #病毒式传播"></textarea>
                <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  AI 校验通过，该方案无明显风险
                </p>
              </div>
              <div>
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">推荐理由</span>
                <p className="text-sm text-slate-600">利用当前流行的病毒式趋势和挑战，激发品牌的指数级增长。</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-blue-600/10 bg-white/90 px-6 py-5 backdrop-blur-xl md:px-20">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <button className="flex items-center gap-2 text-sm font-bold text-slate-600 transition-colors hover:text-blue-600">
            <RefreshCw className="w-5 h-5" />
            恢复默认方案
          </button>
          <div className="flex items-center gap-4">
            <div className="hidden text-right md:block">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">任务预览</p>
              <p className="text-xs font-bold text-slate-700">已启用 3 个自定义方案</p>
            </div>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 active:scale-[0.98]">
              提交搜索任务
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20">
            <div className="p-8">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Rocket className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-center text-slate-900 mb-2">确认启动搜索任务</h3>
              <p className="text-slate-500 text-center mb-8">AI 将基于您选择的关键词方案进行全网深度检索。</p>
              
              <div className="bg-slate-50 rounded-xl p-5 mb-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">已启用方案数量</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">3 个方案</span>
                </div>
                <div className="h-px bg-slate-200"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <div className="w-5 h-5 rounded-full border-2 border-slate-600 flex items-center justify-center">
                      <div className="w-1 h-2 bg-slate-600 rounded-full origin-bottom rotate-45 -translate-y-0.5"></div>
                    </div>
                    <span className="text-sm font-medium">预计耗时</span>
                  </div>
                  <span className="text-lg font-bold text-slate-900">约 5 分钟</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowModal(false)} className="h-12 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">
                  返回修改
                </button>
                <button onClick={onSubmit} className="h-12 flex items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                  确认并启动
                </button>
              </div>
            </div>
            <div className="bg-blue-50 px-8 py-3 flex items-center justify-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-blue-700">任务启动后可在首页查看进度</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
