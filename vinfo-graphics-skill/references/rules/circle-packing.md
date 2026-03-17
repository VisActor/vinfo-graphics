# CirclePacking 圆形闭包图生成规则

> 生成或编辑 circlePacking 圆形闭包图时，必须遵守以下规则。
> 核心目标：生成**杂志级信息图效果**，而非普通数据图表。
> 两种视觉风格：**突出数值风格**（大号数值 + 主题背景）和**数据丰富风格**（每圆背景图/图标 + 排名）。

---

## 规则 0（最高优先级）：选择视觉风格

CirclePacking 信息图有两种核心风格，**必须在生成前根据数据特征选定一种**：

### 风格 A：突出数值风格（Magazine Style）

**适用场景**：数据重点是百分比/占比/金额等数值，数据量 ≤ 10 条。

**视觉特征**：

- 所有圆使用统一色系（单色/渐变），半透明（`fillOpacity: 0.75 ~ 0.85`）
- 标签使用 `prominent-value` 布局：大号数值 + 小号名称，分行显示
- 整体背景使用主题相关图片（如地图、场景图），通过半透明圆形透出
- **不使用** circleBackground（单圆背景图）
- **不使用** icon
- **不使用** rank

**核心配置**：

```json
{
  "label": {
    "layout": "prominent-value",
    "showPercent": true,
    "valueStyle": { "fill": "#ffffff", "fontWeight": "bold" },
    "nameStyle": { "fill": "#ffffff", "fontWeight": "normal" }
  },
  "circle": { "fillOpacity": 0.8, "strokeWidth": 2, "strokeColor": "rgba(255,255,255,0.3)" },
  "background": { "image": "主题相关背景图URL" },
  "colors": ["#E11D48"]
}
```

**参考效果**：数据 = 全球大宗商品流动份额，背景 = 深蓝色中东地图，圆 = 半透明粉红色，标签 = 大号 "38%" + 小号 "Crude oil"。

### 风格 B：数据丰富风格（Data-Rich Style）

**适用场景**：每个数据项有可辨识的实体（人物、品牌、国家），数据量 5 ~ 20 条。

**视觉特征**：

- 每个圆有独立 circleBackground（头像/旗帜/产品图）
- 可选 icon（角标/标志）
- 标签使用默认布局（`{name}\n{value}` 或 `{name}\n{percent}`）
- 背景为纯色或渐变，配合 brandImage 装饰

**核心配置**：

```json
{
  "label": { "format": "{name}\\n{value}", "showPercent": false },
  "circleBackground": { "field": "bgKey", "map": {...}, "opacity": 0.3 },
  "icon": { "field": "iconKey", "map": {...}, "position": "top-left" },
  "background": { "color": "#1e1b4b" }
}
```

### 风格选择决策表

| 数据特征                      | 选择风格   | 理由                           |
| ----------------------------- | ---------- | ------------------------------ |
| 百分比/占比数据，数据量 ≤ 10  | **风格 A** | 数值本身是核心信息，突出展示   |
| 金额/排行数据，实体图片可获取 | **风格 B** | 每个实体有视觉辨识度           |
| 抽象类目（部门、季度、类别）  | **风格 A** | 无法为每个类目找到有意义的图片 |
| 人物/品牌/国家排行            | **风格 B** | 实体有对应头像/Logo/国旗       |
| 能源/经济/地理主题占比        | **风格 A** | 用地图/主题背景营造氛围        |

---

## 规则 1：circleBackground 仅在风格 B 中使用，且必须语义匹配

### 什么时候用 circleBackground

- **仅风格 B** 使用 circleBackground
- 每个数据项必须有**可辨识的、不重复的**背景图
- 背景图必须与该数据项语义**直接相关**（人物用头像，国家用国旗/地标，品牌用Logo）

### 什么时候不用 circleBackground

- 风格 A **禁止**使用 circleBackground（用整体 background.image 代替）
- 数据类目是抽象概念（如"原油"、"天然气"、"化学品"）时**不用** —— 无法找到有意义的单圆背景
- 预置图片库无法为每个类目提供**语义不同**的图片时**不用**

### 配置方式（风格 B 专用）

```json
{
  "circleBackground": {
    "visible": true,
    "field": "bgKey",
    "map": {
      "频道A": "https://cdn.pixabay.com/photo/xxx_1280.jpg",
      "频道B": "https://cdn.pixabay.com/photo/yyy_1280.jpg"
    },
    "opacity": 0.3
  }
}
```

### 注意事项

- `opacity` 推荐 `0.2 ~ 0.4`
- **不同圆之间的图片不可重复**
- **circleBackground 图片不可与 background.image 重复**
- 如无法为每个圆找到语义不同的图片，**必须跳过 circleBackground 并切换到风格 A**

---

## 规则 2：label 必须使用 prominent-value 布局（风格 A）或分行格式（风格 B）

### 风格 A：prominent-value 布局（强制）

使用 `layout: "prominent-value"` 实现大号数值 + 小号名称的双行显示。数值字体会**自动按圆半径缩放**，大圆显示大字，小圆显示小字。

```json
{
  "label": {
    "visible": true,
    "layout": "prominent-value",
    "showPercent": true,
    "valueStyle": {
      "fill": "#ffffff",
      "fontWeight": "bold"
    },
    "nameStyle": {
      "fill": "rgba(255,255,255,0.9)",
      "fontWeight": "normal"
    }
  }
}
```

| 参数                    | 说明                           | 推荐值                                        |
| ----------------------- | ------------------------------ | --------------------------------------------- |
| `valueStyle.fontSize`   | 留空则自动按圆半径缩放（推荐） | 不设置                                        |
| `valueStyle.fill`       | 数值颜色                       | `#ffffff`（深色背景）或 `#1e1b4b`（浅色背景） |
| `valueStyle.fontWeight` | 粗细                           | `"bold"`                                      |
| `nameStyle.fontSize`    | 留空则自动缩放                 | 不设置                                        |
| `nameStyle.fill`        | 名称颜色                       | `rgba(255,255,255,0.9)` 或更浅                |

### 风格 B：分行默认布局

```json
{
  "label": {
    "visible": true,
    "format": "{name}\\n{value}",
    "showPercent": false
  }
}
```

当有 circleBackground 时，label 文字应使用白色 + 深色背景下的高对比度。

### 禁止

- **禁止**在风格 A 中使用默认布局 —— 默认布局无法突出数值
- **禁止** `{name} {percent}%` 单行格式 —— 信息图必须分行显示

---

## 规则 3：icon、label、rank 位置不可重叠

圆形闭包图中 icon、label、rank 共享有限的圆内空间，必须合理分配位置。

**icon position 可选值**：`top-left` | `top-right` | `center`
**rank position 可选值**：`top-left` | `top-right` | `center`
**label**：默认显示在圆形中心区域

### 推荐搭配

| icon.position | rank.position | label        | 说明                                    |
| ------------- | ------------- | ------------ | --------------------------------------- |
| `top-left`    | `top-right`   | 默认（中下） | icon 和 rank 分列上方两角，label 在中下 |
| `top-right`   | `top-left`    | 默认（中下） | rank 在左上角，icon 在右上角            |
| `center`      | `top-left`    | 默认（下方） | icon 居中突出显示，rank 在角落          |
| `top-left`    | 不显示        | 默认（中下） | 不需要排名时的简洁布局                  |

### 禁止搭配

- `icon.position` 和 `rank.position` **不可相同**
- `icon.position = center` 时 `rank.position` **不可**也设为 `center`
- **风格 A 不使用 icon 和 rank**，此规则仅适用于风格 B

---

## 规则 4：颜色策略 — 风格决定配色方案

### 风格 A：单色/双色系

圆形使用**统一颜色**（1~2 个色值），通过 `fillOpacity` 实现通透效果。

```json
{
  "colors": ["#E11D48"],
  "circle": { "fillOpacity": 0.8 }
}
```

| 主题      | 推荐圆色          | 背景色         | 效果                  |
| --------- | ----------------- | -------------- | --------------------- |
| 能源/石油 | `#E11D48`（粉红） | 深蓝 `#0F172A` | 粉红圆 + 蓝色背景地图 |
| 金融/财富 | `#F59E0B`（金色） | 深灰 `#1F2937` | 金色圆 + 暗色背景     |
| 科技/数据 | `#3B82F6`（蓝色） | 深紫 `#1E1B4B` | 蓝色圆 + 紫色背景     |
| 环保/自然 | `#10B981`（绿色） | 深绿 `#064E3B` | 绿色圆 + 自然背景     |
| 医疗/健康 | `#06B6D4`（青色） | 白色 `#F8FAFC` | 青色圆 + 浅色背景     |

### 风格 B：多色配色

每个圆使用不同颜色，通过 `colors` 数组分配。

```json
{
  "colors": ["#e63946", "#457b9d", "#2a9d8f", "#e9c46a", "#f4a261"]
}
```

### legend 策略

| 场景                  | legend 建议                      |
| --------------------- | -------------------------------- |
| 风格 A（单色）        | `visible: false`                 |
| 风格 B + 颜色编码分组 | `visible: true, position: "top"` |
| 风格 B + 仅装饰       | `visible: false`                 |

---

## 规则 5：background 必须营造信息图氛围

### 风格 A 的 background（强制使用主题背景图）

风格 A **必须**使用 `background.image`，且图片必须与数据主题强相关：

```json
{
  "background": {
    "image": "https://cdn.pixabay.com/photo/xxx/xxx_1280.jpg"
  }
}
```

| 数据主题      | 推荐 background.image 分类 | 推荐效果                   |
| ------------- | -------------------------- | -------------------------- |
| 全球贸易/地理 | 世界地图/区域地图          | 深色地图做底，圆形悬浮其上 |
| 能源/石油     | 油田/管道/工厂             | 深色工业场景               |
| 金融/股票     | 金融图表/城市天际线        | 高反差金融氛围             |
| 科技/互联网   | 电路板/数据中心            | 科技感深色背景             |
| 体育/赛事     | 运动场/球场                | 体育场氛围                 |
| 食品/农业     | 田野/市场                  | 暖色调自然场景             |

**关键要求**：

- 背景图应偏暗色调（或通过深色 `background.color` 叠加），确保圆形和文字清晰
- 背景图与圆形之间通过 `fillOpacity` 形成层次感（圆半透明，背景若隐若现）
- 图片从预置图片库的 `backgrounds.categories` 中选择

### 风格 B 的 background

可使用纯色或渐变，配合 brandImage 装饰：

```json
{
  "background": { "color": "#1e1b4b" }
}
```

### brandImage（两种风格均推荐）

```json
{
  "brandImage": {
    "visible": true,
    "url": "主题相关插图URL",
    "width": 200,
    "height": 200,
    "align": "right",
    "verticalAlign": "top",
    "asForeground": false
  }
}
```

---

## 规则 6：circle 圆形样式

### 风格 A 的 circle 配置

```json
{
  "circle": {
    "padding": 5,
    "strokeWidth": 2,
    "strokeColor": "rgba(255,255,255,0.3)",
    "fillOpacity": 0.8
  }
}
```

| 参数          | 推荐值                  | 说明                     |
| ------------- | ----------------------- | ------------------------ |
| `fillOpacity` | `0.75 ~ 0.85`           | 让背景图透出，形成层次感 |
| `strokeColor` | `rgba(255,255,255,0.3)` | 半透明白色描边，视觉柔和 |
| `strokeWidth` | `2 ~ 3`                 | 清晰分隔圆形             |
| `padding`     | `3 ~ 6`                 | 适度间距                 |

### 风格 B 的 circle 配置

```json
{
  "circle": {
    "padding": 5,
    "strokeWidth": 2,
    "strokeColor": "#ffffff"
  }
}
```

---

## 规则 7：单层模式 vs 分组模式选择

| 数据特征                  | 推荐模式 | groupField 配置 |
| ------------------------- | -------- | --------------- |
| 排名/Top N（如频道排行）  | 单层模式 | 不设置          |
| 百分比/占比（如商品份额） | 单层模式 | 不设置          |
| 有明确分类层级            | 分组模式 | 设为分类字段    |
| 数据量 > 15 且有自然分类  | 分组模式 | 按自然分类      |

注意：**风格 A 仅支持单层模式**，分组模式请使用风格 B。

---

## 规则 8：数据量与 rank 显示策略

| 数据量     | rank 显示建议 | 说明                 |
| ---------- | ------------- | -------------------- |
| ≤ 10 条    | rank 可选     | 风格 A 禁用 rank     |
| 10 ~ 20 条 | 推荐关闭      | 数值标签已传达信息   |
| > 20 条    | 推荐关闭      | 过多排名标签互相挤压 |

---

## 规则 9：title 必须有信息图层次感

信息图标题应该有**视觉冲击力**，而非仅仅是数据描述。

### 推荐配置

```json
{
  "title": {
    "text": "The Global Energy Bottleneck",
    "subtext": "A look at the share of global commodities passing through the Strait of Hormuz",
    "position": "center"
  }
}
```

### 标题撰写原则

| 原则          | 好的标题                                        | 差的标题                               |
| ------------- | ----------------------------------------------- | -------------------------------------- |
| 使用观点/洞察 | "The Global Energy Bottleneck"                  | "全球大宗商品流动份额"                 |
| 具体化        | "Strait of Hormuz Controls 38% of Global Crude" | "商品占比数据"                         |
| 简洁有力      | "Where the World's Oil Flows"                   | "各类商品通过霍尔木兹海峡的占比统计图" |

- 深色背景 → 浅色/白色标题
- 浅色背景 → 深色标题
- 推荐添加 `subtext` 作为副标题补充说明

---

## 规则 10：footnote 添加数据来源

信息图**必须**添加脚注标注数据来源，提升可信度。

```json
{
  "footnote": {
    "text": "Source: UN Trade and Development (UNCTAD), 2026"
  }
}
```

---

结合以上所有规则的两种典型 circlePacking 配置骨架：

### 风格 A 完整示例：突出数值风格（Magazine Style）— 全球大宗商品份额

```json
{
  "chartType": "circlePacking",
  "title": {
    "text": "The Global Energy Bottleneck",
    "subtext": "Share of global commodities passing through the Strait of Hormuz",
    "position": "center"
  },
  "data": [
    { "trade": "Crude oil", "share": 38 },
    { "trade": "Liquefied petroleum gas", "share": 29 },
    { "trade": "Liquefied natural gas", "share": 19 },
    { "trade": "Refined oil products", "share": 19 },
    { "trade": "Chemicals, including fertilizers", "share": 13 },
    { "trade": "Container", "share": 2.8 },
    { "trade": "Dry bulk, including grains", "share": 2.4 }
  ],
  "categoryField": "trade",
  "valueField": "share",
  "theme": "dark",
  "colors": ["#E11D48"],
  "legend": { "visible": false },
  "circle": {
    "padding": 5,
    "strokeWidth": 2,
    "strokeColor": "rgba(255,255,255,0.3)",
    "fillOpacity": 0.8
  },
  "label": {
    "visible": true,
    "layout": "prominent-value",
    "showPercent": true,
    "valueStyle": { "fill": "#ffffff", "fontWeight": "bold" },
    "nameStyle": { "fill": "rgba(255,255,255,0.9)" }
  },
  "rank": { "visible": false },
  "background": {
    "image": "预置图片库-energy或city分类-深蓝色地图/工业背景"
  },
  "brandImage": {
    "visible": true,
    "url": "预置图片库-illustrations-energy/business分类",
    "width": 180,
    "height": 180,
    "align": "right",
    "verticalAlign": "bottom",
    "asForeground": false
  },
  "footnote": {
    "text": "Source: UN Trade and Development (UNCTAD), based on Clarksons Research 2026"
  }
}
```

### 风格 B 完整示例：数据丰富风格 — YouTube 频道排行

```json
{
  "chartType": "circlePacking",
  "title": { "text": "Biggest Gaming YouTube Creators", "position": "center" },
  "data": [
    {
      "name": "Mikecrack",
      "subscribers": "57.7M",
      "value": 57.7,
      "country": "Spain",
      "bgKey": "Mikecrack"
    },
    {
      "name": "JuegaGerman",
      "subscribers": "54.6M",
      "value": 54.6,
      "country": "Chile",
      "bgKey": "JuegaGerman"
    }
  ],
  "categoryField": "name",
  "valueField": "value",
  "background": { "color": "#1e1b4b" },
  "theme": "dark",
  "colors": ["#2ecc71", "#e74c3c", "#3498db", "#f1c40f", "#9b59b6", "#e67e22", "#1abc9c"],
  "legend": { "visible": true, "position": "top" },
  "circle": { "padding": 5, "strokeWidth": 2, "strokeColor": "#ffffff" },
  "rank": { "visible": false },
  "icon": {
    "visible": true,
    "position": "top-left",
    "field": "country",
    "map": { "Spain": "...", "Chile": "..." }
  },
  "label": { "visible": true, "format": "{name}\n{value}", "showPercent": false },
  "circleBackground": {
    "visible": true,
    "field": "bgKey",
    "map": { "Mikecrack": "...", "JuegaGerman": "..." },
    "opacity": 0.3
  },
  "brandImage": {
    "visible": true,
    "url": "...",
    "width": 150,
    "height": 150,
    "align": "right",
    "verticalAlign": "top"
  },
  "footnote": { "text": "Source: Social Blade" }
}
```
