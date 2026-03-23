# Pie 饼图/环形图生成规则

> 生成或编辑 pie 饼图/环形图时，必须遵守以下规则。
> 参考信息图风格：环形图 + 主题中心图片 + 扇区品牌图标 + 名称与数值标签 + 装饰元素。

---

## 规则 1：必须使用环形图（donut），配合 centerImage

优秀的信息图饼图几乎都是**环形图**（donut chart），中心放置主题相关的图片来增强视觉效果和信息传达。**必须生成环形图 + centerImage**，即使用户未明确要求环形图或指定了 `innerRadius: 0`，也应默认使用环形图布局（`innerRadius: 0.55`）。

### 配置方式

```json
{
  "innerRadius": 0.55,
  "outerRadius": 0.85,
  "centerImage": {
    "visible": true,
    "url": "https://images.unsplash.com/vector-xxx",
    "width": 80,
    "height": 80
  }
}
```

### centerImage 选择策略

通过 **装饰插图子流程** (`references/workflows/subprocess-select-decoration.md`) 从预置装饰插图库 (`references/images/decorations.json`) 按 tags 语义匹配选择：

| 数据类型                      | centerImage 来源             | 说明                                                                |
| ----------------------------- | ---------------------------- | ------------------------------------------------------------------- |
| 行业/市场份额（航空、汽车等） | 从装饰插图库选择对应主题插图 | 如航空市场 → tags 含"商业""增长" 等                                 |
| 国家/地区数据                 | 从装饰插图库选择主题相关插图 | 如橄榄产量 → tags 含"农村""森林" 等                                 |
| 品牌/产品份额                 | 从装饰插图库选择行业相关插图 | 体现行业特征                                                        |
| 抽象数据（用户分布、预算等）  | 从装饰插图库选择通用插图     | 如用户分布 → tags 含"商业""数据" 等                                 |
| **无匹配主题**                | **生成内联 SVG 主题图标**    | 通过装饰插图子流程生成简化 SVG（→ subprocess-select-decoration.md） |

> ⚠️ **关键原则**：centerImage 必须与数据主题匹配。优先从装饰插图库选择精确匹配的插图；当插图库无匹配时，通过 **装饰插图子流程** 生成内联 SVG 主题图标作为 centerImage（如能源→油滴形状、地理→地球网格、金融→上升折线）。**禁止**使用"商业/增长/数据"等弱相关通用插图替代。

### innerRadius / outerRadius 推荐值

| 场景             | innerRadius | outerRadius | 说明                             |
| ---------------- | ----------- | ----------- | -------------------------------- |
| 带 centerImage   | `0.50~0.60` | `0.80~0.85` | 中心留够空间放图片               |
| centerImage 较大 | `0.55~0.65` | `0.80~0.85` | 图片较大时，内半径适当加大       |
| 无 centerImage   | `0.40~0.50` | `0.80`      | 纯环形装饰效果                   |
| 实心饼图（禁止） | `0`         | —           | 信息图风格不允许，必须使用环形图 |

### 注意事项

- centerImage 的 `width` 和 `height` 不能超过内圆直径，推荐为内圆直径的 60%~80%
- centerImage 仅在 `innerRadius > 0` 时才会渲染
- **centerImage 不可与 background.image 使用同一张图片**，应从预置图片库中分别选择
- 如预置图片库中没有匹配的图片，通过装饰插图子流程生成内联 SVG 主题图标（不可跳过 centerImage）

---

## 规则 2：为每个扇区配置语义化 icon

优秀的信息图饼图每个扇区都有对应的品牌 logo、国旗或语义图标，让用户快速识别每个分类。**必须生成 icon**（仅当 Icon 子流程判定为 C 类「语义不可区分」时才可跳过）。

### 配置方式

```json
{
  "icon": {
    "visible": true,
    "field": "iconKey",
    "map": {
      "IndiGo": "https://api.iconify.design/simple-icons/indigo.svg",
      "Air India": "https://api.iconify.design/mdi/airplane.svg"
    },
    "size": 24,
    "position": "inside"
  }
}
```

### icon 位置选择

| position       | 适用场景                         | 说明                        |
| -------------- | -------------------------------- | --------------------------- |
| `inside`       | 扇区较大（占比 > 10%）、数据量少 | icon 在扇区中心，最清晰     |
| `inside-outer` | 扇区较窄时                       | icon 靠近外侧边缘，避免拥挤 |
| `inside-inner` | 环形图、icon 靠近内环            | 适合内环附近展示            |
| `outside`      | 扇区很小或数据量多               | icon 在扇区外部，配合引导线 |

### icon 来源选择

| 数据类型               | icon 来源                                | 说明                                      |
| ---------------------- | ---------------------------------------- | ----------------------------------------- |
| 品牌/公司              | Iconify 搜索品牌 icon（如 simple-icons） | 如航空公司 logo、科技公司 logo            |
| 国家/地区              | Iconify 搜索国旗 icon（如 flag:xx）      | 如 `flag:es` 西班牙旗，`flag:it` 意大利旗 |
| 通用类目（食物、运动） | Iconify 搜索语义图标                     | 使用 fetch_icons.py 脚本批量获取          |
| 人物                   | 人物头像 URL                             | 直接使用头像图片                          |

### 注意事项

- icon 的 `field` 需要对应 data 中的某个字段
- 所有 icon URL 必须通过 `fetch_icons.py` 脚本获取，不得手写 Iconify URL
- 占比很小的扇区（< 3%），icon 可能不可见，可设 `visible: false` 或省略该项

---

## 规则 3：icon 与 label 位置不可重叠

饼图中 icon 和 label 共享扇区内外空间，必须合理分配位置避免重叠。

**icon position 可选值**：`inside` | `inside-inner` | `inside-outer` | `outside`
**label position 可选值**：`inside` | `outside` | `spider`

### 推荐搭配

| icon.position  | label.position | 说明                                            |
| -------------- | -------------- | ----------------------------------------------- |
| `inside`       | `outside`      | icon 在扇区内、label 在外部，最常用搭配         |
| `inside-outer` | `outside`      | icon 靠近扇区外侧、label 在外部                 |
| `inside-inner` | `outside`      | icon 靠近内环、label 在外部                     |
| `outside`      | `inside`       | icon 在外、label 在扇区内部（少用）             |
| `inside`       | `spider`       | icon 在扇区内、label 用蜘蛛线引出（数据量多时） |

### 禁止搭配

- `icon.position = inside` 且 `label.position = inside` — 二者都在扇区中心，必然重叠
- `icon.position = outside` 且 `label.position = outside` — 二者都在外部，文字和图标混乱

### 特殊情况

- 当 icon 较大 (`size >= 32`)，`label.position` 必须为 `outside` 或 `spider`，避免扇区内过于拥挤
- 当数据量 > 8 时，推荐 `label.position: 'spider'`，蜘蛛线布局避免标签重叠

---

## 规则 4：label 格式应包含名称和数值/百分比

参考优秀信息图风格，pie 的 label 应同时展示**类目名称**和**数值或百分比**。

### 推荐 format

```json
{
  "label": {
    "visible": true,
    "position": "outside",
    "format": "{name} {percent}"
  }
}
```

| 数据场景        | 推荐 format           | 效果示例               |
| --------------- | --------------------- | ---------------------- |
| 市场份额 / 占比 | `"{name} {percent}"`  | "IndiGo 65.2%"         |
| 产量/数量带单位 | `"{name}\n{value}"`   | "Spain\n8,137,810 t"   |
| 投资组合/持仓   | `"{name} {percent}"`  | "JPMorgan Chase 4.14%" |
| 通用            | `"{name}: {percent}"` | "产品A: 30%"           |

### label 样式建议

- **外部标签**（`outside` / `spider`）：与背景色形成对比，深色背景用白色文字，浅色背景用深色文字
- **内部标签**（`inside`）：推荐白色或浅色文字（扇区颜色通常较深）
- 当占比极小（< 2%）时，设置 `minVisible` 隐藏小扇区的标签，避免文字拥挤

### 注意事项

- `{percent}` 会自动计算并格式化为百分比（如 "65.2%"）
- 数据中已有格式化数值（如 "8,137,810 t"）时，用 `{value}` 直接引用
- 当数据有单位，优先在 data 中预格式化为带单位字符串，在 format 中用 `{value}` 引用

---

## 规则 5：数据量多时必须聚合为"其他"（Other）

当数据项较多时，过多的小扇区会导致饼图不可读。**必须将小项聚合为"其他"**。

### 聚合策略

| 数据量    | 聚合建议          | 说明                                  |
| --------- | ----------------- | ------------------------------------- |
| ≤ 5 项    | 无需聚合          | 每个扇区都足够大，清晰可读            |
| 6 ~ 8 项  | 可选聚合          | 如果有多个 < 3% 的小项，建议聚合      |
| 9 ~ 12 项 | 推荐聚合到 6~8 项 | 保留前 5~7 名，其余合并为"其他/Other" |
| > 12 项   | **必须聚合**      | 保留前 6~8 名，其余合并为"其他/Other" |

### "其他" 项的配置

```json
{
  "data": [
    { "name": "IndiGo", "value": 65.2, "iconKey": "IndiGo" },
    { "name": "Air India", "value": 27.2, "iconKey": "AirIndia" },
    { "name": "Akasa Air", "value": 5.0, "iconKey": "AkasaAir" },
    { "name": "SpiceJet", "value": 2.6, "iconKey": "SpiceJet" },
    { "name": "Other", "value": 5.0, "iconKey": "Other" }
  ]
}
```

### "其他" 项的样式

- 颜色使用灰色系（如 `#9AA3AD`、`#BDC3C7`），与主要数据项区分
- icon 可省略或使用通用图标（如 `mdi/dots-horizontal`）
- "其他" 应放在 data 数组的**最后一项**

### 投资组合等超大数据集

当数据量特别大（如 30+ 持仓）时：

- 保留前 10~15 名个体项
- 其余合并为 "Other xx.xx%" 并在 label 中注明合并的数量（如 "+51 holdings"）
- "其他" 的 format 可写为 `"Other {value}%"`

---

## 规则 6：颜色策略 — 主题优先，品牌色可覆盖

### 核心原则

遵守通用规则（`rules/general.md` 规则 4、5）：

1. **有匹配预设主题** → 只写 `theme`，不写 `colors` 和 `background.color`
2. **无匹配预设主题** → 手动配置 `colors` + `background`
3. **colors 数量** → 必须为 1 或 ≥ 数据项数量

### 颜色选择优先级（手动配色时）

| 优先级 | 策略                | 适用场景                               | 说明                                           |
| ------ | ------------------- | -------------------------------------- | ---------------------------------------------- |
| 1      | **品牌色**          | 数据项是品牌/公司/航空公司             | 如 IndiGo 蓝 `#0033A0`、Air India 红 `#E4002B` |
| 2      | **国家/地区代表色** | 数据项是国家                           | 参考国旗主色调                                 |
| 3      | **主题色系**        | 同一主题（如金融=金色系、自然=绿色系） | 使用同一色系的不同明度/饱和度                  |
| 4      | **预设调色板**      | 无特殊语义                             | 使用 theme 的默认色板                          |

### 配置方式

```json
{
  "colors": ["#0033A0", "#E4002B", "#6A1B9A", "#FF8F00", "#9AA3AD"]
}
```

### 注意事项

- 使用预设主题时，不需要手动配置 colors（主题已包含配色方案）
- 手动配色时，colors 数量必须为 1 或 ≥ 数据项数量（见 `rules/general.md` 规则 5）
- "其他/Other" 固定使用灰色系，与主要数据项区分
- 相邻扇区的颜色需有足够对比度，避免视觉混淆
- 深色背景下可使用更鲜艳的颜色，浅色背景下适当降低饱和度

---

## 规则 7：必须使用 background.image 增强视觉层次

饼图不支持 `brandImage`，视觉装饰主要靠 **background.image**（背景图片）和 **centerImage**（环形图中心图片）。**必须为饼图配置背景图片**，避免纯色背景导致画面单调。

### 决策流程

```
数据主题 → 执行 背景图片子流程（subprocess-select-background.md）
  ├─ 匹配到合适图片 → 配置 background.image + opacity
  ├─ 无精确匹配 → 选择中性纹理图（grey gradient、grey sky 等）
  └─ 保底 → 至少使用 background.color 设置非白色背景色
```

### background.image 示例

```json
{
  "background": {
    "image": "https://images.pexels.com/photos/2098427/pexels-photo-2098427.jpeg",
    "opacity": 0.15,
    "color": "#0D1B2A"
  }
}
```

### 背景搭配策略

| 数据主题      | 推荐 background.color | 推荐 images.json 搜索关键词         |
| ------------- | --------------------- | ----------------------------------- |
| 能源/石油     | 深色（`#0D1B2A`）     | `石油`、`深绿`、tags 含"煤""能源"   |
| 航空/交通     | 浅灰（`#f0f0f5`）     | `car`、`blue sea`、tags 含"天空"    |
| 食品/农业     | 浅色（`#f5f5f5`）     | `深绿`、`浅绿`、tags 含"植物""自然" |
| 金融/投资     | 深蓝（`#0D1B2A`）     | `深蓝`、tags 含"夜景""建筑"         |
| 科技/互联网   | 深紫（`#1a0a2e`）     | `紫色`、tags 含"科技""光线"         |
| 地理/国家数据 | 浅色（`#f0f0f5`）     | `grey gradient`、`blue sea`、纹理类 |
| 通用/抽象     | 中性（`#f0f0f5`）     | `grey gradient`、`grey sky`         |

### 注意事项

- 深色背景时，label 和 title 用白色/浅色文字；浅色背景时用深色文字
- 背景图片 opacity 必须遵循 `subprocess-select-background.md` 的色调匹配规则
- **background.image 不可与 centerImage 使用同一张图片**（不同图片库，通常不会冲突）
- 饼图的装饰层次：background.image（底层）+ centerImage（中心）+ icon（扇区），三者配合形成丰富视觉

---

## 规则 8：legend 配置策略

| 场景                               | legend 建议                      | 说明                            |
| ---------------------------------- | -------------------------------- | ------------------------------- |
| 数据量 ≤ 6，label 已展示名称       | `visible: false`                 | label 已传达信息，legend 多余   |
| 数据量 > 6，label 使用 spider 布局 | `visible: false`                 | spider 标签已包含名称，无需重复 |
| 颜色编码额外维度（行业分组）       | `visible: true`, position: `top` | 颜色含义需图例说明              |
| label 只显示百分比 / 不显示名称    | `visible: true`                  | 需要图例补充分类名称            |

### 通用建议

- **大多数信息图饼图不需要 legend**，因为 label 通常已经展示了名称和数值
- 如果开启 legend，推荐 `position: 'top'` 或 `position: 'bottom'`
- 避免 legend 和外部标签重叠（legend 放顶部、标签在饼图四周）

---

## 规则 9：title 和 footnote 配置

### title 推荐

信息图饼图的标题应**描述性强**、简洁有力。必须对用户提供的文字做信息图化处理：

**禁止**：

- 标题中包含图表类型名称（如「饼图」「环形图」「Pie Chart」）
- 直接照搬用户的原始描述文字作为标题
- 标题包含单位说明（单位放在 `subtext` 或 `footnote` 中）

**转换示例**：

| 用户原始描述                             | ❌ 错误标题                                | ✅ 正确标题                              |
| ---------------------------------------- | ------------------------------------------ | ---------------------------------------- |
| 2025年全球原油及液体燃料产量份额（饼图） | "2025年全球原油及液体燃料产量份额（饼图）" | "Global Crude Oil Production Share 2025" |
| 各地区 GDP 占比数据                      | "各地区 GDP 占比数据"                      | "Regional GDP Distribution"              |
| 航空公司国内市场份额统计                 | "航空公司国内市场份额统计"                 | "Indian Domestic Airline Market Leaders" |

**标题设计原则**：

- 简洁有力，突出数据的**核心洞察或主题**
- 数据含英文类目名时，优先使用英文标题增强国际化视觉效果
- 可使用 `subtext` 补充时间范围、数据口径等辅助信息

```json
{
  "title": {
    "text": "Global Crude Oil Production Share 2025",
    "subtext": "Share of Global Total (%)",
    "position": "center"
  }
}
```

| 风格        | 示例                                               | 适用场景               |
| ----------- | -------------------------------------------------- | ---------------------- |
| 主题 + 排名 | "Indian Domestic Airline Market Leaders"           | 市场份额、排名数据     |
| 主题 + 时间 | "Andreas Halvorsen's Q3 2025 Portfolio Allocation" | 时间序列数据、持仓快照 |
| 主题 + 维度 | "Global Olive Production by Country"               | 按维度分类的数据       |

### footnote 推荐

数据来源必须标注：

```json
{
  "footnote": {
    "text": "Source: Wikipedia, livemint",
    "layout": "left"
  }
}
```

- 有明确数据来源时，`footnote.text` 写明来源
- 数据来源有品牌/机构时，可添加 `footnote.image` 配合 logo

---

## 规则 10：扇区排序

数据项应按 **数值从大到小** 排序（最大的扇区在最前），"其他/Other" 放在最后。

### 排序规则

1. 主要数据项按 `valueField` **降序**排列
2. "Other/其他" 项始终在最后，无论其数值大小
3. 排序后的效果：最大扇区从 12 点钟方向（或 VChart 默认起始位置）开始，视觉上最突出

### 示例

```json
{
  "data": [
    { "name": "IndiGo", "value": 65.2 },
    { "name": "Air India", "value": 27.2 },
    { "name": "Akasa Air", "value": 5.0 },
    { "name": "SpiceJet", "value": 2.6 }
  ]
}
```

---

## 完整推荐配置参考

结合以上所有规则的三种典型 pie 配置骨架：

### 风格一：浅色主题 + 品牌市场份额（如航空市场）

```json
{
  "chartType": "pie",
  "title": { "text": "Indian Domestic Airline Market Leaders", "position": "center" },
  "data": [
    { "name": "IndiGo", "value": 65.2, "iconKey": "IndiGo" },
    { "name": "Air India", "value": 27.2, "iconKey": "AirIndia" },
    { "name": "Akasa Air", "value": 5.0, "iconKey": "AkasaAir" },
    { "name": "SpiceJet", "value": 2.6, "iconKey": "SpiceJet" }
  ],
  "categoryField": "name",
  "valueField": "value",
  "innerRadius": 0.55,
  "outerRadius": 0.85,
  "background": {
    "image": "https://images.pexels.com/photos/xxxxx/pexels-photo-xxxxx.jpeg",
    "opacity": 0.15,
    "color": "#f0f0f5"
  },
  "colors": ["#0033A0", "#E4002B", "#6A1B9A", "#FF8F00"],
  "legend": { "visible": false },
  "icon": {
    "visible": true,
    "field": "iconKey",
    "map": { "IndiGo": "...", "AirIndia": "..." },
    "size": 24,
    "position": "inside"
  },
  "label": { "visible": true, "position": "outside", "format": "{name} {percent}" },
  "centerImage": { "visible": true, "url": "airplane-image-url", "width": 80, "height": 80 },
  "footnote": { "text": "Source: Wikipedia, livemint" }
}
```

### 风格二：浅色主题 + 国家数据 + 国旗（如橄榄产量）

```json
{
  "chartType": "pie",
  "title": { "text": "Global Olive Production by Country", "position": "center" },
  "data": [
    { "name": "Spain", "value": 8137810, "displayValue": "8,137,810 t", "iconKey": "Spain" },
    { "name": "Greece", "value": 3051400, "displayValue": "3,051,400 t", "iconKey": "Greece" },
    { "name": "Italy", "value": 2207150, "displayValue": "2,207,150 t", "iconKey": "Italy" },
    {
      "name": "Other Countries",
      "value": 2169576,
      "displayValue": "2,169,576 t",
      "iconKey": "Other"
    }
  ],
  "categoryField": "name",
  "valueField": "value",
  "innerRadius": 0.5,
  "outerRadius": 0.85,
  "background": {
    "image": "https://images.pexels.com/photos/yyyyy/pexels-photo-yyyyy.jpeg",
    "opacity": 0.12,
    "color": "#f5f5f5"
  },
  "colors": ["#1a535c", "#4ecdc4", "#2a9d8f", "#264653", "#287271", "#3d5a80", "#9AA3AD"],
  "legend": { "visible": false },
  "icon": {
    "visible": true,
    "field": "iconKey",
    "map": { "Spain": "flag-es-url", "Greece": "flag-gr-url" },
    "size": 20,
    "position": "outside"
  },
  "label": { "visible": true, "position": "spider", "format": "{name}\n{value}" },
  "centerImage": { "visible": true, "url": "olive-image-url", "width": 100, "height": 100 },
  "footnote": { "text": "Source: Food and Agricultural Organization of the United Nations (2020)" }
}
```

### 风格三：深色主题 + 投资组合/大量数据项（如持仓分布）

```json
{
  "chartType": "pie",
  "title": { "text": "Andreas Halvorsen's Q3 2025 Portfolio Allocation", "position": "center" },
  "data": [
    { "name": "The PNC Financial Services", "value": 4.15, "iconKey": "PNC" },
    { "name": "JPMorgan Chase", "value": 4.14, "iconKey": "JPM" },
    { "name": "Charles Schwab", "value": 4.11, "iconKey": "SCHW" },
    { "name": "Capital One Financial", "value": 4.08, "iconKey": "COF" },
    { "name": "Microsoft", "value": 3.27, "iconKey": "MSFT" },
    { "name": "Other", "value": 33.92, "iconKey": "Other" }
  ],
  "categoryField": "name",
  "valueField": "value",
  "innerRadius": 0.45,
  "outerRadius": 0.85,
  "background": {
    "image": "https://images.pexels.com/photos/zzzzz/pexels-photo-zzzzz.jpeg",
    "opacity": 0.15,
    "color": "#0D1B2A"
  },
  "theme": "dark",
  "colors": [
    "#2ecc71",
    "#3498db",
    "#9b59b6",
    "#e74c3c",
    "#f1c40f",
    "#1abc9c",
    "#e67e22",
    "#2c3e50",
    "#95a5a6"
  ],
  "legend": { "visible": false },
  "icon": {
    "visible": true,
    "field": "iconKey",
    "map": { "PNC": "...", "JPM": "..." },
    "size": 20,
    "position": "inside"
  },
  "label": { "visible": true, "position": "outside", "format": "{name} {percent}" },
  "centerImage": { "visible": true, "url": "person-photo-url", "width": 90, "height": 90 },
  "footnote": { "text": "Source: 13Radar.com" }
}
```
