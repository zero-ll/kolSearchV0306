# 子 SKILL 2：关键词生成层（Step 1–5）

## 在整个流程中的位置

- **位置**：流程第二步，由主 SKILL（SKILL.md）在子 SKILL 1 完成后调用
- **输入**：
  - 原始品牌 JSON（字段定义见主 SKILL Input Format）
  - 子 SKILL 1（diagnosis-decision.md）的完整输出（包含 `diagnosis` 和 `strategy_decisions`）
- **输出**：各策略组的候选关键词草稿，格式如下：

```json
{
  "keyword_strategy_groups_draft": [
    {
      "strategy_type": "",
      "keyword_group_name": "",
      "keyword_list": [],
      "recommended_creator_tiers": []
    }
  ]
}
```

完成后将此草稿传给子 SKILL 3（quality-checker.md）进行质量检查。

**注意**：`keyword_strategy_groups_draft` 只包含子 SKILL 1 中执行状态为"输出"的策略组，执行状态为"跳过"的策略不生成任何关键词，不出现在此数组中。

---

## Step 1：信息拆解

将输入拆解为以下 9 类语义层：

1. 行业 / 品类
2. 使用任务 / 用户问题
3. 生活场景
4. 目标人群身份
5. 竞品与替代品（**注意：竞品词只归入此类，不得同时归入品类语义层，不得进入 vertical_precision 生成逻辑**）
6. 卖点能力
7. 创作者类型
8. 视频内容风格
9. 视频场景元素

**权重优先级：**
- 最高：品类 / 场景 / 竞品 / 视频场景元素
- 中等：用户问题 / 创作者类型 / 内容风格
- 辅助：卖点 / 人群

注意：
- 卖点不要直接原样照搬，优先转译成创作者会表达的内容主题、问题、任务或对比角度
- 品牌名通常不是主搜索词，除非品牌本身就是行业显性搜索对象
- 目标是找到"什么类型的创作者会围绕这些主题持续内容产出"

---

## Step 2：品牌语言 → 创作者语言转译（必须执行）

| 输入类型 | 转译方向 |
|---------|---------|
| 产品词 | 频道主题 / 视频主题 |
| 卖点词 | 问题词 / 任务词 / 对比词 |
| 场景词 | 生活任务词 / 使用场景词 / 生活流程 / 生活方式 |
| 人群词 | 身份标签 |
| 竞品词 | comparison / alternative / vs 语义（**仅用于 competitor_capture 策略，不流入其他策略**） |
| 视频场景元素 | 内容环境关键词 |

转译完成后，必须对每一个转译结果做语义纯净度检查：这个词组在 YouTube 上的高排名内容，是否大多数属于目标垂类？如果答案是否或不确定，必须替换为更垂直的表达，不得进入生成层。

示例转译：
- 输入卖点："便携、无需插电、30秒出咖啡"
- 错误：直接照搬原词
- 正确：`portable espresso` / `manual espresso` / `dorm coffee` / `camp coffee` / `coffee setup` / `best travel coffee maker`

---

## Step 3：按策略决策层指令执行策略生成

5 类策略框架固定，但并非每次都全部输出。**严格按照子 SKILL 1 输出的执行状态执行**：状态为"跳过"的策略不生成任何关键词，不出现在输出的 `keyword_strategy_groups_draft` 中。

### A. vertical_precision
**目标**：寻找强垂类、行业相关度高的红人。

**生成逻辑**：
- 品类 / 子品类 + 内容表达词
- 场景专业术语 / 子类术语 + 内容表达词

**强制约束（必须执行）**：
- 禁止使用任何在诊断层被标记为高歧义的词作为核心词，必须替换为语义组合更纯净的行业专属表达
- 禁止将竞品品牌词或竞品产品词纳入此策略，竞品词只属于 competitor_capture
- 若策略决策层判断为辅助，关键词必须以场景内的专业表达为核心，而非产品术语
- 若经过反问检查层后所有候选词均无法通过三问检查，此策略必须跳过，不得强行输出

### B. scenario_expansion
**目标**：寻找在真实生活、工作、兴趣场景中自然使用该产品的红人。

**生成逻辑**：
- 场景词 + 产品主题词
- 场景词 + 内容表达词
- 任务 / 流程 / routine / setup / essentials 类表达
- **若有 `required_video_scene_elements`，必须在此组生成对应的内容环境词**

### C. competitor_capture
**目标**：寻找已覆盖同类产品、竞品、替代品内容的红人。

**生成逻辑**：
- 竞品品牌 / 竞品产品 + review / comparison / vs / alternative
- 竞品词 + best / worth it / test
- **若 `competitor_brands` 为空，则基于品类推断常见替代品、同类产品词；若推断不出任何有效替代品词，此策略跳过**
- **竞品词是此策略专属，不得流入 vertical_precision 或其他策略**

### D. content_format_alignment
**目标**：强化 YouTube 创作者真实内容形式，使搜索更像内容发现而非商品词检索。

**允许使用的内容表达词（固定范围，不得超出）**：
- review / comparison / test / how to / setup / best for / day in the life / essentials

**禁止使用**：secret / truth / mistakes / shocking / viral / hack（标题党词，不利于精准找人）

**跳过条件**：若该策略生成的词与其他已输出策略组的关键词高度重合（超过 50% 相似），直接跳过，避免重复搜索消耗配额。

### E. audience_interest_mapping
**目标**：寻找围绕特定身份、兴趣、生活方式持续产出内容的红人。

**生成逻辑**：
- 人群身份 + setup / tips / day in the life / essentials
- 兴趣标签 + 产品相关任务 / 问题 / 使用语境

---

## Step 4：视频场景元素的关键词化

`required_video_scene_elements` 是重要筛选线索，必须转化为内容环境关键词。

示例：
- 输入：`pool` / `backyard` / `garage gym`
- 转化为：`backyard pool setup` / `pool training workout` / `home swimming training` / `family backyard pool day`

这类词更容易命中**真实拥有该环境的创作者**，是场景匹配的核心武器。

将转化结果并入 `scenario_expansion` 策略组中。

---

## Step 5：层级差异化

根据 `creator_tier_config` 调整关键词倾向：

| 层级 | 关键词倾向 |
|-----|----------|
| 头部 | 大品类词、热门场景词、comparison，top-level discoverability |
| 腰部 | review、setup、how to、best for，转化型表达 |
| 尾部 | 超细分场景、问题词、人群标签、垂直社区表达 |

在输出的 `recommended_creator_tiers` 字段中体现该组关键词适合哪类层级。

---

## 关键词质量标准

每组只输出 **不超过 3 个关键词**，只保留精准度最高的词，不追求数量覆盖。

每条关键词必须满足：
- 优先短语，不写完整句子
- 长度控制在 2~6 个英文单词
- 最多 2 个核心语义 + 1 个内容表达词
- 不将品牌、卖点、场景、人群、竞品全部堆入同一条词
- 不输出过长、过泛、过抽象的表达
- 不输出纯参数词、纯品牌词、纯营销话术词
- 必须像真实 YouTube 视频标题或创作者常用主题

**5 组之间必须互补**：
- vertical_precision 负责"准"
- scenario_expansion 负责"扩"
- competitor_capture 负责"找已有同类创作者"
- content_format_alignment 负责"贴近 YouTube 真实内容形式"
- audience_interest_mapping 负责"发现潜在相关创作者"

---

## Naming Rules

每个关键词组包含两个名称字段：

**`strategy_type`**（系统字段，固定枚举，不可改写）：
- `vertical_precision`
- `scenario_expansion`
- `competitor_capture`
- `content_format_alignment`
- `audience_interest_mapping`

**`keyword_group_name`**（展示字段，动态生成）：
- 根据该组实际关键词内容、搜索意图和红人类型自行生成
- 不能照抄 strategy_type
- 不能使用"产品/行业关键词"等模板化表达
- 体现这组词在找什么内容或什么类型的创作者
- 长度 6~16 个中文字符
- 适合直接展示在产品界面

风格示例（仅供参考，不要机械复用）：
- "垂类测评型创作者" / "生活场景植入型内容" / "竞品迁移红人挖掘" / "教程与开箱表达组合" / "目标人群兴趣圈层"

---

## 输出说明

执行完成后，输出以下结构的 JSON，传给子 SKILL 3：

```json
{
  "keyword_strategy_groups_draft": [
    {
      "strategy_type": "（固定枚举值）",
      "keyword_group_name": "（动态生成的中文名称，6~16字）",
      "keyword_list": ["英文关键词1", "英文关键词2", "英文关键词3"],
      "recommended_creator_tiers": ["头部", "腰部"]
    }
  ]
}
```

注意：
- 此输出为候选草稿，关键词尚未经过三问反问检查，不是最终输出
- `keyword_list` 只包含当前认为最合适的候选词，子 SKILL 3 会对其进行逐条检查并可能替换
- `strategy_explanation` 和 `tags` 字段由子 SKILL 3 填充，此处不需要生成
