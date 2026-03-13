import type { ProjectFormDraft } from '../types';

export const FORM_STORAGE_KEY = 'kolsearch_form_draft_v2';
export const STRATEGY_STORAGE_KEY = 'kolsearch_strategy_cache_v2';
export const SUMMARY_STORAGE_KEY = 'kolsearch_project_summary_v1';
export const AI_REASONING_STORAGE_KEY = 'kolsearch_ai_reasoning_v1';
export const STEP_STORAGE_KEY = 'kolsearch_step_state_v1';

export const COUNTRY_OPTIONS = ['美国', '英国', '加拿大', '德国', '法国', '日本', '韩国', '澳大利亚'];

export const DEFAULT_PROJECT_FORM_DRAFT: ProjectFormDraft = {
  industry_keywords: ['robotic lawn mower', 'smart outdoor equipment', 'yard automation'],
  category_keywords: ['wire-free robot mower', 'RTK lawn mower', 'autonomous lawn care'],
  brand_name: 'Lymow',
  product_name: 'Lymow One Plus Robotic Lawn Mower',
  product_page_url: 'https://www.lymow.com/one-plus',
  benchmark_product_name: '',
  competitor_brands: ['Yarbo', 'Mammotion', 'Dreame', 'Sunseeker', 'Husqvarna'],
  product_use_scenarios: ['large backyard lawn', 'complex yard with slopes', 'smart home automation'],
  core_selling_points: ['wire-free RTK navigation', 'multi-zone mapping', 'all weather dock', 'anti-theft tracking'],
  target_audience: ['suburban homeowners', 'landscaping contractors', 'smart home enthusiasts'],
  target_countries: ['美国', '英国'],
  target_creator_types: ['lawn care reviewers', 'smart home tech reviewers', 'DIY yard vloggers'],
  preferred_content_styles: ['review', 'comparison', 'setup walkthrough', 'yard transformation vlog'],
  required_video_scene_elements: ['backyard lawn', 'outdoor workshop', 'smart garage charging'],
  collaboration_strategy: '平衡型',
  creator_tier_config: [
    {
      tier_name: '头部',
      enabled: true,
      follower_min: '500K',
      follower_max: '',
      search_strategy: '垂直测评与多品牌对比',
      target_sign_count: 10,
      pitch_success_rate: '5%',
      avg_views_requirement: '',
      engagement_requirement: '',
      posting_frequency: '每周 1+ 篇',
      crawl_base_hint: '~200 位达人',
    },
    {
      tier_name: '腰部',
      enabled: true,
      follower_min: '50K',
      follower_max: '500K',
      search_strategy: '深度场景体验、setup / how to',
      target_sign_count: 50,
      pitch_success_rate: '12%',
      avg_views_requirement: '15k+',
      engagement_requirement: '4%+',
      posting_frequency: '每周 3+ 篇',
      crawl_base_hint: '~410 位达人',
    },
    {
      tier_name: '尾部',
      enabled: true,
      follower_min: '5K',
      follower_max: '50K',
      search_strategy: '真实庭院生活 / niche 场景植入',
      target_sign_count: 150,
      pitch_success_rate: '25%',
      avg_views_requirement: '2k+',
      engagement_requirement: '6%+',
      posting_frequency: '每周 3+ 篇',
      crawl_base_hint: '~600 位达人',
    },
  ],
};

export function isMeaningfulProjectFormDraft(draft: ProjectFormDraft) {
  return Boolean(
    draft.brand_name.trim() ||
      draft.product_name.trim() ||
      draft.product_page_url.trim() ||
      draft.industry_keywords.length ||
      draft.category_keywords.length ||
      draft.competitor_brands.length ||
      draft.product_use_scenarios.length ||
      draft.core_selling_points.length ||
      draft.target_creator_types.length ||
      draft.preferred_content_styles.length ||
      draft.required_video_scene_elements.length
  );
}
