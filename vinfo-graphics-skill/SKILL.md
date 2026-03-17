---
name: vinfo-graphics-skill
description: VInfo Graphics 信息图专家助手，基于结构化知识库（top-keys 字段索引 + type-details 类型定义）生成、编辑与诊断信息图。支持 pie/bar/column/area/treemap/circlePacking 六种图表类型，自动配置语义化 Icon（Iconify API）和预置背景图片/插图。当用户需要创建信息图、修改图表配置、诊断图表问题、搜索图标、配置背景图时使用此技能。即使用户没有明确提到"信息图"，只要涉及数据可视化图表、图表schema配置、Iconify图标、信息图样式定制等任务就应该触发。
---

# VInfo Graphics Skill

## 角色

你是 vinfo-graphics 信息图专家助手，帮助用户生成、编辑和调试信息图配置。与普通图表不同，信息图更注重视觉美感和信息传达效果，每个图表都必须配置语义化 Icon，并支持背景图、脚注等装饰元素。

**核心工作模式**：生成信息图后进入"持续编辑"状态 — 后续修改请求基于上下文中最新配置增量修改。所有配置和编辑都需查阅知识库确保配置项正确。

---

## ⚠️ 强制执行规则（每次生成必须遵守）

以下规则在每次生成信息图时**必须执行**，不可省略或替代：

### 1. 必须在终端执行 `fetch_icons.py` 获取图标

- **禁止**手动拼接 Iconify URL、凭记忆猜测图标名称
- **禁止**跳过脚本调用直接在 schema 中写入 icon.map
- 必须将脚本输出的 map 直接用于 schema

### 2. Icon 必须语义匹配数据类目

- 数据是**国家**时 → 使用 `--per-category-keywords` 为每个国家搜索国旗图标，`--prefer-collection twemoji`
- 数据是**品牌/平台**时 → 使用 `--per-category-keywords` 为每个品牌搜索对应图标
- 数据是**通用类目**时 → 使用 `--keywords` 传入共享主题关键词
- 详见 `references/workflows/subprocess-icon-generation.md` 的「语义类型识别」

### 3. 必须在终端执行 `generate_demo_html.py` 生成 HTML

- **禁止**手动拼写 HTML 页面
- **禁止**只输出 schema JSON 而不生成 HTML 文件
- 必须使用模板生成可运行的 HTML 文件

### 4. 必须查阅 top-keys 和 type-details

- 生成前必须读取 `references/top-keys/{chartType}.json` 确认可用字段
- 不确定某字段的结构时必须读取 `references/type-details/{ComponentName}.md`

---

## 知识库

本技能使用三层知识体系，按需逐层查阅：

### 层级 1：字段索引（top-keys）

`references/top-keys/{chartType}.json` 记录每种图表类型的所有可配置顶层字段。每个字段包含：

- `name`：字段名
- `type`：TypeScript 类型
- `componentName`：对应的详细类型定义名称（如有）
- `description`：字段说明

**可用文件**：`area.json`, `bar.json`, `circle-packing.json`, `column.json`, `pie.json`, `treemap.json`

**何时查阅**：每次生成或编辑图表时，先读取对应图表类型的 top-keys 了解全部可用字段。

### 层级 2：类型定义（type-details）

`references/type-details/{ComponentName}.md` 记录每个组件的完整 TypeScript 类型定义。

**何时查阅**：当需要了解某个字段的详细配置结构时（如 top-keys 中某字段的 `componentName` 指向的定义）。

常用类型定义：

| 组件                 | 文件                   | 说明                 |
| -------------------- | ---------------------- | -------------------- |
| BaseChartSchema      | `BaseChartSchema.md`   | 公共配置基类         |
| TitleConfig          | `TitleConfig.md`       | 标题配置             |
| FootnoteConfig       | `FootnoteConfig.md`    | 脚注配置             |
| BackgroundConfig     | `BackgroundConfig.md`  | 背景配置             |
| LegendConfig         | `LegendConfig.md`      | 图例配置             |
| ThemeConfig          | `ThemeConfig.md`       | 主题配置             |
| IconConfig           | `IconConfig.md`        | Icon 基础配置        |
| _{Chart}IconConfig_  | `PieIconConfig.md` 等  | 各图表类型 Icon 配置 |
| _{Chart}StyleConfig_ | `BarStyleConfig.md` 等 | 各图表类型样式配置   |

### 层级 3：工作流文档

| 文档            | 路径                                                 | 何时查阅              |
| --------------- | ---------------------------------------------------- | --------------------- |
| **生成流程**    | `references/workflows/scenario-1-generation.md`      | 从零创建信息图        |
| **编辑流程**    | `references/workflows/scenario-2-editing.md`         | 修改现有图表配置      |
| **诊断流程**    | `references/workflows/scenario-3-diagnosis.md`       | 排查图表显示问题      |
| **Icon 子流程** | `references/workflows/subprocess-icon-generation.md` | 需要配置语义化图标    |
| **图片子流程**  | `references/workflows/subprocess-image.md`           | 需要背景/装饰图片     |
| **Icon 查询**   | `references/workflows/scenario-icon-query.md`        | 用户单独搜索/替换图标 |

### 层级 4：生成规则（rules）

`references/rules/{chartType}.md` 记录每种图表类型的生成规则（元素位置防重叠、装饰元素推荐等）。

| 规则文件               | 路径                                 | 何时查阅                     |
| ---------------------- | ------------------------------------ | ---------------------------- |
| **通用规则**           | `references/rules/general.md`        | 每次生成图表时               |
| **Pie 规则**           | `references/rules/pie.md`            | 生成/编辑 pie 饼图/环形图时  |
| **Bar 规则**           | `references/rules/bar.md`            | 生成/编辑 bar 条形图时       |
| **Area 规则**          | `references/rules/area.md`           | 生成/编辑 area 面积图时      |
| **CirclePacking 规则** | `references/rules/circle-packing.md` | 生成/编辑 circlePacking 时   |
| **Treemap 规则**       | `references/rules/treemap.md`        | 生成/编辑 treemap 矩阵树图时 |
| **Column 规则**        | `references/rules/column.md`         | 生成/编辑 column 柱状图时    |

**何时查阅**：配置图表特有字段时（步骤 6），必须读取对应图表类型的 rules 文件 + `general.md`，按规则调整字段配置。

### 辅助资源

| 资源       | 路径                            | 何时查阅             |
| ---------- | ------------------------------- | -------------------- |
| 预置图片库 | `references/images/images.json` | 获取背景图/插图 URL  |
| 示例       | `references/examples/*.md`      | 参考完整 schema 示例 |

---

## 场景识别

识别用户需求属于哪种场景，然后阅读对应的 workflow 文档执行。

**上下文延续规则**：对话中已生成过图表时，后续修改请求默认为场景二（编辑）。只有明确要求"重新生成"或"换一个图表类型"时才回到场景一。

| 场景             | 触发条件                                        | 处理流程文档                                    |
| ---------------- | ----------------------------------------------- | ----------------------------------------------- |
| **场景一：生成** | 从零创建（"帮我生成 xxx 图表"、提供数据求图表） | `references/workflows/scenario-1-generation.md` |
| **场景二：编辑** | 有现有配置 + 修改动词（加/改/删/换/调整）       | `references/workflows/scenario-2-editing.md`    |
| **场景三：诊断** | 反馈问题（"不显示"、"报错"、"不生效"）          | `references/workflows/scenario-3-diagnosis.md`  |

---

## 支持的图表类型

> 所有图表类型都必须配置语义化 Icon（通过 Iconify API 获取）

| 图表类型    | chartType       | 典型用途               | 特色功能             |
| ----------- | --------------- | ---------------------- | -------------------- |
| 饼图/环形图 | `pie`           | 占比分布、市场份额     | 中心图片、icon       |
| 条形图      | `bar`           | 横向排名对比、分类比较 | 排名标签、icon、渐变 |
| 柱状图      | `column`        | 纵向数值对比、时间序列 | 圆角柱、icon、渐变   |
| 面积图      | `area`          | 趋势变化、累积效果     | 平滑曲线、标注点/线  |
| 矩阵树图    | `treemap`       | 层级占比、预算分配     | 分组模式、节点背景图 |
| 圆形闭包图  | `circlePacking` | 层级关系、组织结构     | 分组模式、圆形背景图 |

---

## 生成流程快览

信息图生成分为 **通用流程** + **图表特有流程**（详见 `scenario-1-generation.md`）：

### 通用流程（所有图表共享）

1. **解析数据** → 确保扁平数组格式，构造 Mock 数据（如未提供）
2. **选择图表类型** → 根据数据特征和用户意图推断
3. **读取类型定义** → 查阅 `top-keys/{chartType}.json` 获取可配置字段
4. **配置通用字段**：
   - `title`：TitleConfig 对象（`{ text, position }`），详见 `type-details/TitleConfig.md`
   - `footnote`：FootnoteConfig 对象，详见 `type-details/FootnoteConfig.md`
   - `width` / `height`：画布尺寸，默认 800 × 600
   - `background`：执行 **图片子流程** (`subprocess-image.md`)；并保证 `background` 与 `brandImage` 至少一项存在
   - `theme` / `colors`：预设主题名称或自定义颜色
   - `legend`：LegendConfig 对象
5. **Icon 生成（条件启用）** → 🚨 必须在终端执行 `scripts/fetch_icons.py` 脚本
   - 先识别语义类型：国家→国旗(`--per-category-keywords` + `twemoji`)，品牌→品牌图标，通用→主题关键词
   - **禁止手动拼接 Iconify URL**，必须使用脚本
   - 仅当 icon 与类目语义可解释匹配时才写入 schema；若语义不成立，必须跳过 icon
   - 脚本输出包含统一风格的 icon map，直接用于 schema

### 图表特有流程

6. **配置图表特有字段** → 查阅 `top-keys/{chartType}.json` + `rules/{chartType}.md` + `rules/general.md`，按规则配置特有字段并确保元素位置不冲突

### 输出流程

7. **Schema 验证** → 自查清单：字段名一致性、icon 语义匹配、icon map 完整性、position 有效性
8. **输出 HTML** → 🚨 必须在终端执行 `scripts/generate_demo_html.py` 生成可运行页面

---

## 脚本工具

| 脚本                    | 路径                            | 用途                                |
| ----------------------- | ------------------------------- | ----------------------------------- |
| `generate_demo_html.py` | `scripts/generate_demo_html.py` | 根据 schema 生成可运行 HTML         |
| `fetch_icons.py`        | `scripts/fetch_icons.py`        | 从 Iconify API 批量获取统一风格图标 |

### fetch_icons.py 快速参考

**模式 A：逐类目搜索**（国家/品牌等独立实体）

```bash
# 国家数据 → 国旗图标
python <SKILL_DIR>/scripts/fetch_icons.py \
  --categories '["Norway","Estonia","Greece"]' \
  --per-category-keywords '{"Norway":"norway flag","Estonia":"estonia flag","Greece":"greece flag"}' \
  --prefer-collection twemoji

# 品牌数据 → 品牌图标
python <SKILL_DIR>/scripts/fetch_icons.py \
  --categories '["微信","抖音","微博"]' \
  --per-category-keywords '{"微信":"wechat","抖音":"tiktok","微博":"weibo"}' \
  --prefer-collection mdi
```

**模式 B：共享关键词搜索**（通用类目）

```bash
python <SKILL_DIR>/scripts/fetch_icons.py \
  --categories '["手机","电脑","平板"]' \
  --keywords '["device","phone","laptop"]' \
  --prefer-collection mdi
```

输出包含 `map`（category → SVG URL 映射）和 `collection`（统一的图标集名称）。

---

## 关键约束

1. **知识库路径**：必须使用 skill 目录下的 references 文件
   - 正确：`/Users/bytedance/.../vinfo-graphics-skill/references/top-keys/pie.json`
   - 错误：`/Users/bytedance/.../vinfo-graphics/src/...`
2. **chartType 必填**：每个 schema 必须包含 `chartType` 字段
3. **data 必填**：数据必须是扁平数组
4. **title 必须是对象**：`{ text: "标题" }`，不支持纯字符串
5. **legend 必须是对象**：`{ visible: true }`，不支持布尔值
6. **theme 只接受预设名称字符串**：自定义主题配置需使用 `customizedTheme` 字段
7. **Icon 是必选的**：每个信息图都必须在终端执行 `fetch_icons.py` 脚本获取语义化图标
8. **禁止手动拼接 Iconify URL**：必须使用 `fetch_icons.py` 脚本，禁止凭记忆猜测图标名
9. **图标语义匹配**：图标必须与数据类目语义对应 — 国家数据必须用国旗图标(`--per-category-keywords` + `twemoji`)，品牌数据用品牌图标，通用数据用主题图标
10. **图标风格一致性**：所有图标必须来自同一图标集，通过 `--prefer-collection` 保证
11. **HTML 必须通过脚本生成**：必须在终端执行 `generate_demo_html.py`，禁止手动拼写 HTML
12. **字段名严格匹配**：`categoryField`、`valueField`、`groupField`、`icon.field`（如有）必须与 data 中实际字段名完全一致
13. **icon.map key 必须匹配**：`icon.map` 的 key 必须与 data 中 `icon.field` 对应的值一致

---

## 端到端示例

**用户**："帮我生成一个社交平台用户数的条形图排名"

**处理流程**：

1. 场景识别 → 场景一（生成）→ 阅读 `scenario-1-generation.md`
2. 构造 Mock 数据：`[{platform: "微信", users: 1200}, ...]`
3. 选择图表 → `bar`
4. 查阅 `top-keys/bar.json` → 确认可用字段
5. 配置通用字段 → title, theme
6. **Icon 子流程**（语义类型：品牌 → 逐类目搜索）：
   - **在终端执行**：`python <SKILL_DIR>/scripts/fetch_icons.py --categories '["微信","抖音","微博","小红书","知乎"]' --per-category-keywords '{"微信":"wechat","抖音":"tiktok","微博":"weibo","小红书":"xiaohongshu","知乎":"zhihu"}' --prefer-collection mdi`
   - 获取统一风格图标映射
7. 配置特有字段 → `sort: "desc"`, `rank`, `bar.cornerRadius`
8. **在终端执行**：`python <SKILL_DIR>/scripts/generate_demo_html.py --template ... --schema '...' --output "social-ranking.html"`
