export type TierName = '头部' | '腰部' | '尾部';

export type CollaborationStrategy = '平衡型' | '保守型' | '激进型';

export interface CreatorTierDraft {
  tier_name: TierName;
  enabled: boolean;
  follower_min: string;
  follower_max: string;
  search_strategy: string;
  target_sign_count: number;
  pitch_success_rate: string;
  avg_views_requirement: string;
  engagement_requirement: string;
  posting_frequency: string;
  crawl_base_hint: string;
}

export interface CreatorTierConfig {
  tier_name: TierName;
  follower_range: string;
  search_strategy: string;
  target_sign_count?: number;
  pitch_success_rate?: string;
  avg_views_requirement?: string;
  engagement_requirement?: string;
  posting_frequency?: string;
  crawl_base_hint?: string;
}

export interface ProjectFormDraft {
  industry_keywords: string[];
  category_keywords: string[];
  brand_name: string;
  product_name: string;
  product_page_url: string;
  benchmark_product_name: string;
  competitor_brands: string[];
  product_use_scenarios: string[];
  core_selling_points: string[];
  target_audience: string[];
  target_countries: string[];
  target_creator_types: string[];
  preferred_content_styles: string[];
  required_video_scene_elements: string[];
  collaboration_strategy: CollaborationStrategy;
  creator_tier_config: CreatorTierDraft[];
}

export interface ProjectForm {
  industry_keywords: string[];
  category_keywords: string[];
  brand_name: string;
  product_name: string;
  product_page_url: string;
  competitor_brands: string[];
  product_use_scenarios: string[];
  core_selling_points: string[];
  target_audience: string[];
  target_creator_types: string[];
  preferred_content_styles: string[];
  required_video_scene_elements: string[];
  creator_tier_config: CreatorTierConfig[];
}

export interface ProjectSummary {
  industry_category: string;
  product_name: string;
  brand_name: string;
  core_search_direction: string[];
}

export interface StrategyTagMap {
  创作者类型: string[];
  内容形态: string[];
  适合层级: string[];
}

export interface KeywordStrategyGroup {
  strategy_type: string;
  keyword_group_name: string;
  keyword_list: string[];
  strategy_explanation: string;
  tags: StrategyTagMap;
  recommended_creator_tiers: string[];
  enabled: boolean;
  sendingStatus?: 'idle' | 'sending' | 'success' | 'error';
  lastResponse?: string;
  lastGeneratedAt?: string;
}

export interface StrategyResponse {
  project_summary: ProjectSummary;
  keyword_strategy_groups: KeywordStrategyGroup[];
  ai_reasoning?: AiReasoning;
}

export interface DiagnosisInfo {
  ecosystem_judgment: string;
  creator_content_driver: string;
  competitor_ecosystem: string;
  ambiguity_risk: string;
}

export interface StrategyDecisions {
  vertical_precision: string;
  scenario_expansion: string;
  competitor_capture: string;
  content_format_alignment: string;
  audience_interest_mapping: string;
}

export interface ReflectionCheckItem {
  keyword: string;
  q1_search_result_quality: string;
  q2_creator_language_match: string;
  q3_tokenization_risk: string;
  verdict: string;
}

export interface AiReasoning {
  diagnosis: DiagnosisInfo;
  strategy_decisions: StrategyDecisions;
  reflection_check: ReflectionCheckItem[];
}

export interface DiagnosisDecisionResponse {
  diagnosis: DiagnosisInfo;
  strategy_decisions: StrategyDecisions;
}

export interface KeywordStrategyGroupDraft {
  strategy_type: string;
  keyword_group_name: string;
  keyword_list: string[];
  recommended_creator_tiers: string[];
}

export interface KeywordDraftResponse {
  keyword_strategy_groups_draft: KeywordStrategyGroupDraft[];
}

export interface KeywordStrategyGroupFinal {
  strategy_type: string;
  keyword_group_name: string;
  keyword_list: string[];
  strategy_explanation: string;
  tags: StrategyTagMap;
  recommended_creator_tiers: string[];
}

export interface QualityCheckerResponse {
  keyword_strategy_groups_final: KeywordStrategyGroupFinal[];
  reflection_check: ReflectionCheckItem[];
}

export interface SkillOrchestratedStrategyResponse {
  project_summary: ProjectSummary;
  ai_reasoning: AiReasoning;
  keyword_strategy_groups: KeywordStrategyGroupFinal[];
}

export type GenerationStage = 'idle' | 'diagnosis' | 'draft' | 'quality' | 'done' | 'error';
