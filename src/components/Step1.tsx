import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, Home, LineChart, Package, Rocket, Sparkles, Upload, Users, Wand2, X } from 'lucide-react';
import { COUNTRY_OPTIONS } from '../constants/project';
import { formatDelimitedInput, parseDelimitedInput } from '../utils/formTransform';
import type { CreatorTierDraft, ProjectFormDraft } from '../types';

function TokenEditor({
  label,
  values,
  placeholder,
  onChange,
}: {
  label: string;
  values: string[];
  placeholder: string;
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState('');

  function commitToken() {
    const next = parseDelimitedInput(draft);
    if (next.length === 0) {
      setDraft('');
      return;
    }

    onChange(Array.from(new Set([...values, ...next])));
    setDraft('');
  }

  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700 mb-1.5 block">{label}</span>
      <div className="flex min-h-[96px] flex-wrap gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
        {values.map((value) => (
          <span key={value} className="inline-flex items-center gap-1 rounded bg-blue-600/10 px-2 py-1 text-xs font-bold text-blue-600">
            {value}
            <button
              type="button"
              className="rounded-full text-blue-600 hover:text-blue-800"
              onClick={() => onChange(values.filter((item) => item !== value))}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          type="text"
          placeholder={placeholder}
          className="min-w-[140px] flex-1 border-none bg-transparent p-1 text-sm focus:ring-0"
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commitToken}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault();
              commitToken();
            }
          }}
        />
      </div>
    </label>
  );
}

function TierCard({
  tier,
  onChange,
}: {
  tier: CreatorTierDraft;
  onChange: (next: CreatorTierDraft) => void;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border-2 border-blue-600/20 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-blue-600/10 bg-blue-600/5 p-4">
        <div>
          <h3 className="text-lg font-bold text-blue-600">{tier.tier_name}达人</h3>
          <p className="text-xs font-medium text-blue-600/60">用于生成创作者搜索策略</p>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            checked={tier.enabled}
            type="checkbox"
            className="peer sr-only"
            onChange={(event) => onChange({ ...tier, enabled: event.target.checked })}
          />
          <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full" />
        </label>
      </div>
      <div className="grid gap-4 p-5">
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-[10px] font-bold uppercase text-slate-400">粉丝区间 (Min)</span>
            <input
              value={tier.follower_min}
              type="text"
              className="mt-1 w-full rounded border-slate-200 text-sm"
              onChange={(event) => onChange({ ...tier, follower_min: event.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-bold uppercase text-slate-400">粉丝区间 (Max)</span>
            <input
              value={tier.follower_max}
              type="text"
              className="mt-1 w-full rounded border-slate-200 text-sm"
              onChange={(event) => onChange({ ...tier, follower_max: event.target.value })}
            />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-[10px] font-bold uppercase text-slate-400">目标签约数</span>
            <input
              value={tier.target_sign_count}
              type="number"
              className="mt-1 w-full rounded border-slate-200 text-sm"
              onChange={(event) => onChange({ ...tier, target_sign_count: Number(event.target.value || 0) })}
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-bold uppercase text-slate-400">Pitch 成功率</span>
            <input
              value={tier.pitch_success_rate}
              type="text"
              className="mt-1 w-full rounded border-slate-200 text-sm"
              onChange={(event) => onChange({ ...tier, pitch_success_rate: event.target.value })}
            />
          </label>
        </div>
        <label className="block">
          <span className="text-[10px] font-bold uppercase text-slate-400">搜索策略</span>
          <input
            value={tier.search_strategy}
            type="text"
            placeholder="如：垂直测评、场景体验、生活方式记录"
            className="mt-1 w-full rounded border-slate-200 text-sm"
            onChange={(event) => onChange({ ...tier, search_strategy: event.target.value })}
          />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-[10px] font-bold uppercase text-slate-400">均播要求</span>
            <input
              value={tier.avg_views_requirement}
              type="text"
              className="mt-1 w-full rounded border-slate-200 text-sm"
              onChange={(event) => onChange({ ...tier, avg_views_requirement: event.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-bold uppercase text-slate-400">互动率要求</span>
            <input
              value={tier.engagement_requirement}
              type="text"
              className="mt-1 w-full rounded border-slate-200 text-sm"
              onChange={(event) => onChange({ ...tier, engagement_requirement: event.target.value })}
            />
          </label>
        </div>
        <label className="block">
          <span className="text-[10px] font-bold uppercase text-slate-400">发布频率要求</span>
          <select
            value={tier.posting_frequency}
            className="mt-1 w-full rounded border-slate-200 text-sm"
            onChange={(event) => onChange({ ...tier, posting_frequency: event.target.value })}
          >
            <option>每周 1+ 篇</option>
            <option>每周 3+ 篇</option>
            <option>每日更新</option>
          </select>
        </label>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 p-4">
        <span className="text-xs font-semibold text-slate-500">爬取基数:</span>
        <span className="text-sm font-bold text-blue-600">{tier.crawl_base_hint}</span>
      </div>
    </div>
  );
}

export default function Step1({
  formDraft,
  isGenerating,
  statusMessage,
  errorMessage,
  onBack,
  onChange,
  onGenerate,
  onReset,
}: {
  formDraft: ProjectFormDraft;
  isGenerating: boolean;
  statusMessage: string;
  errorMessage: string;
  onBack: () => void;
  onChange: (next: ProjectFormDraft) => void;
  onGenerate: () => void;
  onReset: () => void;
}) {
  const [uploadedPdfName, setUploadedPdfName] = useState('');

  function updateField<Key extends keyof ProjectFormDraft>(key: Key, value: ProjectFormDraft[Key]) {
    onChange({
      ...formDraft,
      [key]: value,
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-blue-600/10 bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-blue-600/10 p-2 text-blue-600">
            <LineChart className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold tracking-tight">达人深度搜索</h2>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100">
            <Home className="h-5 w-5" />
            返回首页
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">管理员</div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 pb-32">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold">需求配置 (LLM 关键词生成)</h1>
            <p className="mt-1 text-sm text-slate-500">将项目输入结构化为 ProjectForm，并提交给 LLM 生成关键词策略组。</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-blue-600">当前环节: 步骤 1 需求配置</p>
            <p className="mt-0.5 text-xs text-slate-400">下一步: 步骤 2 关键词策略编辑</p>
          </div>
        </div>

        {(statusMessage || errorMessage) && (
          <div className={`mb-6 rounded-xl border px-4 py-3 text-sm ${errorMessage ? 'border-red-200 bg-red-50 text-red-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>
            {errorMessage || statusMessage}
          </div>
        )}

        <div className="flex flex-col gap-8">
          <section className="rounded-xl border border-blue-600/10 bg-white p-6 shadow-sm">
            <div className="mb-8 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-bold">模块 1: 产品信息</h2>
                </div>
                <button onClick={onReset} className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition-all hover:bg-slate-200">
                  <Wand2 className="h-5 w-5" />
                  使用示例填充
                </button>
              </div>

              <div className="rounded-xl border border-blue-600/20 bg-blue-600/5 p-5">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    <h3 className="font-bold text-blue-600">AI 智能解析填充</h3>
                    <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">规划中</span>
                  </div>
                  <p className="text-xs text-slate-500">当前先保留文件与链接输入，首轮生成仅使用结构化表单字段与产品链接。</p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="flex h-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-600/30 bg-white transition-colors hover:bg-blue-600/10">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Upload className="h-5 w-5" />
                      <span className="text-sm font-bold">{uploadedPdfName || '上传产品 PDF'}</span>
                    </div>
                    <span className="mt-1 text-[10px] text-slate-400">支持：产品手册、介绍文档、方案书</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(event) => setUploadedPdfName(event.target.files?.[0]?.name ?? '')}
                    />
                  </label>
                  <div className="flex flex-col gap-2">
                    <input
                      value={formDraft.product_page_url}
                      type="text"
                      placeholder="输入产品详情页或官网链接"
                      className="h-12 rounded-lg border-slate-200 bg-white px-4 text-sm focus:border-blue-600 focus:ring-blue-600"
                      onChange={(event) => updateField('product_page_url', event.target.value)}
                    />
                    <button type="button" className="flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-bold text-white transition-all hover:bg-blue-700">
                      <Rocket className="h-5 w-5" />
                      解析入口预留
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">行业</span>
                <input
                  value={formatDelimitedInput(formDraft.industry_keywords)}
                  type="text"
                  placeholder="如：美妆个护, 护肤科技"
                  className="w-full rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-blue-600 focus:ring-blue-600"
                  onChange={(event) => updateField('industry_keywords', parseDelimitedInput(event.target.value))}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">核心品类词</span>
                <input
                  value={formatDelimitedInput(formDraft.category_keywords)}
                  type="text"
                  placeholder="如：精华液, 抗衰老"
                  className="w-full rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-blue-600 focus:ring-blue-600"
                  onChange={(event) => updateField('category_keywords', parseDelimitedInput(event.target.value))}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">本品品牌名</span>
                <input
                  value={formDraft.brand_name}
                  type="text"
                  placeholder="输入您的品牌名"
                  className="w-full rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-blue-600 focus:ring-blue-600"
                  onChange={(event) => updateField('brand_name', event.target.value)}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">竞品品牌</span>
                <input
                  value={formatDelimitedInput(formDraft.competitor_brands)}
                  type="text"
                  placeholder="多个品牌用逗号分隔"
                  className="w-full rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-blue-600 focus:ring-blue-600"
                  onChange={(event) => updateField('competitor_brands', parseDelimitedInput(event.target.value))}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">推广产品名</span>
                <input
                  value={formDraft.product_name}
                  type="text"
                  placeholder="本次推广的具体单品"
                  className="w-full rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-blue-600 focus:ring-blue-600"
                  onChange={(event) => updateField('product_name', event.target.value)}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">对标竞品名</span>
                <input
                  value={formDraft.benchmark_product_name}
                  type="text"
                  placeholder="对应的竞品单品"
                  className="w-full rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-blue-600 focus:ring-blue-600"
                  onChange={(event) => updateField('benchmark_product_name', event.target.value)}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">产品核心卖点</span>
                <textarea
                  value={formatDelimitedInput(formDraft.core_selling_points)}
                  placeholder="使用逗号或换行分隔多个卖点"
                  className="h-24 w-full resize-none rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-blue-600 focus:ring-blue-600"
                  onChange={(event) => updateField('core_selling_points', parseDelimitedInput(event.target.value))}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">产品使用场景</span>
                <textarea
                  value={formatDelimitedInput(formDraft.product_use_scenarios)}
                  placeholder="使用逗号或换行分隔多个场景"
                  className="h-24 w-full resize-none rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-blue-600 focus:ring-blue-600"
                  onChange={(event) => updateField('product_use_scenarios', parseDelimitedInput(event.target.value))}
                />
              </label>
              <TokenEditor
                label="产品适用人群"
                values={formDraft.target_audience}
                placeholder="输入后按回车"
                onChange={(next) => updateField('target_audience', next)}
              />
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">目标投放国家 (多选)</span>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {COUNTRY_OPTIONS.map((country) => {
                      const active = formDraft.target_countries.includes(country);
                      return (
                        <button
                          key={country}
                          type="button"
                          className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${active ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                          onClick={() =>
                            updateField(
                              'target_countries',
                              active
                                ? formDraft.target_countries.filter((item) => item !== country)
                                : [...formDraft.target_countries, country],
                            )
                          }
                        >
                          {country}
                        </button>
                      );
                    })}
                  </div>
                  <input
                    value={formatDelimitedInput(formDraft.target_countries)}
                    type="text"
                    placeholder="也可直接输入国家，逗号分隔"
                    className="w-full rounded-lg border-slate-200 bg-white text-sm focus:border-blue-600 focus:ring-blue-600"
                    onChange={(event) => updateField('target_countries', parseDelimitedInput(event.target.value))}
                  />
                </div>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">目标博主类型</span>
                <input
                  value={formatDelimitedInput(formDraft.target_creator_types)}
                  type="text"
                  placeholder="如：生活方式, 科技测评"
                  className="w-full rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-blue-600 focus:ring-blue-600"
                  onChange={(event) => updateField('target_creator_types', parseDelimitedInput(event.target.value))}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">内容风格偏好</span>
                <input
                  value={formatDelimitedInput(formDraft.preferred_content_styles)}
                  type="text"
                  placeholder="如：极简, 搞怪, 叙事"
                  className="w-full rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-blue-600 focus:ring-blue-600"
                  onChange={(event) => updateField('preferred_content_styles', parseDelimitedInput(event.target.value))}
                />
              </label>
              <label className="block lg:col-span-2">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">视频必需场景元素</span>
                <input
                  value={formatDelimitedInput(formDraft.required_video_scene_elements)}
                  type="text"
                  placeholder="如：开箱展示, 近距质地特写, 30天对比"
                  className="w-full rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-blue-600 focus:ring-blue-600"
                  onChange={(event) => updateField('required_video_scene_elements', parseDelimitedInput(event.target.value))}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">红人合作策略</span>
                <select
                  value={formDraft.collaboration_strategy}
                  className="w-full rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-blue-600 focus:ring-blue-600"
                  onChange={(event) => updateField('collaboration_strategy', event.target.value as ProjectFormDraft['collaboration_strategy'])}
                >
                  <option>平衡型</option>
                  <option>保守型</option>
                  <option>激进型</option>
                </select>
              </label>
            </div>
          </section>

          <section className="space-y-6">
            <div className="mb-2 flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold">模块 2: 达人分层与筛选要求</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {formDraft.creator_tier_config.map((tier, index) => (
                <div key={tier.tier_name}>
                  <TierCard
                    tier={tier}
                    onChange={(next) =>
                      updateField(
                        'creator_tier_config',
                        formDraft.creator_tier_config.map((current, currentIndex) => (currentIndex === index ? next : current)),
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-blue-600/10 bg-white px-8 py-4">
        <div className="flex items-center gap-2 text-slate-500">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium">表单草稿已自动保存到本地</span>
        </div>
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-2 font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {isGenerating ? '正在生成关键词策略...' : '生成并进入关键词方案'}
          <ArrowRight className="h-5 w-5" />
        </button>
      </footer>
    </div>
  );
}
