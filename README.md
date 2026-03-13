<div align="center">
<img width="1200" height="475" alt="InfluencerSearch banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# InfluencerSearch · AI 海外红人搜索工作台

InfluencerSearch 是一个以 React + Vite 打造的多步骤工作台，用于演示如何借助 Gemini 能力配置品牌营销需求、生成关键词方案、监控任务执行并浏览红人候选列表。界面完全组件化，方便在 Google AI Studio 中测试或在本地继续扩展。

> 在 AI Studio 中体验此应用：<https://ai.studio/apps/646cbc68-2303-440a-a0e4-50e0c87f8b96>

## 功能亮点

- **一键创建任务仪表盘**：`src/components/Dashboard.tsx` 展示最近任务、AI 功能卡片和入口按钮，模拟 SaaS 控制台体验。  
- **需求配置向导**：`Step1` 用模块化表单收集产品、市场和达人分层信息，并提供“AI 智能解析”入口。  
- **AI 关键词方案与风险提示**：`Step2` 展示多套关键词策略、风险标记和确认弹窗，体现人机协作审阅流程。  
- **执行态监控**：`TaskProgress` 通过动态步骤条和进度推演说明后台任务如何运行以及节省的人工时间。  
- **结果分析面板**：`TaskResults` 提供筛选、排序、侧边抽屉详情、批量导出等动作，方便二次评估与复用。

## 技术栈

- **React 19 + Vite 6**：快速开发、开箱即用的 HMR（AI Studio 中默认关闭）。
- **Tailwind CSS 4 + PostCSS**：在 `src/index.css` 中直接引入，用于快速构建设计体系。
- **Lucide Icons & Motion**：为界面交互提供高质量图标与动画能力。
- **Gemini API 占位**：`@google/genai` 作为依赖，便于将来接入真实的关键词生成或红人打分模型。

## 项目结构

```text
.
├── src
│   ├── App.tsx             # 负责多视图路由逻辑
│   ├── main.tsx            # React 入口
│   ├── index.css           # Tailwind 引入
│   └── components
│       ├── Dashboard.tsx   # 仪表盘 / 任务入口
│       ├── Step1.tsx       # 需求配置（产品 + 筛选策略）
│       ├── Step2.tsx       # AI 关键词方案审阅
│       ├── TaskProgress.tsx# 任务进度动画
│       └── TaskResults.tsx # 结果列表与抽屉详情
├── .env.example            # 环境变量示例
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 快速开始

### 1. 环境准备

- Node.js 18+（建议与 AI Studio 保持一致）
- npm（或你偏好的包管理器）

### 2. 安装依赖

```bash
git clone <repo-url>
cd kolSearchV0306
npm install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env.local`（或 `.env`），并填写必要的密钥。

| 变量名         | 是否必填 | 说明 |
| -------------- | -------- | ---- |
| `GEMINI_API_KEY` | 是 | Gemini API 密钥，用于调用生成式能力。AI Studio 会通过 Secrets 自动注入。 |
| `APP_URL`        | 否 | 部署后应用自身的 URL，主要用于回调或分享链接场景。 |

### 4. 启动开发服务器

```bash
npm run dev
```

本地默认监听 `http://localhost:3000`。若在 AI Studio 中运行，需确保 `GEMINI_API_KEY` 已通过 Secrets 配置。

## 常用 npm Script

| 命令            | 作用 |
| --------------- | ---- |
| `npm run dev`   | 启动 Vite 开发服务器（AI Studio 中使用 `--host=0.0.0.0`）。 |
| `npm run build` | 生成生产构建，输出到 `dist/`。 |
| `npm run preview` | 以本地静态服务器的方式预览构建产物。 |
| `npm run lint`  | 运行 `tsc --noEmit` 做类型检查。 |
| `npm run clean` | 删除 `dist/`。 |

## 关键界面速览

- `Dashboard`：展示项目定位、上次任务与 AI 模块卡片，按钮切换至步骤流程。
- `Step1`：大屏分两列呈现产品信息、目标市场、达人分层、策略配置等多组输入。
- `Step2`：显示多套关键词策略及风险提示，附带确认弹窗，将人工审核流程可视化。
- `TaskProgress`：用 5 个阶段（初始化、匹配、清洗、评分、报告）动态展示后台执行情况。
- `TaskResults`：包含标签筛选、排序、结果卡片、底部汇总条以及侧边抽屉详情，方便扩展真实数据。

## 部署与扩展建议

1. 执行 `npm run build` 后将 `dist/` 部署到任意静态站点（Vercel、Netlify、Cloud Run Static 等）。  
2. 若需要后端服务，可在现有 `express` + `better-sqlite3` 依赖基础上新增 `server/` 文件夹，并通过 Vite 代理或 AI Studio 的 API Route 集成。  
3. 将 Gemini API 的真实调用逻辑接入 `Step2`（关键词生成）与 `TaskResults`（打分或理由生成），即可由静态演示过渡到可用的内部工具。  
4. 如果在 AI Studio 中禁用 HMR，可设置 `DISABLE_HMR=false` 以恢复本地开发体验。

---

欢迎根据业务需要调整表单字段、结果指标或接入真实数据源。如需协同编辑文档，可在本 README 基础上继续补充使用指南、API 协议或部署手册。
