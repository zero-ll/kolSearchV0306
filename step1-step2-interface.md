# Step1 / Step2 接口说明（项目信息管理 & 关键词策略与任务管理）

## 1. 文档范围与依赖

| 维度 | 说明 |
| --- | --- |

| 主要职责 | Step1 将模板/用户输入的项目信息结构化为 ProjectForm JSON，并向 LLM（Claude 4.5 Sonnet）发起关键词策略生成请求；Step2 基于 LLM 响应编辑策略、拼装任务请求并投递到 GlobalOneClick 任务中心。 |
| 关键依赖 | - 前端运行在 `frontend/`，基于 React + Vite。<br>- LLM 接口：`https://llm-pool-common.nlp.yuntingai.com/chat/completions`。<br>- 任务投递接口：`http://api.globaloneclick.org/project/channelRate/createEvaluateTaskRetUuid`。 |
| 本地缓存 | 通过 `localStorage` 保存表单草稿、策略结果、任务记录、当前步骤、提示词等，详见附录。 |
| 数据流概览 | ① 选模板 → ② 编辑 `ProjectForm` → ③ Step1 点击“生成并进入策略页”，调用 `requestStrategies` → ④ `StrategyResponse`（含 `project_summary` + `keyword_strategy_groups`）被缓存 → ⑤ Step2 展示策略卡片，允许编辑并预览请求体 → ⑥ 点击“发送请求”时调用 `sendTask`，将策略组映射为任务并写入任务本地库，供 Step3 的任务面板读取。 |

下文按 Step1 / Step2 拆解每个接口的触发条件、参数来源、字段含义以及示例。

## 2. Step 1 · 项目信息管理接口

### 2.1 数据来源与准备

| 模块 | 主要字段 | 来源 | 说明 |
| --- | --- | --- | --- |
| 模板选择 `TemplatePicker` | `templateKey: TemplateKey` | localStorage(`kolsearch_template_key_v1`) 默认 `lymow` | 控制初始 `ProjectForm` 与任务模板配置。 |
| 项目表单 `ProjectFormPanel` | 13 个数组/字符串字段 + `creator_tier_config` | - 预设 `PROJECT_FORM_PRESETS[templateKey]`<br>- 用户编辑<br>- 也可通过 JSON 面板粘贴 | 字段定义详见附录。每次修改都会触发 `saveToStorage(FORM_STORAGE_KEY)`，键名：`kolsearch_form_draft_v2`。 |
| JSON 预览 `JsonPreview` | 任意 JSON | 勾选“查看 JSON”后显示 | blur 事件尝试解析 JSON 并写回 `form`，失败会给 textarea 添加 `invalid` class。 |
| Prompt 输入 | `promptText` | 初始值：`SYSTEM_PROMPT` | 存在 `kolsearch_prompt_override_v1`，Step3 中可编辑。Step1 侧只使用当前值。 |

### 2.2 关键词策略生成接口（LLM）

| 项 | 说明 |
| --- | --- |
| 触发操作 | Step1 顶部按钮“生成并进入策略页”或 Step2 顶部“重新生成策略”，调用 `handleGenerate()`。 |
| 封装函数 | `requestStrategies(form, API_CONFIG, effectivePrompt)` (`frontend/src/utils/llmClient.ts`) |
| 请求 URL | `https://llm-pool-common.nlp.yuntingai.com/chat/completions` |
| 方法 / Headers | `POST`；`Authorization: Bearer ${apiKey}`、`Content-Type: application/json`、`Accept: application/json`、`User-Agent: KolSearchUI/0.1` |
| API Config | ```ts\nconst API_CONFIG: ApiConfig = {\n  apiKey: \"sk-aFzV8kniNhLXKQjzx5WxytYTAA\",\n  apiUrl: \"https://llm-pool-common.nlp.yuntingai.com/chat/completions\",\n  model: \"anthropic/claude-4-5-sonnet-latest\",\n  temperature: 0.1,\n};\n``` |
| 请求体结构 | ```jsonc\n{\n  \"model\": \"anthropic/claude-4-5-sonnet-latest\",\n  \"temperature\": 0.1,\n  \"stream\": false,\n  \"n\": 1,\n  \"metadata\": { \"user_id\": \"CEM-TOPIC-VALUE-EXTRACT\" },\n  \"messages\": [\n    { \"role\": \"system\", \"content\": SYSTEM_PROMPT },\n    {\n      \"role\": \"user\",\n      \"content\": \"以下为项目JSON，请生成关键词策略:\\n\" + JSON.stringify(ProjectForm, null, 2)\n    }\n  ]\n}\n``` |
| 参数来源 | - `SYSTEM_PROMPT`：详见附录，控制输出结构/语气。<br>- `ProjectForm`：来自模板+用户输入；字段缺失时也会发送空数组/空字符串。 |

#### ProjectForm 字段映射

| 字段 | 类型 | 说明 / 来源 |
| --- | --- | --- |
| `industry_keywords`, `category_keywords` | `string[]` | 行业 / 品类关键词；模板预设，可手动增删。 |
| `brand_name`, `product_name`, `product_page_url` | `string` | 品牌、产品、落地页。`product_page_url` 可为空，继续发送。 |
| `competitor_brands`, `product_use_scenarios`, `core_selling_points` | `string[]` | 竞品、场景、卖点。 |
| `target_audience`, `target_creator_types`, `preferred_content_styles`, `required_video_scene_elements` | `string[]` | 受众、创作者、内容风格、视频场景元素。 |
| `creator_tier_config` | `{ tier_name, follower_range, search_strategy }[]` | 控制层级差异叙述。Template 默认有头/腰/尾三档，可在「红人分层」tab 编辑。 |

#### 示例请求（节选）

```json
{
  "model": "anthropic/claude-4-5-sonnet-latest",
  "temperature": 0.1,
  "stream": false,
  "n": 1,
  "metadata": { "user_id": "CEM-TOPIC-VALUE-EXTRACT" },
  "messages": [
    { "role": "system", "content": "<SYSTEM_PROMPT 省略>" },
    {
      "role": "user",
      "content": "以下为项目JSON，请生成关键词策略:\n{\n  \"industry_keywords\": [\"robotic lawn mower\", \"smart outdoor equipment\"],\n  \"category_keywords\": [\"wire-free robot mower\", \"RTK lawn mower\"],\n  \"brand_name\": \"Lymow\",\n  \"product_name\": \"Lymow One Plus Robotic Lawn Mower\",\n  \"product_page_url\": \"https://www.lymow.com/one-plus\",\n  \"competitor_brands\": [\"Yarbo\", \"Mammotion\"],\n  \"product_use_scenarios\": [\"large backyard lawn\"],\n  \"core_selling_points\": [\"wire-free RTK navigation\"],\n  \"target_audience\": [\"suburban homeowners\"],\n  \"target_creator_types\": [\"lawn care reviewers\"],\n  \"preferred_content_styles\": [\"review\", \"setup walkthrough\"],\n  \"required_video_scene_elements\": [\"backyard lawn\"],\n  \"creator_tier_config\": [\n        {\"tier_name\": \"头部\", \"follower_range\": \"500K+\", \"search_strategy\": \"垂直测评\"},\n        {\"tier_name\": \"腰部\", \"follower_range\": \"50K-500K\", \"search_strategy\": \"场景体验\"},\n        {\"tier_name\": \"尾部\", \"follower_range\": \"5K-50K\", \"search_strategy\": \"生活方式记录\"}\n  ]\n}\n"
    }\n  ]\n}\n```

### 2.3 响应解析与落地

| 步骤 | 说明 |
| --- | --- |
| 响应预处理 | `requestStrategies` 读取 `data.choices[0].message.content`，允许 LLM 返回 Markdown 代码块；通过 `extractJsonPayload` + `normalizeJsonText` 去除围栏、替换全角引号。若 JSON 解析失败，使用 `jsonrepair` 兜底。 |
| 数据模型 | 约定返回 `StrategyResponse`：<br>```ts\n{\n  project_summary: ProjectSummary,\n  keyword_strategy_groups: KeywordStrategyGroup[]\n}\n``` |
| 正常化 | - `normalizeSummary`：缺失字段 fallback 到当前 `ProjectForm`，`core_search_direction` 默认空数组。<br>- `normalizeStrategy`：补齐 `enabled=true`、`tags` 数组、`recommended_creator_tiers` 等。 |
| 状态落地 | - `summary` -> localStorage(`kolsearch_project_summary_v1`).<br>- `strategies` -> localStorage(`kolsearch_strategy_cache_v2`).<br>- 同步更新 UI 并跳转 Step2（`handleGenerateAndNavigate`). |
| 错误处理 | `catch` 中设置 `statusMessage`，并在控制台打印原始错误；当 `response.ok` 为 false 时抛出 `LLM调用失败：status text`。 |

#### 示例响应（节选）

```json
{
  "project_summary": {
    "industry_category": "Smart outdoor equipment",
    "product_name": "Lymow One Plus Robotic Lawn Mower",
    "brand_name": "Lymow",
    "core_search_direction": ["wire-free RTK lawn care", "outdoor automation"]
  },
  "keyword_strategy_groups": [
    {
      "strategy_type": "vertical_precision",
      "keyword_group_name": "北美庭院割草测评",
      "keyword_list": [
        "robotic lawn mower review",
        "wire free mower comparison",
        "rtk lawn care test",
        "autonomous mower setup",
        "lawn automation review"
      ],
      "strategy_explanation": "…",
      "tags": {
        "创作者类型": ["草坪护理测评", "户外科技博主"],
        "内容形态": ["review", "comparison"],
        "适合层级": ["头部"]
      },
      "recommended_creator_tiers": ["头部"]
    }
  ]
}
```

其余 4 个策略组结构一致，仅具体内容不同。

### 2.4 Step1 输出字段

| 字段 | 含义 | 使用场景 |
| --- | --- | --- |
| `ProjectSummary.industry_category` | 行业标签（可能是字符串或数组，当作字符串存储） | Step2 Summary Card、任务名称前缀。 |
| `ProjectSummary.product_name` / `brand_name` | 产品/品牌名 | Summary Card + 任务名 + 日志。 |
| `ProjectSummary.core_search_direction` | 核心搜索方向 chips | Step2 顶部摘要；空数组时不展示。 |
| `KeywordStrategyGroup.strategy_type` | 策略枚举值（5 组固定） | StrategyCard 标签、log key。 |
| `keyword_group_name` | 中文展示名，可编辑 | StrategyCard 输入框 + 任务名。 |
| `keyword_list` | ≤5 个英文关键词 | StrategyCard 列表 + sendTask 拼接 `keywords`。 |
| `strategy_explanation` | 两层结构说明 | StrategyCard 文案；不参与 API。 |
| `tags` (`创作者类型`/`内容形态`/`适合层级`) | 供 UI 展示 & 选择器初始值 | 发送任务时不直接使用，但 `适合层级` 与 `recommended_creator_tiers` 保持一致。 |
| `recommended_creator_tiers` | `["头部","腰部"]` 等 | StrategyCard multi-select；发送任务时仅影响 UI，不进入请求体。 |

### 2.5 Step1 产物与 Step2 的衔接

1. 成功生成策略后，`setStrategies` 为每个组写入 `lastGeneratedAt`（ISO 字符串）。
2. Step2 渲染策略卡片时直接读取 `strategies` 状态；未生成时提示“暂无策略”。
3. `summary` 为空会导致 Step2 按钮 `handleSendGroup` 直接返回“请先生成策略”，因此 Step1 输出是 Step2 的硬依赖。
4. 所有关键对象在 localStorage 中持久化，可刷新后继续编辑；`currentStep`（`kolsearch_step_state_v1`）记住停留页面。

## 3. Step 2 · 关键词策略与任务管理接口

Step2 页面由摘要卡 + 策略卡列表 + 任务日志组成，核心流程是“人手微调 LLM 产出的关键词 → 发送任务 API → 记录回执”。顶部操作区包含“返回项目信息”（仅切换 `currentStep`）与“重新生成策略”（复用 Step1 的 `handleGenerate` → `requestStrategies` 流程）。接口说明如下：

### 3.1 策略卡交互（无直接外部请求）

| 区块 | 字段/状态 | 说明 |
| --- | --- | --- |
| 卡片头部 | `strategy_type`（只读）、`keyword_group_name`（可编辑）、`enabled`（checkbox） | `enabled=false` 时只在 UI 中置灰，不会被 `sendTask` 自动排除；需要人工控制是否发送。 |
| 关键词列表 | `keyword_list: string[]` | 支持增删关键字；发送任务前会由 `normalizeKeywordList` 用逗号拼接，同时剔除回车空白。 |
| 策略说明 | `strategy_explanation` | 文案场景，不进入 API。 |
| 标签区 | `tags` 三个字段 + `recommended_creator_tiers` 多选框 | 主要用于保持策略描述一致性；多选框变化会同步写回 `tags["适合层级"]`。 |
| 辅助操作 | `复制 curl` 按钮、`发送请求` 按钮、`任务日志` 展开项 | 复制/查看内容来自 `buildCurl`。发送按钮触发 `handleSendGroup` → `sendTask`。 |

### 3.2 任务发送接口（GlobalOneClick）

| 项 | 说明 |
| --- | --- |
| 触发操作 | 策略卡底部“发送请求”按钮。禁用条件：`group.sendingStatus === "sending"`；如未生成 summary 会提示“请先生成策略”。 |
| 封装函数 | `sendTask(templateKey, summary, group)` (`frontend/src/utils/taskSender.ts`) |
| 请求 URL | `http://api.globaloneclick.org/project/channelRate/createEvaluateTaskRetUuid` |
| 方法 / Headers | `POST`；`clientid: e5cd7e4891bf95d1d19206ce24a7b32e`、`Authorization: Bearer globaloneclick`、`Content-Type: application/json` |
| 请求体来源 | `buildCurl(template.config, summary, group)`：模板配置为基础，按需覆盖 / 追加字段。 |

#### 字段映射

`buildCurl` 会复制 `PROJECT_TEMPLATES[templateKey].config`，再做以下改写：

| 字段 | 来源 | 处理逻辑 / 举例 |
| --- | --- | --- |
| `task_name` | `${summary.product_name} ${group.keyword_group_name}` | 空值会 `trim()`，若最终为空则退回 `group.keyword_group_name`。 |
| `keywords` | `group.keyword_list` | 通过 `normalizeKeywordList` 将数组转为英文逗号分隔字符串，移除换行。 |
| `competing_product` / `p0channelType` / `p1channelType` / `p2channelType` | 模板原始值 | `normalizeCsvText` 将中文顿号、全角逗号替换为半角逗号，去除多余空白。 |
| 其他字段（例如 `project_id`, `brand_name`, `channel_search_type`, `video_max_result`, `prefer_country`, `min_subscribers`, `order`, `excludeSearched` 等） | 模板 `config` | 原样透传，可在附录查看每个模板的缺省值。 |

#### 请求示例（模板：`lymow`，策略组中文名“草坪科技评测”）

```http
POST http://api.globaloneclick.org/project/channelRate/createEvaluateTaskRetUuid
clientid: e5cd7e4891bf95d1d19206ce24a7b32e
Authorization: Bearer globaloneclick
Content-Type: application/json

{
  "project_id": "552",
  "brand_name": "lymow",
  "competing_product": "Yarbo,Mammotion,Dreame,Sunseeker,Husqvarna",
  "video_max_result": 200,
  "order": "relevance",
  "prefer_country": "NORTH_AMERICAN",
  "channel_search_type": "video",
  "min_subscribers": 1000,
  "p0channelType": "草坪护理博主,园艺 / Landscaping 博主",
  "p1channelType": "智能家居科技测评博主,生活方式博主（有庭院生活）",
  "p2channelType": "DIY / 工具类测评博主",
  "excludeSearched": true,
  "excludeFromDedupList": true,
  "task_name": "Lymow One Plus Robotic Lawn Mower 草坪科技评测",
  "keywords": "lawn mower review,robotic mower comparison,wire free lawn care,gps lawn mower,lawn automation setup"
}
```

### 3.3 回执解析与任务入库

| 步骤 | 说明 |
| --- | --- |
| 发送状态 | 在 `sendTask` 开始前，将目标 `group` 的 `sendingStatus` 置为 `"sending"`，UI 显示“发送中...”。 |
| 响应处理 | 服务端返回字符串格式；尝试 `JSON.parse`，如果存在 `data.task_uuid` 或 `task_uuid` 字段则回传到调用侧并写入状态消息：“发送成功，任务 UUID: xxx”。 |
| 错误处理 | - HTTP 非 2xx 抛出 `发送失败：status body`。<br>- 解析失败 -> 仅保留 `raw` 文本并标记 `sendingStatus: "error"`。 |
| 本地任务写入 | 若拿到 `uuid`，会构造 `StoredTaskRecord`：<br>```ts\n{\n  task_uuid: uuid,\n  project_id: projectId,\n  task_name: `${summary.product_name} ${group.keyword_group_name}`,\n  keywords: group.keyword_list.join(\", \"),\n  status: \"PENDING\",\n  channelSearchType: template.config.channel_search_type,\n  platform: template.config.platform ?? \"Youtube\",\n  createdAt: new Date().toISOString(),\n  templateKey,\n  summarySnapshot: summary,\n  strategySnapshot: group,\n  initiator: \"当前用户\"\n}\n```<br>然后调用 `upsertTaskRecord(projectId, record)` 保存至 localStorage（键：`kolsearch_tasks_v1`）。 |
| 任务日志 | 每个 `group` 保存 `lastResponse` 文本，Step2 底部的 “API 回执” 面板会列出所有 `lastResponse` 不为空的策略组，支持 `<details>` 展开。 |

### 3.4 Step2 输出字段与使用场景

| 字段 | 意义 | 去向 |
| --- | --- | --- |
| `strategies[].sendingStatus` | 值域：`"idle"` / `"sending"` / `"success"` / `"error"` | 控制按钮文案及日志状态。 |
| `strategies[].lastResponse` | 最近一次接口响应原文 | API 回执面板，便于排查。 |
| `StoredTaskRecord` | 任务快照 | Step3 的 `TaskManagementPanel` 读取，用于同步状态 / 查看报告。 |
| `projectId`（由模板或品牌名推导） | localStorage 的 task key | 使不同模板/项目的任务隔离存储。 |

### 3.5 Step2 与下游（任务同步/报告）的衔接

虽然任务详情页属于 Step3，但理解 Step2 输出有助于确保字段完整：

1. Step3 的 `TaskManagementPanel` 会从 `kolsearch_tasks_v1[projectId]` 中读取 `StoredTaskRecord` 列表，展示在“项目任务列表”表格。
2. 用户点击“同步任务状态”或“查看详情”时，会调用 `fetchTaskDetail(uuid)` 与 `fetchTaskReport({ uuid, ...filters })`（接口分别是 `GET /project/spiderRecord/detailByUuid/{uuid}` 与 `POST /project/channelRate/channelRateList`），它们依赖 Step2 保存的 `task_uuid`。
3. 因此 Step2 若未拿到 `uuid`，任务管理面板只能展示本地草稿，无法查询远端执行情况；文档中建议在 `lastResponse` 中观察服务端是否返回 `uuid` 并及时补发。

## 4. 附录：数据结构、存储键与模板配置

### 4.1 TypeScript 数据结构（节选）

| 类型 | 字段 | 说明 | 位置 |
| --- | --- | --- | --- |
| `ProjectForm` | `industry_keywords: string[]` 等 13 个数组字段；`brand_name` 等基础字段；`creator_tier_config: CreatorTierConfig[]` | Step1 发送给 LLM 的完整输入。 | `frontend/src/types.ts` |
| `KeywordStrategyGroup` | `strategy_type`, `keyword_group_name`, `keyword_list`, `strategy_explanation`, `tags: StrategyTagMap`, `recommended_creator_tiers`, `enabled`, `sendingStatus`, `lastResponse` | LLM 返回 + Step2 编辑 + 发送任务时的主数据结构。 | 同上 |
| `ProjectSummary` | `industry_category`, `product_name`, `brand_name`, `core_search_direction` | LLM 返回的摘要，Step2 UI 依赖。 | 同上 |
| `StrategyResponse` | `{ project_summary: ProjectSummary; keyword_strategy_groups: KeywordStrategyGroup[] }` | `requestStrategies` 期望的响应结构。 | 同上 |
| `StoredTaskRecord` | `task_uuid`, `project_id`, `task_name`, `keywords`, `status`, `channelSearchType`, `platform`, `createdAt`, `updatedAt`, `initiator`, `templateKey`, `summarySnapshot`, `strategySnapshot` | Step2 发送成功后写入的任务快照。 | 同上 |
| `ApiConfig` | `apiKey`, `apiUrl`, `model`, `temperature` | LLM 请求配置，可通过环境变量注入（当前硬编码）。 | 同上 |

### 4.2 localStorage 键

| 键名 | 写入点 | 说明 |
| --- | --- | --- |
| `kolsearch_form_draft_v2` | `saveToStorage(FORM_STORAGE_KEY, form)` | Step1 表单草稿（`ProjectForm`）。 |
| `kolsearch_strategy_cache_v2` | `saveToStorage(STRATEGY_STORAGE_KEY, strategies)` | 最近一次 `KeywordStrategyGroup[]`。 |
| `kolsearch_project_summary_v1` | `saveToStorage(SUMMARY_STORAGE_KEY, summary)` | LLM 摘要。 |
| `kolsearch_template_key_v1` | `saveToStorage(TEMPLATE_STORAGE_KEY, templateKey)` | 当前模板。 |
| `kolsearch_step_state_v1` | `saveToStorage(STEP_STORAGE_KEY, currentStep)` | 记住用户停留步骤。 |
| `kolsearch_json_toggle_v1` | `saveToStorage(..., showJson)` | JSON 预览开关。 |
| `kolsearch_prompt_override_v1` | `saveToStorage(PROMPT_STORAGE_KEY, promptText)` | 自定义系统 Prompt。 |
| `kolsearch_tasks_v1` | `taskStorage.ts` (`upsertTaskRecord` 等) | 所有项目任务记录，按 `projectId` 分类。 |

### 4.3 模板配置（`PROJECT_TEMPLATES`）

| 模板 key | 基础属性 | `config` 主要字段 |
| --- | --- | --- |
| `lymow` | `label: "Lymow 智能割草"`、`brand_name: "Lymow"`、`display_note: "庭院割草机器人..."` | `project_id: "552"`, `brand_name: "lymow"`, `competing_product: "Yarbo,...,Husqvarna"`, `video_max_result: 200`, `order: "relevance"`, `prefer_country: "NORTH_AMERICAN"`, `channel_search_type: "video"`, `min_subscribers: 1000`, `p0channelType/p1channelType/p2channelType`（多条中文）, `excludeSearched: true`, `excludeFromDedupList: true`。 |
| `igarden` | `label: "iGarden 泳池亚洲"`、`brand_name: "iGarden"` | `project_id: "551"`, `brand_name: "iGarden"`, `competing_product: "Slipstream,...,FanceSwim"`, `video_max_result: 200`, `order: "relevance"`, `prefer_country: "NORTH_AMERICAN"`, `channel_search_type: "video"`, `min_subscribers: 1000000`, `p0/p1/p2 channelType`（游泳/宠物场景）。 |
| `custom` | `label: "自定义"`、`brand_name: ""` | `config: {}`（完全由用户在 JSON 面板中自建；发送任务时只会包含 Step2 自己追加的 `task_name`/`keywords` 字段）。 |

> **注意**：模板 `config` 可通过修改 `frontend/src/constants/templates.ts` 扩展字段，例如 `channel_search_type`, `platform`, `excludeFromDedupList` 等，只要符合后端接口 schema 即可。Step2 发送任务时会原样透传这些字段。

### 4.4 系统 Prompt 与覆写

- 文件：`frontend/src/constants/systemPrompt.ts`
- 作用：作为 LLM `messages[0]` 的 system 指令，定义了输入结构、工作步骤、策略写作规范与输出 JSON 结构。
- 关键约束：固定生成 5 个策略组、包含两层说明结构、tags 与 `recommended_creator_tiers` 必须一致、失败时也要返回完整 JSON。
- 覆写方式：在 Step3「提示词配置」页修改文本，保存后写入 `kolsearch_prompt_override_v1`；恢复默认时调用 `handleRestorePrompt` 将其重置为 `SYSTEM_PROMPT` 常量。

### 4.5 参考文件索引

| 模块 | 文件 |
| --- | --- |
| React 页面入口（含 Step 切换、状态管理） | `frontend/src/App.tsx` |
| LLM 请求封装 | `frontend/src/utils/llmClient.ts` |
| 任务发送/构造 cURL | `frontend/src/utils/taskSender.ts`、`frontend/src/utils/curlBuilder.ts` |
| 本地任务存储 | `frontend/src/utils/taskStorage.ts` |
| 任务详情/报告接口（Step3 使用） | `frontend/src/utils/taskApi.ts` |
| UI 组件 | Step1：`ProjectFormPanel.tsx`, `TemplatePicker.tsx`, `JsonPreview.tsx`；Step2：`StrategyCard.tsx` |

阅读这些文件即可追溯所有字段的真实实现，确保接口文档与代码保持一致。
