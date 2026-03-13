# Pie 饼图/环形图生成规则

> 生成或编辑 pie 饼图/环形图时，必须遵守以下规则。
> 参考信息图风格：环形图 + 主题中心图片 + 扇区品牌图标 + 名称与数值标签 + 装饰元素。

---

## 规则 1：优先使用环形图（donut），配合 centerImage

优秀的信息图饼图几乎都是**环形图**（donut chart），中心放置主题相关的图片来增强视觉效果和信息传达。**默认必须生成环形图 + centerImage**。

### 配置方式

```json
{
  "innerRadius": 0.55,
  "outerRadius": 0.85,
  "centerImage": {
    "visible": true,
    "url": "https://images.unsplash.com/photo-xxx?w=300&h=300&fit=crop",
    "width": 80,
    "height": 80
  }
}
```

### centerImage 选择策略

| 数据类型                      | centerImage 来源            | 说明                                         |
| ----------------------------- | --------------------------- | -------------------------------------------- |
| 行业/市场份额（航空、汽车等） | Unsplash 搜索行业代表物品   | 如航空市场 → 飞机图片，汽车市场 → 汽车图片   |
| 国家/地区数据                 | Unsplash 搜索相关物品或地图 | 如橄榄产量 → 橄榄图片，咖啡产量 → 咖啡豆图片 |
| 人物投资组合/持仓             | 人物头像照片                | 如基金经理的头像                             |
| 品牌/产品份额                 | 行业相关图片或品牌 logo     | 体现行业特征                                 |
| 抽象数据（用户分布、预算等）  | 主题图标或 Unsplash 图片    | 如用户分布 → 人群图片                        |

### innerRadius / outerRadius 推荐值

| 场景                   | innerRadius | outerRadius | 说明                           |
| ---------------------- | ----------- | ----------- | ------------------------------ |
| 带 centerImage         | `0.50~0.60` | `0.80~0.85` | 中心留够空间放图片             |
| centerImage 较大       | `0.55~0.65` | `0.80~0.85` | 图片较大时，内半径适当加大     |
| 无 centerImage         | `0.40~0.50` | `0.80`      | 纯环形装饰效果                 |
| 想要实心饼图（不推荐） | `0`         | `0.80`      | 信息图风格不推荐，缺少视觉层次 |

### 注意事项

- centerImage 的 `width` 和 `height` 不能超过内圆直径，推荐为内圆直径的 60%~80%
- 当 centerImage 是 Unsplash 图片时，使用 `?w=300&h=300&fit=crop` 裁剪为正方形
- centerImage 仅在 `innerRadius > 0` 时才会渲染

---

## 规则 2：为每个扇区配置语义化 icon

优秀的信息图饼图每个扇区都有对应的品牌 logo、国旗或语义图标，让用户快速识别每个分类。**推荐默认生成 icon**。

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

## 规则 6：颜色策略 — 品牌色优先，主题色兜底

### 颜色选择优先级

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

- 颜色数量 ≥ 数据项数量，避免颜色复用
- "其他/Other" 固定使用灰色系，与主要数据项区分
- 相邻扇区的颜色需有足够对比度，避免视觉混淆
- 深色背景下可使用更鲜艳的颜色，浅色背景下适当降低饱和度

---

## 规则 7：推荐使用 background + brandImage 装饰

优秀的信息图饼图通常搭配主题化背景和装饰元素来提升视觉吸引力。

### background（整体背景）

```json
{
  "background": {
    "color": "#0D1B2A"
  }
}
```

### brandImage（装饰图片）

加入与数据主题相关的装饰元素：

```json
{
  "brandImage": {
    "visible": true,
    "url": "https://images.unsplash.com/photo-xxx?w=400&h=400&fit=crop",
    "width": 200,
    "height": 200,
    "align": "right",
    "verticalAlign": "bottom",
    "asForeground": false
  }
}
```

### 背景搭配策略

| 数据主题      | 推荐 background        | 推荐 brandImage          |
| ------------- | ---------------------- | ------------------------ |
| 航空/交通     | 浅灰/白色 + 云朵纹理   | 飞机、机场等装饰图       |
| 食品/农业     | 浅色纹理背景           | 农作物、食材等           |
| 金融/投资     | 深色（深蓝、深灰）     | 硬币、图表、城市天际线等 |
| 科技/互联网   | 深色渐变（深蓝、深紫） | 设备、代码等             |
| 地理/国家数据 | 浅色 + 世界地图轮廓    | 地球仪、指南针等         |

### 注意事项

- 深色背景时，label 和 title 用白色/浅色文字；浅色背景时用深色文字
- brandImage 推荐 `asForeground: false`，放在背景层不遮挡图表
- brandImage 可与 centerImage 呼应，形成统一的视觉主题
- 避免 brandImage 与环形图重叠太多，推荐放在角落或留白区域

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

信息图饼图的标题应**描述性强**、包含关键信息：

```json
{
  "title": {
    "text": "Indian Domestic Airline Market Leaders",
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
  "background": { "color": "#f0f0f5" },
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
  "brandImage": {
    "visible": true,
    "url": "cloud-decoration-url",
    "width": 200,
    "height": 150,
    "align": "right",
    "verticalAlign": "bottom",
    "asForeground": false
  },
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
  "background": { "color": "#f5f5f5" },
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
  "background": { "color": "#0D1B2A" },
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
