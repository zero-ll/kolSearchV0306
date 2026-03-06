import React from 'react';
import { LineChart, Home, Package, Wand2, Sparkles, Upload, Link, Users, FileText, CheckCircle2, ArrowRight, X, ChevronDown, Rocket } from 'lucide-react';

export default function Step1({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="sticky top-0 z-50 bg-white border-b border-blue-600/10 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600/10 p-2 rounded-lg text-blue-600">
            <LineChart className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold tracking-tight">达人深度搜索</h2>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Home className="w-5 h-5" />
            返回首页
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">管理员</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 pb-32">
        <div className="mb-10">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold">需求配置 (AI 解析增强版)</h1>
              <p className="text-slate-500 text-sm mt-1">请详细配置您的产品信息与达人筛选策略，以获得更精准的搜索结果</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-blue-600">当前环节: 步骤 1 需求配置</p>
              <p className="text-xs text-slate-400 mt-0.5">下一步: 步骤 2 关键词配置</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <section className="bg-white rounded-xl border border-blue-600/10 p-6 shadow-sm">
            <div className="flex flex-col gap-6 mb-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Package className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold">模块 1: 产品信息</h2>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-bold rounded-lg transition-all">
                    <Wand2 className="w-5 h-5" />
                    使用示例填充
                  </button>
                </div>
              </div>

              <div className="bg-blue-600/5 rounded-xl p-5 border border-blue-600/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-blue-600">AI 智能解析填充</h3>
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium ml-2">推荐</span>
                  </div>
                  <p className="text-xs text-slate-500">AI 将自动爬取并解析您提供的 PDF 或链接，智能填充下方产品信息</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-blue-600/30 rounded-lg hover:bg-blue-600/10 transition-colors cursor-pointer bg-white">
                      <div className="flex items-center gap-2 text-blue-600">
                        <Upload className="w-5 h-5" />
                        <span className="text-sm font-bold">上传产品 PDF</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1">支持：产品手册、介绍文档、方案书</span>
                      <input type="file" className="hidden" />
                    </label>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="relative">
                      <Link className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="输入产品详情页或官网链接" className="w-full h-12 pl-10 pr-4 rounded-lg border-slate-200 bg-white focus:ring-blue-600 focus:border-blue-600 text-sm" />
                    </div>
                    <button className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all">
                      <Rocket className="w-5 h-5" />
                      立即开始解析
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-1.5 block">行业</span>
                <input type="text" placeholder="如：美妆个护" className="w-full rounded-lg border-slate-200 bg-slate-50 focus:ring-blue-600 focus:border-blue-600 text-sm" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-1.5 block">核心品类词</span>
                <input type="text" placeholder="如：精华液, 抗衰老" className="w-full rounded-lg border-slate-200 bg-slate-50 focus:ring-blue-600 focus:border-blue-600 text-sm" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-1.5 block">本品品牌名</span>
                <input type="text" placeholder="输入您的品牌名" className="w-full rounded-lg border-slate-200 bg-slate-50 focus:ring-blue-600 focus:border-blue-600 text-sm" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-1.5 block">竞品品牌</span>
                <input type="text" placeholder="多个品牌用逗号分隔" className="w-full rounded-lg border-slate-200 bg-slate-50 focus:ring-blue-600 focus:border-blue-600 text-sm" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-1.5 block">推广产品名</span>
                <input type="text" placeholder="本次推广的具体单品" className="w-full rounded-lg border-slate-200 bg-slate-50 focus:ring-blue-600 focus:border-blue-600 text-sm" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-1.5 block">对标竞品名</span>
                <input type="text" placeholder="对应的竞品单品" className="w-full rounded-lg border-slate-200 bg-slate-50 focus:ring-blue-600 focus:border-blue-600 text-sm" />
              </label>
              <label className="block lg:col-span-1">
                <span className="text-sm font-semibold text-slate-700 mb-1.5 block">产品核心卖点</span>
                <textarea placeholder="描述产品的核心优势..." className="w-full h-24 rounded-lg border-slate-200 bg-slate-50 focus:ring-blue-600 focus:border-blue-600 text-sm resize-none"></textarea>
              </label>
              <label className="block lg:col-span-1">
                <span className="text-sm font-semibold text-slate-700 mb-1.5 block">产品使用场景</span>
                <textarea placeholder="推荐的使用场景..." className="w-full h-24 rounded-lg border-slate-200 bg-slate-50 focus:ring-blue-600 focus:border-blue-600 text-sm resize-none"></textarea>
              </label>
              <label className="block lg:col-span-1">
                <span className="text-sm font-semibold text-slate-700 mb-1.5 block">产品适用人群</span>
                <div className="flex flex-wrap gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg h-24 overflow-y-auto">
                  <span className="bg-blue-600/10 text-blue-600 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">25-35岁女性 <X className="w-3 h-3 cursor-pointer" /></span>
                  <span className="bg-blue-600/10 text-blue-600 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">上班族 <X className="w-3 h-3 cursor-pointer" /></span>
                  <input type="text" placeholder="添加..." className="bg-transparent border-none focus:ring-0 text-sm p-0 w-20" />
                </div>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-1.5 block">目标投放国家 (多选)</span>
                <div className="flex flex-wrap gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg min-h-[42px] cursor-pointer">
                  <span className="bg-blue-600/10 text-blue-600 text-xs font-bold px-2 py-1 rounded">美国</span>
                  <span className="bg-blue-600/10 text-blue-600 text-xs font-bold px-2 py-1 rounded">英国</span>
                  <ChevronDown className="w-5 h-5 text-slate-400 ml-auto" />
                </div>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-1.5 block">目标博主类型</span>
                <input type="text" placeholder="如：生活方式, 科技测评" className="w-full rounded-lg border-slate-200 bg-slate-50 focus:ring-blue-600 focus:border-blue-600 text-sm" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-1.5 block">内容风格偏好</span>
                <input type="text" placeholder="如：极简, 搞怪, 叙事" className="w-full rounded-lg border-slate-200 bg-slate-50 focus:ring-blue-600 focus:border-blue-600 text-sm" />
              </label>
              <label className="block lg:col-span-2">
                <span className="text-sm font-semibold text-slate-700 mb-1.5 block">视频必需场景元素</span>
                <input type="text" placeholder="如：开箱展示, 近距质地特写, 30天对比" className="w-full rounded-lg border-slate-200 bg-slate-50 focus:ring-blue-600 focus:border-blue-600 text-sm" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-1.5 block">红人合作策略 (单选)</span>
                <select className="w-full rounded-lg border-slate-200 bg-slate-50 focus:ring-blue-600 focus:border-blue-600 text-sm">
                  <option>平衡型</option>
                  <option>保守型</option>
                  <option>激进型</option>
                </select>
              </label>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">模块 2: 达人分层与筛选要求</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Head Tier */}
              <div className="bg-white border-2 border-blue-600/20 rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="bg-blue-600/5 p-4 border-b border-blue-600/10 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-blue-600 text-lg">头部达人</h3>
                    <p className="text-xs text-blue-600/60 font-medium">行业顶级领袖 (Mega)</p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" name="toggle-head" id="toggle-head" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer focus:outline-none right-0 border-blue-600 bg-blue-600" defaultChecked />
                    <label htmlFor="toggle-head" className="toggle-label block overflow-hidden h-6 rounded-full bg-blue-600/20 cursor-pointer"></label>
                  </div>
                </div>
                <div className="p-5 space-y-4 flex-grow">
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">粉丝区间 (Min)</span>
                      <input type="text" defaultValue="500,000" className="w-full mt-1 rounded border-slate-200 text-sm" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">粉丝区间 (Max)</span>
                      <input type="text" defaultValue="2,000,000+" className="w-full mt-1 rounded border-slate-200 text-sm" />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">目标签约数</span>
                      <input type="number" defaultValue="10" className="w-full mt-1 rounded border-slate-200 text-sm" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Pitch 成功率 (%)</span>
                      <input type="text" defaultValue="5%" className="w-full mt-1 rounded border-slate-200 text-sm" />
                    </label>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-slate-50">
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">均播要求 (可选)</span>
                      <input type="text" placeholder="如: 100k+" className="w-full mt-1 rounded border-slate-200 text-sm" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">互动率要求 (可选)</span>
                      <input type="text" placeholder="如: 2%+" className="w-full mt-1 rounded border-slate-200 text-sm" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">发布频率要求 (可选)</span>
                      <select className="w-full mt-1 rounded border-slate-200 text-sm">
                        <option>每周 1+ 篇</option>
                        <option>每周 3+ 篇</option>
                        <option>每日更新</option>
                      </select>
                    </label>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500">爬取基数:</span>
                  <span className="text-sm font-bold text-blue-600">~200 位达人</span>
                </div>
              </div>

              {/* Mid Tier */}
              <div className="bg-white border-2 border-blue-600/20 rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="bg-blue-600/5 p-4 border-b border-blue-600/10 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-blue-600 text-lg">腰部达人</h3>
                    <p className="text-xs text-blue-600/60 font-medium">中坚力量 (Macro/Mid)</p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" name="toggle-mid" id="toggle-mid" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer focus:outline-none right-0 border-blue-600 bg-blue-600" defaultChecked />
                    <label htmlFor="toggle-mid" className="toggle-label block overflow-hidden h-6 rounded-full bg-blue-600/20 cursor-pointer"></label>
                  </div>
                </div>
                <div className="p-5 space-y-4 flex-grow">
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">粉丝区间 (Min)</span>
                      <input type="text" defaultValue="50,000" className="w-full mt-1 rounded border-slate-200 text-sm" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">粉丝区间 (Max)</span>
                      <input type="text" defaultValue="500,000" className="w-full mt-1 rounded border-slate-200 text-sm" />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">目标签约数</span>
                      <input type="number" defaultValue="50" className="w-full mt-1 rounded border-slate-200 text-sm" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Pitch 成功率 (%)</span>
                      <input type="text" defaultValue="12%" className="w-full mt-1 rounded border-slate-200 text-sm" />
                    </label>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-slate-50">
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">均播要求 (可选)</span>
                      <input type="text" defaultValue="15k+" className="w-full mt-1 rounded border-slate-200 text-sm" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">互动率要求 (可选)</span>
                      <input type="text" defaultValue="4%+" className="w-full mt-1 rounded border-slate-200 text-sm" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">发布频率要求 (可选)</span>
                      <select className="w-full mt-1 rounded border-slate-200 text-sm">
                        <option>每周 3+ 篇</option>
                        <option>每周 1+ 篇</option>
                        <option>每日更新</option>
                      </select>
                    </label>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500">爬取基数:</span>
                  <span className="text-sm font-bold text-blue-600">~410 位达人</span>
                </div>
              </div>

              {/* Tail Tier */}
              <div className="bg-white border-2 border-blue-600/20 rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="bg-blue-600/5 p-4 border-b border-blue-600/10 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-blue-600 text-lg">尾部达人</h3>
                    <p className="text-xs text-blue-600/60 font-medium">微型影响力 (Micro/Nano)</p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" name="toggle-tail" id="toggle-tail" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer focus:outline-none right-0 border-blue-600 bg-blue-600" defaultChecked />
                    <label htmlFor="toggle-tail" className="toggle-label block overflow-hidden h-6 rounded-full bg-blue-600/20 cursor-pointer"></label>
                  </div>
                </div>
                <div className="p-5 space-y-4 flex-grow">
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">粉丝区间 (Min)</span>
                      <input type="text" defaultValue="5,000" className="w-full mt-1 rounded border-slate-200 text-sm" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">粉丝区间 (Max)</span>
                      <input type="text" defaultValue="50,000" className="w-full mt-1 rounded border-slate-200 text-sm" />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">目标签约数</span>
                      <input type="number" defaultValue="150" className="w-full mt-1 rounded border-slate-200 text-sm" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Pitch 成功率 (%)</span>
                      <input type="text" defaultValue="25%" className="w-full mt-1 rounded border-slate-200 text-sm" />
                    </label>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-slate-50">
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">均播要求 (可选)</span>
                      <input type="text" defaultValue="2k+" className="w-full mt-1 rounded border-slate-200 text-sm" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">互动率要求 (可选)</span>
                      <input type="text" defaultValue="6%+" className="w-full mt-1 rounded border-slate-200 text-sm" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">发布频率要求 (可选)</span>
                      <select className="w-full mt-1 rounded border-slate-200 text-sm">
                        <option>每周 3+ 篇</option>
                        <option>每周 1+ 篇</option>
                        <option>每日更新</option>
                      </select>
                    </label>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500">爬取基数:</span>
                  <span className="text-sm font-bold text-blue-600">~600 位达人</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-slate-100 rounded-xl border border-slate-200">
            <button className="w-full flex items-center justify-between p-4 focus:outline-none">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-slate-500" />
                <span className="font-bold text-slate-700">查看生成的摘要需求</span>
              </div>
              <ChevronDown className="w-6 h-6 text-slate-400" />
            </button>
          </section>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-blue-600/10 px-8 py-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-2 text-slate-500">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium">配置已自动保存</span>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 rounded-lg border border-slate-200 font-semibold hover:bg-slate-50 transition-colors">
            保存为模板
          </button>
          <button onClick={onNext} className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
            下一步：生成关键词方案
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
