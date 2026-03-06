import React from 'react';
import { Network, CheckCircle2, RefreshCw, Sparkles, Globe, BarChart2, Plus, Eye } from 'lucide-react';

export default function Dashboard({ onStartTask, onViewResults }: { onStartTask: () => void, onViewResults: () => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="flex items-center justify-between px-6 md:px-20 py-4 bg-white border-b border-blue-600/10">
        <div className="flex items-center gap-3 text-blue-600">
          <Network className="w-8 h-8" />
          <h2 className="text-xl font-bold text-slate-900">InfluencerSearch</h2>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-blue-600">控制台</a>
          <a href="#" className="hover:text-blue-600">价格方案</a>
          <a href="#" className="hover:text-blue-600">帮助中心</a>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">个人中心</button>
          <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-blue-100" />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center pt-20 px-6">
        <div className="text-center max-w-3xl mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">拓展您的海外影响力</h1>
          <p className="text-lg text-slate-600 mb-10">利用 AI 技术，根据您的品牌需求精准发现并分析全球红人。</p>
          <button 
            onClick={onStartTask}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all hover:-translate-y-1"
          >
            <Plus className="w-6 h-6" />
            创建新红人搜索任务
          </button>
        </div>

        <div className="w-full max-w-4xl mb-20">
          <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-6">
            <RefreshCw className="w-6 h-6 text-blue-600" />
            最近任务
          </h3>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={onViewResults}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-bold text-lg text-slate-900">北美科技类博主搜索</h4>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">已完成</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>创建时间: 10月24日, 10:15 AM</span>
                    <span>完成时间: 10月24日, 10:18 AM</span>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 transition-colors">
                <Eye className="w-4 h-4" />
                查看结果
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-blue-200 flex items-center justify-between shadow-sm relative overflow-hidden">
              <div className="absolute bottom-0 left-0 h-1 bg-blue-600 w-1/3 rounded-r-full"></div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 animate-spin-slow">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-bold text-lg text-slate-900">东南亚生活方式 Vlogger</h4>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">运行中</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>创建时间: 今天, 2:30 PM</span>
                    <span className="text-blue-600 font-medium">预计完成: 2:35 PM</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-slate-500 italic">任务正在后台运行，请稍后查看</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl pb-20">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <Sparkles className="w-8 h-8 text-blue-600 mb-4" />
            <h4 className="text-lg font-bold text-slate-900 mb-2">AI 关键词生成</h4>
            <p className="text-slate-600 text-sm leading-relaxed">根据您的营销目标，自动提取关键词以实现精准的细分受众定位。</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <Globe className="w-8 h-8 text-blue-600 mb-4" />
            <h4 className="text-lg font-bold text-slate-900 mb-2">全球覆盖</h4>
            <p className="text-slate-600 text-sm leading-relaxed">即刻在 50 多个国家的 TikTok、Instagram 和 YouTube 上寻找红人。</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <BarChart2 className="w-8 h-8 text-blue-600 mb-4" />
            <h4 className="text-lg font-bold text-slate-900 mb-2">数据可视化</h4>
            <p className="text-slate-600 text-sm leading-relaxed">直观的分析数据，帮助您做出以数据驱动的合作伙伴决策。</p>
          </div>
        </div>
      </main>
    </div>
  );
}
