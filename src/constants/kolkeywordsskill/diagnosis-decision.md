# 子 SKILL 1：诊断层 + 策略决策层

## 在整个流程中的位置

- **位置**：流程第一步，由主 SKILL（SKILL.md）调用
- **输入**：用户提供的完整品牌 JSON（字段定义见主 SKILL Input Format）
- **输出**：四项诊断结论 + 五个策略的执行状态和原因，格式如下：

```json
{
  "diagnosis": {
    "ecosystem_judgment": "",
    "creator_content_driver": "",
    "competitor_ecosystem": "",
    "ambiguity_risk": ""
  },
  "strategy_decisions": {
    "vertical_precision": "",
    "scenario_expansion": "",
    "competitor_capture": "",
    "content_format_alignment": "",
    "audience_interest_mapping": ""
  }
}
```

完成后将此 JSON 连同原始品牌 JSON 一起传给子 SKILL 2（keyword-generator.md）。

---

## 诊断层：判断产品与 YouTube 内容生态的关系（所有步骤开始前必须完成）

这是整个方法论的起点。在生成任何关键词之前，必须先完成以下四项诊断判断，判断结果将直接决定后续策略的权重和生成方向。

---

### 诊断项 1：产品在 YouTube 上是否有独立内容生态？

判断这个产品品类，是否已经存在一批创作者长期围绕它持续产出内容。

- 有独立生态：平台上有大量创作者以该品类为主方向持续产出，有稳定的社区词汇和内容标准（如机械键盘、护肤品、咖啡机）。→ vertical_precision 策略价值高，可作主力。
- 嵌入式存在：产品本身内容极少，但它天然属于某个更大的生活方式或兴趣生态，目标创作者围绕"拥有该场景的生活"发内容，产品只是其中一个元素（如家用造浪机嵌入 backyard pool lifestyle 生态）。→ scenario_expansion 和 audience_interest_mapping 是主力，vertical_precision 降级为辅助。
- 几乎没有生态：产品极度小众，连嵌入的生态也很稀薄，YouTube 上几乎没有对应的自然内容。→ 搜索策略整体价值有限，需在 strategy_explanation 中主动提示业务。

**输出到**：`diagnosis.ecosystem_judgment`

---

### 诊断项 2：目标创作者围绕什么发内容？

判断目标创作者的内容驱动力——他们是围绕"产品本身"发内容，还是围绕"某个生活场景或身份"发内容。

- 围绕产品发内容：创作者以品类评测、产品对比为主要内容方向。→ 可以使用品类词驱动的关键词。
- 围绕场景发内容：创作者以生活方式、空间改造、日常 routine 为主要内容方向，产品出现在场景里而非视频主题。→ 必须以场景词为关键词核心，不能用产品术语做主词。

**输出到**：`diagnosis.creator_content_driver`

---

### 诊断项 3：竞品在 YouTube 上是否有内容生态？

判断竞品品牌或同类产品，是否已经有独立创作者产出评测或对比内容。

- 有：competitor_capture 策略价值高，可作主力。
- 没有或极少：competitor_capture 策略降级，改用品类替代品词而非竞品品牌词。

**输出到**：`diagnosis.competitor_ecosystem`

---

### 诊断项 4：核心词汇的 YouTube 歧义风险评估（必须逐词检查）

对产品名称、品类词、核心术语中的每一个单词，评估它在 YouTube 内容生态里是否存在高频的非相关用法。

高歧义词的识别标准：该词单独出现时，是否会大量命中以下内容类型——泛娱乐大网红内容、游戏实况、音乐/明星、儿童动画、军事/航空/机车等与目标垂类完全无关的生态。

**高歧义词一旦识别，必须在 vertical_precision 策略中禁止单独作为核心词使用，必须用语义组合更纯净的替代表达。**

歧义风险示例：
- jet → 高歧义（私人飞机、战斗机、机车、NFL 球队），禁止单独作核心词
- endless → 高歧义（游戏无尽模式、影视主题、健身器械名称），禁止单独作核心词
- pool → 中等歧义（台球、资金池），需配合场景词收窄
- counter-current → 低歧义，适合作为 vertical_precision 核心词
- swim spa → 低歧义，适合作为 vertical_precision 核心词

**输出到**：`diagnosis.ambiguity_risk`

---

## 策略决策层：根据诊断结论输出策略指令（诊断层完成后立即执行）

根据诊断层的四项判断，为每个策略组输出执行状态。执行状态只有两档：

- **输出**：该策略在当前产品情况下有真实召回价值，进入 Step 3 生成关键词，最终出现在 `keyword_strategy_groups` 里。
- **跳过**：该策略在当前产品情况下召回价值极低，不生成关键词，不出现在 `keyword_strategy_groups` 里，但必须在 `ai_reasoning.strategy_decisions` 中记录跳过原因。

**跳过不是降级，跳过意味着这个策略方向对当前产品没有实质帮助，强行输出只会产生噪音。**

输出的策略组内部，再区分主力和辅助两种执行力度：

- **主力**：召回价值最高，关键词质量要求最严，必须覆盖目标创作者的核心内容方向，输出 3 个关键词。
- **辅助**：有一定价值但不是主要召回来源，输出 2 个关键词，聚焦补充主力策略未覆盖的方向。

策略决策规则：

| 诊断结论 | 策略决策 |
|---------|---------|
| 产品有独立内容生态 | vertical_precision 输出（主力），scenario_expansion 输出（辅助），其余视情况决定 |
| 产品嵌入式存在于生活方式生态 | scenario_expansion 输出（主力），audience_interest_mapping 输出（主力），vertical_precision 输出（辅助，但关键词必须用场景专业词而非产品术语），content_format_alignment 视情况决定 |
| 产品几乎没有生态 | scenario_expansion 输出（主力），其余策略大概率跳过，并在 ai_reasoning 中提示业务搜索召回量有限 |
| 目标创作者围绕场景发内容 | 所有输出策略的关键词核心必须以场景词为起点，不以产品术语为起点 |
| 竞品有内容生态 | competitor_capture 输出（主力） |
| 竞品没有内容生态且无可替代的同类产品词 | competitor_capture 跳过 |
| 核心词汇全部高歧义且无可替换的纯净表达 | vertical_precision 跳过 |
| content_format_alignment 的内容格式词与其他策略组已高度重合 | content_format_alignment 跳过，避免重复 |

策略决策层不输出关键词，只确定每个策略的执行状态和执行力度。

**所有 5 个策略的决策结论必须输出**，无论是输出还是跳过，每个策略用一句话说明状态和原因，写入 `strategy_decisions` 对应字段。

---

## 输出说明

执行完成后，输出以下结构的 JSON，传给子 SKILL 2：

```json
{
  "diagnosis": {
    "ecosystem_judgment": "（1~2句：判断结论 + 判断依据）",
    "creator_content_driver": "（1~2句：内容驱动力判断 + 对关键词语义起点的影响）",
    "competitor_ecosystem": "（1~2句：竞品生态判断 + competitor_capture 策略执行价值）",
    "ambiguity_risk": "（列出被识别为高歧义的词及替换方向，若无则写"无"）"
  },
  "strategy_decisions": {
    "vertical_precision": "（输出-主力/输出-辅助/跳过）+原因",
    "scenario_expansion": "（输出-主力/输出-辅助/跳过）+原因",
    "competitor_capture": "（输出-主力/输出-辅助/跳过）+原因",
    "content_format_alignment": "（输出-主力/输出-辅助/跳过）+原因",
    "audience_interest_mapping": "（输出-主力/输出-辅助/跳过）+原因"
  }
}
```
