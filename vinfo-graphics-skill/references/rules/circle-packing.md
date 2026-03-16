# CirclePacking 圆形闭包图生成规则

> 生成或编辑 circlePacking 圆形闭包图时，必须遵守以下规则。
> 参考信息图风格：大面积圆形气泡 + 语义化背景/图标 + 名称与数值标签 + 主题色彩编码。

---

## 规则 1：尽量生成有含义的 circleBackground

圆形闭包图支持 `circleBackground` 为每个叶子节点设置背景图片，这是该图表的核心特色功能，**必须默认生成**。优秀的信息图圆形闭包图几乎都会为圆形设置头像、旗帜、产品图等视觉丰富的背景图。

### 配置方式

`circleBackground` 使用与 icon 类似的 field + map 结构：

```json
{
  "circleBackground": {
    "visible": true,
    "field": "bgKey",
    "map": {
      "手机": "https://cdn.pixabay.com/photo/xxx/xxx_1280.jpg",
      "电脑": "https://cdn.pixabay.com/photo/yyy/yyy_1280.jpg"
    },
    "opacity": 0.3
  }
}
```

### 图片来源选择

| 数据类型                     | 图片来源                              | 说明                                 |
| ---------------------------- | ------------------------------------- | ------------------------------------ |
| 人物/频道/博主               | 从预置图片库选择对应分类图片          | 从 general 或 sports 分类选择        |
| 国家/地区                    | 从预置图片库选择或使用国旗 icon       | 优先使用国旗 icon/图片，增强辨识度   |
| 具体实体（产品、城市、食物） | 从预置图片库对应分类选择              | 从 technology、nature、food 分类选择 |
| 品牌/公司                    | 从预置图片库 business 分类选择        | 体现品牌特色                         |
| 抽象类目（部门、季度）       | 从预置图片库 general 分类选择         | 使用抽象装饰图片                     |

### 注意事项

- `opacity` 推荐设置 `0.2` ~ `0.4`，避免背景图太亮影响标签可读性
- 如果背景图本身视觉较丰富（如人物头像），建议 `opacity: 0.25 ~ 0.35`
- data 中需要添加 `bgKey` 字段（或复用 categoryField 的值作为 map key）
- **circleBackground 中每个圆的图片必须与该数据项语义相关**（如 YouTube 频道 → 选择相关主题图片，而非通用图片）
- **circleBackground 中的图片不可与 background.image 重复**
- **不同圆之间的图片也不可重复**
- 如预置图片库中没有匹配的图片，可跳过 circleBackground 配置

---

## 规则 2：icon、label、rank 位置不可重叠

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

- `icon.position` 和 `rank.position` **不可相同**（如都是 `top-left`）
- `icon.position = center` 时 `rank.position` **不可**也设为 `center`（标签区域重叠）
- 如果 `icon.position = center`，label 会被推到下方，确保圆形足够大能容纳

### 有 circleBackground 时的额外注意

当同时使用 `circleBackground` 和 `icon` 时：

- icon 推荐使用 `top-left` 或 `top-right`，避免 `center` 与背景图中心内容冲突
- 调低 `circleBackground.opacity`（0.2~0.3），确保 icon 和 label 可见

---

## 规则 3：label 格式应包含名称和数值（带单位）

参考优秀信息图风格，circlePacking 的 label 应同时展示**类目名称**和**数值（带单位缩写）**，让用户一眼获取关键信息。

### 推荐 format

```json
{
  "label": {
    "visible": true,
    "format": "{name}\n{value}",
    "showPercent": false
  }
}
```

| 数据场景      | 推荐 format                      | 效果示例           |
| ------------- | -------------------------------- | ------------------ |
| 粉丝/订阅人数 | `"{name}\n{value}"`              | "Mikecrack\n57.7M" |
| 金额/财富     | `"{name}\n{value}"`              | "Monaco\n$12.4m"   |
| 占比数据      | `"{name}"` + `showPercent: true` | "产品A\n30%"       |
| 人口/数量     | `"{name}\n{value}"`              | "中国\n14.1亿"     |
| 通用          | `"{name}\n{value}"`              | "类目\n数值"       |

### 数值格式化要求

- **数据中的值应预先格式化为带单位的字符串**，例如 `"57.7M"`、`"$12.4m"`、`"3.5B"`
- 如果原始数据是纯数字（如 `57700000`），需要在 data 中添加一个格式化后的字段用于显示，或者直接在 data 的 valueField 中使用已格式化的字符串
- 当数值本身已包含单位时，`showPercent` 设为 `false`，避免重复显示

### 注意事项

- 优先使用 `{name}\n{value}` 格式，名称在上、数值在下
- 当 `circleBackground` 可见时，label 颜色应与背景图有足够对比度（推荐白色文字 + 深色描边或阴影效果）

---

## 规则 4：颜色编码策略 — 用色彩传达额外维度

优秀的圆形闭包图常常使用颜色来编码一个**额外维度**（如国家/地区、行业、类别），而非仅作装饰。

### 颜色编码场景

| 数据特征                      | 颜色策略                              | 说明                                          |
| ----------------------------- | ------------------------------------- | --------------------------------------------- |
| 数据有国家/地区属性           | 按国家/地区分配颜色，配合 legend 展示 | 如 YouTube 频道按国籍着色：西班牙=绿, 美国=蓝 |
| 数据有行业/类别属性           | 按行业着色，legend 展示类别           | 如加密货币按 Layer1/DeFi/Stablecoin 分组着色  |
| 数据有统一主题（如金融/黄金） | 使用统一主题色系                      | 如"进入最富1%所需财富"全部用金色系            |
| 数据无明显分组                | 使用主题相关的多色配色方案            | 让每个圆视觉上有区分即可                      |

### 配置方式

**方式一：通过 `colors` 数组直接指定**（适用于无分组维度或数据量较少时）

```json
{
  "colors": ["#e63946", "#457b9d", "#2a9d8f", "#e9c46a", "#f4a261"]
}
```

**方式二：通过 `groupField` + `colors` 编码分组**（适用于有明确分组维度时）

当数据有额外分组维度（如国家），在 data 中添加分组字段，并使用 `groupField`：

```json
{
  "groupField": "country",
  "colors": ["#2ecc71", "#e74c3c", "#3498db", "#f1c40f", "#9b59b6"],
  "legend": { "visible": true, "position": "top" }
}
```

### 注意事项

- 颜色数量应 ≥ 分组类别数，避免颜色复用导致混淆
- 使用 `legend` 展示颜色到类目的映射关系；若颜色仅为装饰，legend 可关闭
- 带 `circleBackground` 时，圆形填充色 + 背景图共同呈现，需确保颜色不遮挡背景图关键内容

---

## 规则 5：推荐使用 background 整体背景 + brandImage 装饰

优秀的信息图闭包图通常搭配**主题化背景**和**装饰元素**来提升视觉层次。

### background（整体背景）

```json
{
  "background": {
    "color": "#1e1b4b"
  }
}
```

或搭配预置图片库背景图：

```json
{
  "background": {
    "color": "#1e1b4b",
    "image": "https://cdn.pixabay.com/photo/xxx/xxx_1280.jpg"
  }
}
```

### brandImage（装饰图片）

从预置图片库的 illustrations 分类中选择装饰元素：

```json
{
  "brandImage": {
    "visible": true,
    "url": "https://pixabay.com/get/xxx_1280.png",
    "width": 200,
    "height": 200,
    "align": "right",
    "verticalAlign": "top",
    "asForeground": false
  }
}
```

### 背景搭配策略

| 数据主题      | 推荐 background        | 推荐 brandImage        |
| ------------- | ---------------------- | ---------------------- |
| 游戏/科技     | 深色渐变（深紫、深蓝） | 游戏手柄、电脑等装饰图 |
| 金融/财富     | 浅色/金色调            | 金币、世界地图等       |
| 体育/运动     | 深色 + 运动场馆图      | 奖杯、球类等           |
| 社交媒体/网红 | 主题色渐变             | 手机、相机等           |
| 地理/国家排名 | 浅色 + 世界地图轮廓    | 地球仪、指南针等       |
| 食品/美食     | 暖色调                 | 餐具、食材等           |

### 注意事项

- 深色背景时，label 和 title 推荐使用浅色/白色文字
- 浅色背景时，label 和 title 推荐使用深色文字
- brandImage 推荐 `asForeground: false` 放在背景层，不遮挡气泡

---

## 规则 6：单层模式 vs 分组模式选择

根据数据结构和设计目标选择合适的模式。

| 数据特征                                 | 推荐模式     | groupField 配置 | 说明                             |
| ---------------------------------------- | ------------ | --------------- | -------------------------------- |
| 排名/Top N 列表（如 Top 20 YouTube频道） | **单层模式** | 不设置          | 每个圆独立展示，大小直接反映数值 |
| 国家/地区数据排名（如各国财富门槛）      | **单层模式** | 不设置          | 单层 + 颜色编码国家，简洁直观    |
| 数据有明确分类层级（如按行业分组的公司） | **分组模式** | 设为分类字段    | 同组颜色一致，有层级感           |
| 数据量 > 15 且有自然分类                 | **分组模式** | 按自然分类      | 分组让大量数据更有结构           |
| 数据量 ≤ 15 且无明显分组                 | **单层模式** | 不设置          | 简洁直观，每个圆独立着色         |

### 单层模式特点

- 所有数据扁平展示，圆形大小直接反映 valueField
- 支持 rank 排名标签（可选）
- 支持 icon + circleBackground + label 完整配置
- **颜色可通过 `colors` 数组为每个圆分配不同颜色**

### 分组模式特点

- 数据按 `groupField` 聚合为嵌套结构
- 同组圆形颜色一致，不同组颜色不同
- **必须配合 `legend` 使用**，展示分组名称
- 子圆形共享父圆形空间，适合展示层级关系

---

## 规则 7：圆形样式推荐

### circle 配置推荐值

```json
{
  "circle": {
    "padding": 5,
    "strokeWidth": 2,
    "strokeColor": "#ffffff"
  }
}
```

| 参数          | 推荐值                | 说明                                                    |
| ------------- | --------------------- | ------------------------------------------------------- |
| `padding`     | `3` ~ `8`             | 圆形间距，太大浪费空间，太小圆形贴在一起                |
| `strokeWidth` | `1` ~ `3`             | 描边宽度，有 circleBackground 时推荐 2~3 增加边界清晰度 |
| `strokeColor` | `#fff` 或与背景对比色 | 深色背景用白色描边，浅色背景用深色或主题色描边          |

### 有 circleBackground 时的样式建议

- `strokeWidth` 适当加大（2~3），帮助圆形与背景分离
- 如果背景图色彩丰富，`strokeColor` 应有足够对比度
- `padding` 适当加大（5~8），避免带背景的圆形紧贴在一起

---

## 规则 8：数据量与 rank 显示策略

| 数据量         | rank 显示建议           | 说明                                          |
| -------------- | ----------------------- | --------------------------------------------- |
| ≤ 10 条        | rank 可选               | 数据量小，排名一目了然                        |
| 10 ~ 20 条     | 推荐关闭 rank           | 数值标签本身已传达大小信息，rank 增加视觉噪音 |
| > 20 条        | 推荐关闭 rank           | 过多排名标签互相挤压，降低可读性              |
| 需要强调排名时 | 开启 rank（仅单层模式） | 如"Top 10 排行榜"场景                         |

### 当关闭 rank 时

- 设置 `rank: { visible: false }` 或不配置 rank
- 通过 label 的 `{value}` 展示数值，让用户通过圆形大小 + 数值自行判断排名
- 信息图风格的 circlePacking 通常不需要显式排名编号

---

## 规则 9：legend 配置策略

| 场景                               | legend 建议                      | 说明             |
| ---------------------------------- | -------------------------------- | ---------------- |
| 颜色编码了额外维度（国家、行业等） | `visible: true`，position: `top` | 必须展示颜色含义 |
| 分组模式                           | `visible: true`，position: `top` | 展示各分组名称   |
| 颜色仅为装饰/区分，无额外语义      | `visible: false`                 | 不需要图例       |
| 统一主题色（如全部金色）           | `visible: false`                 | 颜色无分类含义   |

---

## 完整推荐配置参考

结合以上所有规则的两种典型 circlePacking 配置骨架：

### 风格一：深色主题 + 排名列表（如 YouTube 频道排行）

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

### 风格二：浅色/金色主题 + 统一风格（如财富/金融排名）

```json
{
  "chartType": "circlePacking",
  "title": { "text": "Wealth Needed to Be in the Richest 1%", "position": "center" },
  "data": [
    { "name": "Monaco", "wealth": "$12.4m", "value": 12.4, "bgKey": "Monaco" },
    { "name": "Switzerland", "wealth": "$6.6m", "value": 6.6, "bgKey": "Switzerland" }
  ],
  "categoryField": "name",
  "valueField": "value",
  "background": { "color": "#f5f0e1" },
  "theme": "light",
  "colors": ["#d4a017", "#c7923e", "#b8860b", "#daa520", "#cd950c"],
  "legend": { "visible": false },
  "circle": { "padding": 5, "strokeWidth": 2, "strokeColor": "#d4a017" },
  "rank": { "visible": false },
  "icon": {
    "visible": true,
    "position": "center",
    "field": "bgKey",
    "map": { "Monaco": "flag-url", "Switzerland": "flag-url" }
  },
  "label": { "visible": true, "format": "{name}\n{value}", "showPercent": false },
  "circleBackground": {
    "visible": true,
    "field": "bgKey",
    "map": { "Monaco": "...", "Switzerland": "..." },
    "opacity": 0.25
  },
  "brandImage": {
    "visible": true,
    "url": "world-map-url",
    "width": 600,
    "height": 400,
    "align": "center",
    "verticalAlign": "center",
    "asForeground": false
  },
  "footnote": { "text": "Source: Knight Frank Wealth Report (2023)" }
}
```
