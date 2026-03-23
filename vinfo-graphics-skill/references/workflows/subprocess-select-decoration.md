# 装饰插图选择子流程

> **何时使用**：需要为信息图配置装饰插图时——包括 area/bar/column 的 `brandImage.url`、pie 的 `centerImage.url`。
> **图片来源**：预置装饰插图库 (`references/images/decorations.json`) 或内联生成 SVG。
> **核心原则**：通过 `tags` 语义匹配数据主题，选择与内容相关的矢量插图；无匹配时可生成 SVG 装饰图。

---

## 图片库结构

`references/images/decorations.json` 是一个扁平数组，每个条目包含：

| 字段   | 类型     | 说明                                                        |
| ------ | -------- | ----------------------------------------------------------- |
| `url`  | string   | Unsplash 矢量插图 URL（**不含尺寸参数，使用时必须追加**）   |
| `tags` | string[] | 语义标签，用于匹配数据主题（如 `["工作", "女性", "电脑"]`） |

---

## 选择流程

### 步骤 1：读取插图库

读取 `references/images/decorations.json`，获取完整的插图列表。

### 步骤 2：根据数据主题匹配 tags

按 `tags` 数组与数据主题的相关性选择最匹配的插图：

| 数据/用户意图    | 推荐匹配 tags                            |
| ---------------- | ---------------------------------------- |
| 金融、投资、理财 | `金币`, `股票`, `信用卡`, `商业`         |
| 科技、AI、互联网 | `机器人`, `AI`, `科技`, `VR`, `虚拟现实` |
| 教育、学习、培训 | `学习`, `男孩`, `桌椅`                   |
| 工作、商务、办公 | `工作`, `女性`, `商业`, `增长`, `数据`   |
| 娱乐、游戏       | `游戏`, `开心`, `电脑`                   |
| 体育、运动、健身 | `运动`, `跑步`, `足球`                   |
| 家庭、生活       | `家庭`, `couple`                         |
| 动物、宠物       | `动物`, `爪子`, `可爱`                   |
| 城市、建筑、房产 | `建筑`, `城市`, `高楼`                   |
| 自然、农业、环保 | `农村`, `树木`, `森林`, `绿色`           |
| 通信、手机、社交 | `手机`, `时间`, `通信`                   |
| 时间管理、效率   | `时钟`, `time`                           |
| 人物、个人       | `man`, `couple`                          |

### 步骤 3：去重校验

| 检查项                                            | 操作                             |
| ------------------------------------------------- | -------------------------------- |
| `brandImage.url` 与 `centerImage.url` 使用同一张  | 替换其中一个                     |
| `brandImage.url` 与 `background.image` 使用同一张 | 无需检查（不同图片库，不会重复） |

### 步骤 4：追加尺寸参数并集成到 Schema

#### brandImage 示例（bar/column/area）

```json
{
  "brandImage": {
    "visible": true,
    "url": "https://images.unsplash.com/vector-1769600501923-924c765e35fd",
    "width": 200,
    "height": 200,
    "align": "right",
    "verticalAlign": "bottom",
    "asForeground": false
  }
}
```

#### centerImage 示例（pie 环形图）

```json
{
  "centerImage": {
    "visible": true,
    "url": "https://images.unsplash.com/vector-1772002388669-31a6f0205c01",
    "width": 80,
    "height": 80
  }
}
```

---

## 无匹配时的回退策略：生成内联 SVG

当数据主题在插图库中找不到精确匹配时，可以**生成内联 SVG 装饰图**作为 `brandImage.url`，以 `data:image/svg+xml` URI 格式嵌入。

### 回退决策流程

```
数据主题 → 扫描插图库的 tags
  ├─ 找到精确匹配 → 使用该插图
  ├─ 无匹配 → brandImage: 生成内联 SVG（见下方「SVG 生成规范」）
  │           centerImage: 生成简化内联 SVG 主题图标（见下方「centerImage SVG 生成」）
  └─ 保底规则：background 与 brandImage/centerImage 不可同时缺失
```

### SVG 生成规范

生成的 SVG 用作 `brandImage.url`，需满足以下约束：

**尺寸与格式**：

- 画布尺寸：`200×200`（正方形，与 brandImage.width/height 匹配）
- 输出格式：`data:image/svg+xml,` + URL 编码的 SVG 字符串
- 不使用 base64 编码（URL 编码更短、可读）

**风格约束**：

- **抽象几何风格**：使用几何形状（圆、矩形、线条、多边形）组合，不要尝试画写实图形
- **配色来源**：从当前 schema 的 `colors` 或 `theme` 色板中取色，确保与图表视觉统一
- **低透明度叠加**：形状使用 `opacity="0.15"` ~ `opacity="0.4"`，因为 brandImage 是装饰层不应喧宾夺主
- **语义关联**：图案应与数据主题有抽象关联（如金融→上升箭头+圆点；健康→十字+脉搏线；地理→经纬网格）

**禁止**：

- 含文字的 SVG（文字由图表 title/label 负责）
- 超过 2KB 的 SVG（避免 data URI 过长）
- 使用外部引用（`<image href="...">`、`<use>`）

### SVG 模板示例

**金融/增长主题**：

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <circle cx="150" cy="50" r="40" fill="#3370eb" opacity="0.2"/>
  <circle cx="60" cy="140" r="30" fill="#1bcebf" opacity="0.15"/>
  <polyline points="20,160 60,120 100,140 140,80 180,40" fill="none" stroke="#3370eb" stroke-width="3" opacity="0.3"/>
  <polygon points="180,40 180,55 165,40" fill="#3370eb" opacity="0.3"/>
</svg>
```

**健康/医疗主题**：

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect x="85" y="40" width="30" height="80" rx="4" fill="#22C55E" opacity="0.2"/>
  <rect x="60" y="65" width="80" height="30" rx="4" fill="#22C55E" opacity="0.2"/>
  <polyline points="20,160 50,160 60,130 80,170 100,140 120,160 200,160" fill="none" stroke="#22C55E" stroke-width="2.5" opacity="0.3"/>
</svg>
```

**地理/国家主题**：

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <circle cx="100" cy="100" r="80" fill="none" stroke="#6366F1" stroke-width="1.5" opacity="0.2"/>
  <ellipse cx="100" cy="100" rx="40" ry="80" fill="none" stroke="#6366F1" stroke-width="1" opacity="0.15"/>
  <line x1="20" y1="100" x2="180" y2="100" stroke="#6366F1" stroke-width="1" opacity="0.15"/>
  <line x1="100" y1="20" x2="100" y2="180" stroke="#6366F1" stroke-width="1" opacity="0.15"/>
  <circle cx="100" cy="100" r="3" fill="#6366F1" opacity="0.3"/>
</svg>
```

### 集成到 Schema

将 SVG 编码为 data URI 后，直接填入 `brandImage.url`：

```json
{
  "brandImage": {
    "visible": true,
    "url": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' width='200' height='200'%3E%3Ccircle cx='150' cy='50' r='40' fill='%233370eb' opacity='0.2'/%3E%3Ccircle cx='60' cy='140' r='30' fill='%231bcebf' opacity='0.15'/%3E%3Cpolyline points='20,160 60,120 100,140 140,80 180,40' fill='none' stroke='%233370eb' stroke-width='3' opacity='0.3'/%3E%3C/svg%3E",
    "width": 200,
    "height": 200,
    "align": "right",
    "verticalAlign": "bottom",
    "asForeground": false
  }
}
```

> **URL 编码要点**：`<` → `%3C`，`>` → `%3E`，`#` → `%23`，`"` → `'`（SVG 内部统一用单引号避免编码）

---

## centerImage SVG 生成

当 pie 环形图的 centerImage 在插图库中无匹配时，生成**简化的内联 SVG 主题图标**作为 `centerImage.url`。

### 与 brandImage SVG 的区别

| 属性     | brandImage SVG        | centerImage SVG           |
| -------- | --------------------- | ------------------------- |
| 画布尺寸 | `200×200`             | `100×100`                 |
| 风格     | 抽象几何组合          | **单一主题图标**          |
| 复杂度   | 多个形状叠加          | 1~3 个形状，极简          |
| 透明度   | `0.15~0.4`（装饰层）  | `0.6~1.0`（作为焦点图片） |
| 配色     | 从 schema colors 取色 | 从 schema colors 取主色   |

### centerImage SVG 模板示例

**能源/石油**（油滴）：

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <path d="M50 10 C50 10 20 50 20 65 A30 30 0 1 0 80 65 C80 50 50 10 50 10Z" fill="#4CAF50" opacity="0.8"/>
</svg>
```

**地理/全球**（地球网格）：

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="40" fill="none" stroke="#3370eb" stroke-width="2" opacity="0.7"/>
  <ellipse cx="50" cy="50" rx="20" ry="40" fill="none" stroke="#3370eb" stroke-width="1.5" opacity="0.5"/>
  <line x1="10" y1="50" x2="90" y2="50" stroke="#3370eb" stroke-width="1" opacity="0.4"/>
</svg>
```

**金融/投资**（上升趋势线）：

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <polyline points="15,75 35,55 55,65 75,30 85,25" fill="none" stroke="#3370eb" stroke-width="3" opacity="0.8"/>
  <polygon points="85,25 85,35 75,25" fill="#3370eb" opacity="0.8"/>
</svg>
```

**科技/AI**（电路节点）：

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="12" fill="#6366F1" opacity="0.8"/>
  <circle cx="20" cy="30" r="5" fill="#6366F1" opacity="0.5"/>
  <circle cx="80" cy="30" r="5" fill="#6366F1" opacity="0.5"/>
  <circle cx="20" cy="70" r="5" fill="#6366F1" opacity="0.5"/>
  <circle cx="80" cy="70" r="5" fill="#6366F1" opacity="0.5"/>
  <line x1="50" y1="50" x2="20" y2="30" stroke="#6366F1" stroke-width="1.5" opacity="0.4"/>
  <line x1="50" y1="50" x2="80" y2="30" stroke="#6366F1" stroke-width="1.5" opacity="0.4"/>
  <line x1="50" y1="50" x2="20" y2="70" stroke="#6366F1" stroke-width="1.5" opacity="0.4"/>
  <line x1="50" y1="50" x2="80" y2="70" stroke="#6366F1" stroke-width="1.5" opacity="0.4"/>
</svg>
```

### 集成到 Schema

```json
{
  "centerImage": {
    "visible": true,
    "url": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'%3E%3Cpath d='M50 10 C50 10 20 50 20 65 A30 30 0 1 0 80 65 C80 50 50 10 50 10Z' fill='%234CAF50' opacity='0.8'/%3E%3C/svg%3E",
    "width": 80,
    "height": 80
  }
}
```

> centerImage SVG 同样遵循 URL 编码规则：`<` → `%3C`，`>` → `%3E`，`#` → `%23`，内部用单引号。

---

## 重要约束

- **`brandImage` 要么显示，要么不写**：想显示时写 `brandImage` 对象（`visible` 默认 `true`）；不想显示时**直接省略整个 `brandImage` 字段**
- **严禁** `{ "brandImage": { "visible": false, ... } }` — 不显示就不要写此字段
- 装饰插图来自 `decorations.json`，背景图片来自 `images.json`，两个库互不混用
