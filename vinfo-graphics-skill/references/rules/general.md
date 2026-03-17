# 通用生成规则

> 适用于所有图表类型的通用规则，在生成任意图表时都必须遵守。

---

## 规则 1：footnote 图片可使用 icon，无特别语义时可省略

`footnote` 支持配置图片（`image` 字段），可以用于展示数据来源 logo、品牌标识等。

### 使用策略

| 场景                    | footnote.image 处理               | 说明                                        |
| ----------------------- | --------------------------------- | ------------------------------------------- |
| 数据来源有明确品牌/机构 | 使用该品牌/机构的 icon URL        | 例如数据来源为「国家统计局」可搜索对应 icon |
| 用户要求展示来源 logo   | 从 icon.map 中复用已有的 icon URL | 避免重复搜索                                |
| 无特别语义/无数据来源   | **不生成** footnote.image         | 避免放置无意义的装饰图片                    |

### 示例

```json
{
  "footnote": {
    "text": "数据来源：世界银行",
    "image": "https://api.iconify.design/mdi/bank.svg",
    "layout": "left",
    "imageWidth": 16,
    "imageHeight": 16,
    "gap": 8
  }
}
```

### 注意事项

- footnote.image 的 URL 可以直接复用 `icon.map` 中已有的 SVG URL，无需额外调用脚本
- 如果 footnote 只有文字没有特别语义，设置 `text` 即可，不需要强制添加 `image`

---

## 规则 2：图片去重 — background 与数据项图片不可重复

当信息图同时包含 **background.image** 和数据项级别图片（`nodeBackground`、`circleBackground`、`centerImage`）时，**所有图片 URL 必须互不相同**。

### 去重范围

| 图片字段                  | 角色         | 说明                                               |
| ------------------------- | ------------ | -------------------------------------------------- |
| `background.image`        | 全局背景     | 匹配数据的整体主题（如"金融"）                     |
| `brandImage.url`          | 装饰图       | 可与 background 相同主题但不同图片                 |
| `nodeBackground.map[*]`   | 节点背景     | 每个节点必须使用与 background 和其他节点不同的图片 |
| `circleBackground.map[*]` | 圆形背景     | 每个圆形必须使用与 background 和其他圆形不同的图片 |
| `centerImage.url`         | 环形图中心图 | 必须与 background 不同                             |

### 图片选择流程

图片分为两个独立的预置库，分别对应不同用途：

- **背景图片**（`references/images/images.json`）→ 用于 `background.image`、`nodeBackground.map`、`circleBackground.map`
  - 选择流程见 **背景图片子流程** (`references/workflows/subprocess-select-background.md`)
- **装饰插图**（`references/images/decorations.json`）→ 用于 `brandImage.url`、`centerImage.url`
  - 选择流程见 **装饰插图子流程** (`references/workflows/subprocess-select-decoration.md`)

**核心原则**：

- 背景图和装饰插图来自不同图片库，不会互相冲突
- 同一图片库内的图片必须去重（如 background 与 nodeBackground 不可用同一张）
- 至少一项装饰：`background` 与 `brandImage` 不可同时缺失
- **`brandImage` 写了就必须显示**：若不想显示，直接省略该字段；禁止写 `{ "visible": false }` 的 brandImage

### 常见错误

- **错误**：background 和 nodeBackground 中某个节点使用同一张图片
- **错误**：nodeBackground/circleBackground 中不同数据项使用了同一张图片
- **正确**：每张图片只使用一次，且语义匹配对应内容

---

## 规则 3：数据项图片必须语义匹配具体内容

`nodeBackground`、`circleBackground`、`centerImage` 等数据项级别图片必须与**具体数据内容**语义匹配，而非仅匹配数据的宏观主题。

### 匹配原则

| 层级                              | 匹配目标       | 示例                                                         |
| --------------------------------- | -------------- | ------------------------------------------------------------ |
| background                        | 数据整体主题   | 「全球市值 Top 50」→ 搜索 "金融" "股市" "trading"            |
| nodeBackground / circleBackground | 具体数据项内容 | 「NVIDIA」→ 搜索 "chip" "GPU"；「Apple」→ 搜索 "apple phone" |
| centerImage                       | 饼图核心主题   | 「航空市场」→ 搜索 "airplane"；「橄榄产量」→ 搜索 "olive"    |

### 反面示例

- 数据主题为「全球市值 Top 50」，为 NVIDIA、Apple、Alphabet 等节点全部使用「通用科技图片」
  → **错误**：节点图片应分别搜索公司特征关键词
- 数据主题为「游戏 YouTube 频道」，background 和 circleBackground 都使用同一张游戏手柄图片
  → **错误**：应分别搜索背景（如「gaming room」）和每个频道的个性化图片

---

## 规则 4：主题优先 — theme 与 colors / background.color 互斥

预设主题（`theme`）已包含完整的配色方案（`colors`、`backgroundColor`、`textColor`、`secondaryTextColor`）。**当使用预设主题时，禁止同时手写 `colors` 或 `background.color`**，否则会产生冗余甚至冲突。

### 决策流程

```
数据主题 → 是否有匹配的预设主题？
  ├─ 是 → 只写 theme，不写 colors 和 background.color
  │       （background.image 仍可独立使用）
  └─ 否 → 不写 theme，手动配置 colors + background.color（或 background.image）
```

### 允许的组合

| 组合                                        | 是否允许 | 说明                                      |
| ------------------------------------------- | -------- | ----------------------------------------- |
| `theme` 单独使用                            | ✅       | 主题提供全部配色，最简洁                  |
| `theme` + `background.image`                | ✅       | 背景图是独立视觉层，不与主题冲突          |
| `theme` + `brandImage`                      | ✅       | 装饰图是独立视觉层                        |
| `colors` + `background.color`（无 theme）   | ✅       | 无合适主题时，手动配色                    |
| `colors` + `background.image`（无 theme）   | ✅       | 手动配色 + 背景图                         |
| ~~`theme` + `colors`~~                      | ❌       | 主题已含 colors，手写 colors 冗余         |
| ~~`theme` + `background.color`~~            | ❌       | 主题已含 backgroundColor，手写 color 冗余 |
| ~~`theme` + `colors` + `background.color`~~ | ❌       | 三者同时出现，完全冗余                    |

### 例外：品牌色覆盖

当数据项有明确的品牌色（如航空公司、科技公司的品牌色）时，可以在 `theme` 基础上额外写 `colors` 来覆盖主题默认色板：

```json
{
  "theme": "airline",
  "colors": ["#0033A0", "#E4002B", "#6A1B9A"]
}
```

此时 `colors` 的目的不是"配色"而是"品牌还原"，属于合理覆盖。

### 反面示例

```json
// ❌ 错误：theme 已包含 colors 和 backgroundColor，不应再手写
{
  "theme": "energy",
  "colors": ["#F2C14F", "#1D4ED8", "#10B981", "#F97316", "#6366F1", "#14B8A6", "#9CA3AF"],
  "background": { "color": "#020617" }
}

// ✅ 正确：使用主题即可
{
  "theme": "energy"
}

// ✅ 也正确：主题 + 背景图（独立视觉层）
{
  "theme": "energy",
  "background": { "image": "https://images.pexels.com/photos/xxx?w=1920&h=1080&fit=crop" }
}
```

---

## 规则 6：背景图透明度 — 必须根据主题色调与图片色调匹配设置

`background.image` 使用时**必须**根据主题类型（`light`/`dark`）与图片色调（`isDark`）的组合设置合适的 `opacity`，否则图文对比度会严重失调。

### 透明度决策表

| 主题类型            | 图片色调                  | `background.opacity` 范围 | 说明                                            |
| ------------------- | ------------------------- | ------------------------- | ----------------------------------------------- |
| `light`（浅色主题） | `isDark: true`（深色图）  | **0.10 ~ 0.25**           | ⚠️ 冲突组合：深色图压制浅色背景，必须设低透明度 |
| `light`（浅色主题） | `isDark: false`（浅色图） | 0.40 ~ 0.65               | 匹配，图片可适度显示                            |
| `dark`（深色主题）  | `isDark: true`（深色图）  | 0.40 ~ 0.65               | 匹配，图片可适度显示                            |
| `dark`（深色主题）  | `isDark: false`（浅色图） | **0.10 ~ 0.25**           | ⚠️ 冲突组合：浅色图破坏深色氛围，必须设低透明度 |

### 关键原则

- 图片 `isDark` 与主题 `type` **不匹配**时 → 透明度必须 ≤ 0.25，否则会严重影响可读性
- 图片 `isDark` 与主题 `type` **匹配**时 → 透明度可取 0.40 ~ 0.65

### 示例（light 主题 + 深色图 → 冲突，必须低透明度）

```json
// energy 主题 type: "light"，石油图片 isDark: true → 冲突
// ❌ 错误
{
  "theme": "energy",
  "background": { "image": "https://images.pexels.com/photos/3855962/...", "opacity": 0.45 }
}

// ✅ 正确
{
  "theme": "energy",
  "background": { "image": "https://images.pexels.com/photos/3855962/...", "opacity": 0.15 }
}
```

> 详细的图片色调判断方式见 **背景图片子流程** (`references/workflows/subprocess-select-background.md`) 步骤 4。

---

## 规则 5：colors 数量 — 1 个或 ≥ 数据类目数

手动配置 `colors` 数组时，数组长度必须为 **1**（所有元素统一颜色）或 **≥ 数据类目数**（每个类目独立颜色）。**禁止 colors 数量在 2 到 (类目数 - 1) 之间**，这会导致部分类目共享颜色，视觉上混乱。

### 规则

| colors 数量      | 效果             | 是否允许   |
| ---------------- | ---------------- | ---------- |
| 1                | 所有元素统一颜色 | ✅         |
| = 数据类目数     | 每个类目独立颜色 | ✅（推荐） |
| > 数据类目数     | 每个类目独立颜色 | ✅         |
| 2 ~ (类目数 - 1) | 部分类目共享颜色 | ❌         |

### 示例（7 个数据类目）

```json
// ✅ 正确：1 个颜色，所有元素统一
{ "colors": ["#E11D48"] }

// ✅ 正确：7 个颜色，每个类目独立
{ "colors": ["#F2C14F", "#1D4ED8", "#10B981", "#F97316", "#6366F1", "#14B8A6", "#9CA3AF"] }

// ❌ 错误：3 个颜色给 7 个类目，导致 4 个类目复用颜色
{ "colors": ["#F2C14F", "#1D4ED8", "#10B981"] }
```
