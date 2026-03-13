import type { CreatorTierConfig, CreatorTierDraft, ProjectForm, ProjectFormDraft } from '../types';

function cleanList(values: string[]) {
  return values.map((item) => item.trim()).filter(Boolean);
}

export function parseDelimitedInput(value: string) {
  return cleanList(value.split(/[\n,，、]/g));
}

export function formatDelimitedInput(values: string[]) {
  return values.join(', ');
}

function buildFollowerRange(tier: CreatorTierDraft) {
  const min = tier.follower_min.trim();
  const max = tier.follower_max.trim();

  if (!min && !max) {
    return '';
  }

  if (!min) {
    return max;
  }

  if (!max) {
    return `${min}+`;
  }

  return `${min}-${max}`;
}

function mapTierDraftToPayload(tier: CreatorTierDraft): CreatorTierConfig {
  return {
    tier_name: tier.tier_name,
    follower_range: buildFollowerRange(tier),
    search_strategy: tier.search_strategy.trim(),
    target_sign_count: tier.target_sign_count,
    pitch_success_rate: tier.pitch_success_rate.trim(),
    avg_views_requirement: tier.avg_views_requirement.trim(),
    engagement_requirement: tier.engagement_requirement.trim(),
    posting_frequency: tier.posting_frequency.trim(),
    crawl_base_hint: tier.crawl_base_hint.trim(),
  };
}

export function buildProjectFormPayload(draft: ProjectFormDraft): ProjectForm {
  return {
    industry_keywords: cleanList(draft.industry_keywords),
    category_keywords: cleanList(draft.category_keywords),
    brand_name: draft.brand_name.trim(),
    product_name: draft.product_name.trim(),
    product_page_url: draft.product_page_url.trim(),
    competitor_brands: cleanList(draft.competitor_brands),
    product_use_scenarios: cleanList(draft.product_use_scenarios),
    core_selling_points: cleanList(draft.core_selling_points),
    target_audience: cleanList(draft.target_audience),
    target_creator_types: cleanList(draft.target_creator_types),
    preferred_content_styles: cleanList(draft.preferred_content_styles),
    required_video_scene_elements: cleanList(draft.required_video_scene_elements),
    creator_tier_config: draft.creator_tier_config.filter((tier) => tier.enabled).map(mapTierDraftToPayload),
  };
}
