import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, BadgeCheck, Play, Download, Plus, X, ChevronUp, Star, BarChart2, ExternalLink, Zap, Brain, Sparkles, Link as LinkIcon, Share2, Eye, Heart, Film } from 'lucide-react';

export default function TaskResults({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const influencers = [
    {
      id: 1,
      name: 'TechWithAlex',
      verified: true,
      country: '美国',
      tier: '头部',
      tag: '推荐',
      followers: '120万',
      avgViews: '45万',
      engagement: '8.4%',
      score: '98',
      avatar: 'https://i.pravatar.cc/150?img=1',
      videoThumbnail: 'https://picsum.photos/seed/tech1/300/200',
      status: 'addable'
    },
    {
      id: 2,
      name: 'GameMasterPro',
      verified: false,
      country: '美国',
      tier: '中部',
      tag: '低于基准',
      followers: '42万',
      avgViews: '1.2万',
      engagement: '1.2%',
      score: '42',
      avatar: 'https://i.pravatar.cc/150?img=2',
      videoThumbnail: 'https://picsum.photos/seed/tech2/300/200',
      status: 'unaddable'
    },
    {
      id: 3,
      name: 'SarahVlogs',
      verified: false,
      country: '美国',
      tier: '尾部',
      tag: '推荐',
      followers: '8.5万',
      avgViews: '11万',
      engagement: '12.5%',
      score: '89',
      avatar: 'https://i.pravatar.cc/150?img=3',
      videoThumbnail: 'https://picsum.photos/seed/tech3/300/200',
      status: 'addable'
    },
    {
      id: 4,
      name: 'PixelPerfect',
      verified: false,
      country: '美国',
      tier: '头部',
      tag: '推荐',
      followers: '240万',
      avgViews: '110万',
      engagement: '5.9%',
      score: '95',
      avatar: 'https://i.pravatar.cc/150?img=4',
      videoThumbnail: 'https://picsum.photos/seed/tech4/300/200',
      status: 'addable'
    },
    {
      id: 5,
      name: 'MinimalistHome',
      verified: false,
      country: '美国',
      tier: '中部',
      tag: '推荐',
      followers: '31万',
      avgViews: '9.5万',
      engagement: '6.2%',
      score: '82',
      avatar: 'https://i.pravatar.cc/150?img=5',
      videoThumbnail: 'https://picsum.photos/seed/tech5/300/200',
      status: 'addable'
    },
    {
      id: 6,
      name: 'FitLife_Milly',
      verified: false,
      country: '美国',
      tier: '尾部',
      tag: '推荐',
      followers: '1.5万',
      avgViews: '2.2万',
      engagement: '18.2%',
      score: '91',
      avatar: 'https://i.pravatar.cc/150?img=6',
      videoThumbnail: 'https://picsum.photos/seed/tech6/300/200',
      status: 'addable'
    }
  ];

  const handleCardClick = (inf: any) => {
    setSelectedInfluencer(inf);
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 font-sans pb-40">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 px-6 py-4">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-900">红人搜索系统</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
              返回首页
            </button>
            <div className="h-8 w-8 rounded-full bg-orange-100 border border-orange-200 overflow-hidden">
              <div className="w-full h-full bg-orange-200/50"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1200px] flex-col px-6 py-8">
        
        {/* Tabs */}
        <div className="mb-6 flex items-center gap-8 border-b border-slate-200">
          {[
            { id: 'all', label: '全部红人' },
            { id: 'head', label: '头部 (Tier 1)' },
            { id: 'mid', label: '中部 (Tier 2)' },
            { id: 'tail', label: '尾部 (Tier 3)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-bold transition-all relative ${
                activeTab === tab.id
                  ? 'text-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-8 flex items-center justify-between rounded-xl bg-white p-3 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex rounded-lg bg-slate-100 p-1">
              {['全部', '推荐', '低于基准'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-1.5 text-sm font-bold rounded-md transition-all ${
                    activeFilter === filter
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="h-5 w-px bg-slate-200"></div>
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <span className="text-base leading-none">🌍</span>
              美国
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          <div className="flex items-center gap-3 pr-2">
            <span className="text-sm text-slate-500">排序依据:</span>
            <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 shadow-sm">
              综合评分
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {influencers.map((inf) => (
            <div 
              key={inf.id} 
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md cursor-pointer relative overflow-hidden group"
              onClick={() => handleCardClick(inf)}
            >
              {/* Left border accent for recommended */}
              {inf.tag === '推荐' && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
              )}

              <div className="mb-5 flex items-start justify-between pl-1">
                <div className="flex items-center gap-3">
                  <img src={inf.avatar} alt={inf.name} className="h-12 w-12 rounded-full border border-slate-200 object-cover" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-1">
                      {inf.name}
                      {inf.verified && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{inf.country} • {inf.tier}</p>
                  </div>
                </div>
                <span className={`rounded px-2.5 py-1 text-xs font-bold ${
                  inf.tag === '推荐' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  {inf.tag}
                </span>
              </div>

              <div className="mb-6 flex gap-4 pl-1">
                <div className="relative h-[84px] w-[120px] shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <img src={inf.videoThumbnail} alt="Video thumbnail" className="h-full w-full object-cover opacity-90" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm">
                      <Play className="w-4 h-4 text-slate-700 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1 text-center text-[10px] font-medium text-white">
                    相关视频
                  </div>
                </div>
                
                <div className="grid flex-1 grid-cols-2 gap-y-3 gap-x-2 content-center">
                  <div>
                    <p className="text-[11px] text-slate-500 mb-0.5">粉丝</p>
                    <p className="text-sm font-bold text-slate-900">{inf.followers}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 mb-0.5">均播</p>
                    <p className={`text-sm font-bold ${inf.tag === '低于基准' ? 'text-slate-400' : 'text-slate-900'}`}>{inf.avgViews}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 mb-0.5">互动</p>
                    <p className={`text-sm font-bold ${inf.tag === '低于基准' ? 'text-slate-400' : 'text-blue-600'}`}>{inf.engagement}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 mb-0.5">评分</p>
                    <p className={`text-sm font-bold flex items-center gap-1 ${inf.tag === '低于基准' ? 'text-slate-400' : 'text-blue-600'}`}>
                      {inf.score} {inf.tag === '推荐' && <Star className="w-3 h-3 fill-blue-600 text-blue-600" />}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto flex gap-3 pl-1">
                <button className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                  查看详情
                </button>
                {inf.status === 'addable' ? (
                  <button 
                    className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    onClick={(e) => { e.stopPropagation(); /* Add to list logic */ }}
                  >
                    <Plus className="w-4 h-4" />
                    加入名单
                  </button>
                ) : (
                  <button 
                    className="flex-1 rounded-lg bg-slate-100 py-2.5 text-sm font-bold text-slate-400 cursor-not-allowed"
                    onClick={(e) => e.stopPropagation()}
                  >
                    无法添加
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-[1000px] px-6">
        <div className="flex items-center justify-between rounded-2xl bg-[#0F172A] px-6 py-4 shadow-2xl border border-slate-800">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-slate-400 mb-0.5 font-medium">已选结果</p>
              <p className="text-sm text-white flex items-center gap-2">
                <span className="text-xl font-bold text-blue-400">12</span> 名红人已加入提案名单
              </p>
            </div>
            <div className="flex -space-x-2">
              <img src="https://i.pravatar.cc/150?img=1" className="w-8 h-8 rounded-full border-2 border-[#0F172A]" alt="" />
              <img src="https://i.pravatar.cc/150?img=3" className="w-8 h-8 rounded-full border-2 border-[#0F172A]" alt="" />
              <img src="https://i.pravatar.cc/150?img=4" className="w-8 h-8 rounded-full border-2 border-[#0F172A]" alt="" />
              <div className="w-8 h-8 rounded-full border-2 border-[#0F172A] bg-slate-700 flex items-center justify-center text-xs text-white font-bold">+9</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700">
              <ChevronUp className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-100 transition-colors shadow-sm">
              <Download className="w-4 h-4" />
              导出表格
            </button>
            <button className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-sm">
              创建活动方案
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        ></div>
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 bottom-0 w-full max-w-3xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col border-l border-blue-600/20 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-blue-600/10 bg-white">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <div className="size-20 rounded-full bg-blue-600/10 border-2 border-blue-600 overflow-hidden">
                  <img alt={selectedInfluencer?.name} className="w-full h-full object-cover" src={selectedInfluencer?.avatar} />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-red-600 rounded-full p-1 text-white border-2 border-white">
                  <Play className="w-3 h-3 fill-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  {selectedInfluencer?.name}
                  {selectedInfluencer?.verified && <BadgeCheck className="w-5 h-5 text-blue-500" />}
                </h2>
                <a className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1" href="#">
                  youtube.com/@{selectedInfluencer?.name.toLowerCase()}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            <button 
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 hover:bg-blue-600/10 rounded-full transition-colors text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">国家/地区</span>
              <span className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                <span className="text-sm">🌍</span> {selectedInfluencer?.country}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">粉丝数</span>
              <span className="text-sm font-semibold text-slate-900">{selectedInfluencer?.followers}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">等级</span>
              <span className="text-sm font-semibold text-slate-900">{selectedInfluencer?.tier}红人</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">综合评分</span>
              <span className="text-sm font-bold text-blue-600 flex items-center gap-1">
                <Zap className="w-4 h-4 fill-blue-600" /> {selectedInfluencer?.score}/100
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#F8F9FB]">
          {/* AI Recommendation Summary */}
          <section className="bg-white rounded-xl p-6 border border-blue-600/20 shadow-sm relative overflow-hidden">
            <div className="absolute top-4 right-4 opacity-10">
              <Brain className="w-24 h-24 text-blue-600" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">AI 推荐总结</h3>
              </div>
              <ol className="space-y-3 list-decimal list-inside text-sm text-slate-700">
                <li>商业转化潜力高：历史商单数据显示，其受众群体的购买意愿强烈，<strong>互动率高达 9.8%</strong>，远超品类均值。</li>
                <li>受众高度匹配：该红人粉丝群体中 <strong>75% 为 18-34 岁男性科技爱好者</strong>，与本次推广目标高度重合。</li>
                <li>近期表现优异：最近发布的多部评测视频均突破百万播放，<strong>完播率达到 65%</strong>，呈现出强劲的流量获取能力。</li>
              </ol>
              <div className="mt-4 pt-3 border-t border-blue-600/10">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-blue-600 text-sm">
                    <span>查看需求匹配描述明细</span>
                    <span className="transition group-open:rotate-180">
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </summary>
                  <div className="text-slate-600 mt-3 text-xs leading-relaxed">
                    <p>针对您的“2024年Q3新款电竞显示器推广”需求，该红人的内容风格以深度评测和干货分享为主，擅长将复杂参数转化为直观体验。建议采用“开箱+场景化体验”的植入方式，突出产品的刷新率和色彩表现。历史数据显示，此类内容的粉丝转化率在同量级红人中排名前 15%。</p>
                  </div>
                </details>
              </div>
            </div>
          </section>

          {/* Recent Videos */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Film className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">近期发布视频</h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm group cursor-pointer hover:border-blue-600 transition-colors">
                  <div className="relative h-24 bg-slate-100">
                    <img src={`https://picsum.photos/seed/vid${i}/300/200`} alt="Video thumbnail" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-[10px] text-white rounded font-bold">
                      {10 + i}:{i < 10 ? `0${i}` : i}
                    </span>
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      近期评测视频标题示例 {i + 1}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {(10 + i * 2.5).toFixed(1)}万
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" /> {(5 + i * 0.8).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Core Analysis */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">商单表现核心分析</h3>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-6">
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">同品类商单平均互动率</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-slate-900">6.5%</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">账号整体平均互动率</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-slate-900">11.5%</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">商单均播占比</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-slate-900">85%</span>
                    <span className="text-xs font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded">优秀</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 flex items-start gap-3">
                <div className="mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
                <p className="text-sm text-slate-800 font-medium leading-relaxed">
                  <strong>定性结论：</strong> 该红人在本品类内容转化能力优秀，商单表现不仅未引起粉丝反感，反而凭借高质量的内容制作维持了较高的互动水平。
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">商单数据明细</h4>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 mb-1">商单均播</span>
                  <span className="text-lg font-semibold text-slate-900">45.0万</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 mb-1">播放中位数</span>
                  <span className="text-lg font-semibold text-slate-900">38.0万</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 mb-1">最高互动率</span>
                  <span className="text-lg font-semibold text-slate-900">12.4%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 mb-1">最高观看量</span>
                  <span className="text-lg font-semibold text-slate-900">89.5万</span>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-3">近期合作品牌</p>
                <div className="flex flex-wrap gap-2">
                  <a className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-xs font-medium rounded-md border border-slate-200 hover:border-blue-600 transition-colors text-slate-700" href="#">
                    <LinkIcon className="w-3 h-3" /> 科技品牌 A
                  </a>
                  <a className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-xs font-medium rounded-md border border-slate-200 hover:border-blue-600 transition-colors text-slate-700" href="#">
                    <LinkIcon className="w-3 h-3" /> 软件服务 B
                  </a>
                  <a className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-xs font-medium rounded-md border border-slate-200 hover:border-blue-600 transition-colors text-slate-700" href="#">
                    <LinkIcon className="w-3 h-3" /> 游戏品牌 C
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-slate-200 bg-white flex gap-4">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20">
            <Plus className="w-5 h-5" />
            添加到合作清单
          </button>
          <button className="px-5 py-3.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

    </div>
  );
}
