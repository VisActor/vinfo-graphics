# 场景一处理流程：信息图生成

> **何时进入此流程**：用户希望从 0 到 1 创建新信息图。详细场景识别规则见 SKILL.md。

---

## 流程概览

信息图生成分为 **通用流程**（所有图表类型共享）和 **图表特有流程**：

```
┌─────────────────────────────────────────┐
│           通用流程（Common）              │
│  1. 解析用户数据                         │
│  2. 选择图表类型                         │
│  3. 读取类型定义（top-keys + type-details）│
│  4. 配置通用字段                         │
│     · title / footnote                   │
│     · width / height                     │
│     · background（→ 图片子流程）          │
│     · theme / colors                     │
│     · legend                             │
│  5. Icon 生成（→ Icon 子流程）            │
├─────────────────────────────────────────┤
│        图表特有流程（Chart-Specific）     │
│  6. 配置图表特有字段                     │
│     · 查阅 top-keys/{chartType}.json     │
│     · 查阅 type-details/{Component}.md   │
├─────────────────────────────────────────┤
│           输出流程（Output）              │
│  7. Schema 验证                          │
│  8. 输出可运行 HTML                      │
└─────────────────────────────────────────┘
```

---

## 通用流程

### 步骤 1：解析用户数据

**确认数据符合扁平数组规范**：

```javascript
// 正确格式：扁平数组
const data = [
  { name: '产品A', value: 30 },
  { name: '产品B', value: 25 },
  { name: '产品C', value: 45 },
];
```

**如果用户未提供数据**：

- 根据用户描述构造合理的 Mock 数据（至少 3-5 条记录）
- 确保字段名语义清晰
- 数据值合理（避免负数用于占比类图表）

---

### 步骤 2：选择图表类型

**参考下表根据用户需求推断图表类型**：

| 数据特征            | 可视化目的   | 推荐类型    | chartType       |
| ------------------- | ------------ | ----------- | --------------- |
| 类目 + 单个数值     | 占比分布     | 饼图/环形图 | `pie`           |
| 类目 + 单个数值     | 横向排名对比 | 条形图      | `bar`           |
| 类目 + 单个数值     | 纵向数值对比 | 柱状图      | `column`        |
| 时间序列 + 数值     | 趋势变化     | 面积图      | `area`          |
| 类目 + 权重（层级） | 层级占比     | 矩阵树图    | `treemap`       |
| 类目 + 权重（层级） | 层级关系     | 圆形闭包图  | `circlePacking` |

**图表类型选择指南**：

| 用户表述                       | 推荐选择              | 原因                       |
| ------------------------------ | --------------------- | -------------------------- |
| "市场份额"、"占比分布"         | `pie`                 | 饼图最适合展示占比         |
| "做成环形图"、"甜甜圈图"       | `pie` + `innerRadius` | 环形图是饼图的变体         |
| "排名"、"从大到小"、"横向柱子" | `bar`                 | 条形图适合展示排名         |
| "柱状图"、"纵向比较"           | `column`              | 柱状图适合纵向对比         |
| "趋势"、"变化"、"时间序列"     | `area`                | 面积图适合展示趋势         |
| "层级结构"、"嵌套"、"矩形块"   | `treemap`             | 矩形树图适合展示层级占比   |
| "气泡层级"、"圆形嵌套"         | `circlePacking`       | 圆形闭包图适合展示层级关系 |

---

### 步骤 3：读取图表类型定义

**使用 `references/top-keys/{chartType}.json` 获取该图表类型的所有可配置字段**：

```bash
# 例如 pie 图
references/top-keys/pie.json
```

每个字段包含：

- `name`：字段名
- `type`：TypeScript 类型
- `componentName`：对应的详细类型定义名称（如有）
- `description`：字段说明

**当需要了解某个字段的详细配置时，查阅对应的 type-details 文件**：

```bash
# 例如需要了解 TitleConfig 的详细结构
references/type-details/TitleConfig.md
```

---

### 步骤 4：配置通用字段

以下字段是所有图表类型共享的，来自 `BaseChartSchema`（见 `references/type-details/BaseChartSchema.md`）：

#### 4.1 标题 (title)

```json
{
  "title": {
    "text": "图表标题",
    "position": "center"
  }
}
```

详细配置见 `references/type-details/TitleConfig.md`。

#### 4.2 脚注 (footnote)

```json
{
  "footnote": {
    "text": "数据来源：xxx",
    "layout": "left"
  }
}
```

详细配置见 `references/type-details/FootnoteConfig.md`。

#### 4.3 尺寸 (width / height)

```json
{
  "width": 800,
  "height": 600
}
```

default 推荐：`800 x 600`。竖版信息图可用 `600 x 800` 或 `400 x 700`。

#### 4.4 背景 (background)

如需背景图 → 执行 **图片子流程** (`references/workflows/subprocess-image.md`)，从预置图片库选择

```json
{
  "background": {
    "image": "https://cdn.pixabay.com/photo/xxx/xxx_1280.jpg"
  }
}
```

详细配置见 `references/type-details/BackgroundConfig.md`。

#### 4.5 主题 (theme) / 颜色 (colors)

```json
{
  "theme": "fresh",
  "colors": ["#3370eb", "#1bcebf", "#ffc60a"]
}
```

详细配置见 `references/type-details/ThemeConfig.md`。

#### 4.6 图例 (legend)

```json
{
  "legend": {
    "visible": true,
    "position": "right"
  }
}
```

详细配置见 `references/type-details/LegendConfig.md`。

---

### 步骤 5：Icon 生成（必选子流程）

> 🚨 **强制要求**：必须在终端中实际执行 `scripts/fetch_icons.py` 脚本获取图标。
> **禁止**：手动拼接 Iconify URL、凭记忆猜测图标名称、跳过脚本调用。

**Icon 是信息图的核心特色，每个图表都必须配置 Icon。**

执行 **Icon 子流程** (`references/workflows/subprocess-icon-generation.md`)：

1. 提取 categoryField 对应的类目值
2. **识别语义类型**（国家→国旗、品牌→品牌图标、通用类目→主题图标）
3. **在终端执行** `scripts/fetch_icons.py` 获取统一风格图标
4. 将脚本输出的 icon map 直接写入 schema

---

## 图表特有流程

### 步骤 6：配置图表特有字段

每种图表类型有独特的配置项。**先查阅 `references/top-keys/{chartType}.json`** 了解所有可用字段，再按需查阅 `references/type-details/{ComponentName}.md` 获取详细定义。

> 🚨 **必须读取规则文件**：配置特有字段前，先阅读 `references/rules/general.md`（通用规则）和 `references/rules/{chartType}.md`（如存在），按规则调整字段配置，确保元素位置不冲突。

#### Pie 饼图 / 环形图

| 特有字段      | 类型                 | 说明                    |
| ------------- | -------------------- | ----------------------- |
| `innerRadius` | number (0-1)         | 内半径比例，>0 为环形图 |
| `outerRadius` | number (0-1)         | 外半径比例，默认 0.8    |
| `label`       | PieLabelConfig       | 扇区标签                |
| `centerImage` | PieCenterImageConfig | 环形图中心图片          |

#### Bar 条形图

| 特有字段 | 类型            | 说明                     |
| -------- | --------------- | ------------------------ |
| `sort`   | 'asc' \| 'desc' | 排序方式                 |
| `bar`    | BarStyleConfig  | 条形样式（圆角、渐变等） |
| `rank`   | BarRankConfig   | 排名标签                 |
| `label`  | BarLabelConfig  | 数值标签                 |

#### Column 柱状图

| 特有字段     | 类型                   | 说明                     |
| ------------ | ---------------------- | ------------------------ |
| `sort`       | 'asc' \| 'desc'        | 排序方式                 |
| `column`     | ColumnStyleConfig      | 柱子样式（圆角、渐变等） |
| `label`      | ColumnLabelConfig      | 数值标签                 |
| `brandImage` | ColumnBrandImageConfig | 品牌图片                 |

#### Area 面积图

| 特有字段                   | 类型                           | 说明       |
| -------------------------- | ------------------------------ | ---------- |
| `area`                     | AreaStyleConfig                | 面积样式   |
| `line`                     | AreaLineConfig                 | 线条样式   |
| `point`                    | AreaPointConfig                | 数据点样式 |
| `annotationPoint`          | AnnotationPointConfig          | 标注点     |
| `annotationArea`           | AnnotationAreaConfig           | 标注区域   |
| `annotationVerticalLine`   | AnnotationVerticalLineConfig   | 垂直标注线 |
| `annotationHorizontalLine` | AnnotationHorizontalLineConfig | 水平标注线 |

#### Treemap 矩阵树图

| 特有字段     | 类型               | 说明       |
| ------------ | ------------------ | ---------- |
| `groupField` | string             | 分组字段名 |
| `node`       | TreemapNodeConfig  | 节点配置   |
| `rank`       | TreemapRankConfig  | 排名标签   |
| `label`      | TreemapLabelConfig | 标签配置   |

#### CirclePacking 圆形闭包图

| 特有字段     | 类型                      | 说明       |
| ------------ | ------------------------- | ---------- |
| `groupField` | string                    | 分组字段名 |
| `circle`     | CirclePackingCircleConfig | 圆形配置   |
| `rank`       | CirclePackingRankConfig   | 排名标签   |
| `label`      | CirclePackingLabelConfig  | 标签配置   |

> 以上 ComponentName 都可在 `references/type-details/{ComponentName}.md` 中查阅完整的 TypeScript 类型定义。

---

## 输出流程

### 步骤 7：Schema 验证

**自查清单**：

| 检查项             | 要求                                                          |
| ------------------ | ------------------------------------------------------------- |
| chartType          | 必须是支持的图表类型字符串                                    |
| data               | 必须是非空数组                                                |
| categoryField      | 必须与 data 中的字段名完全一致                                |
| valueField         | 必须与 data 中的字段名完全一致                                |
| icon.field         | 必须是 data 中存在的字段名                                    |
| icon.map           | 每个 map key 必须与 data 中 icon.field 对应的值匹配           |
| icon 语义匹配      | 图标必须与每个类目的语义对应（国家→国旗，品牌→品牌图标）      |
| icon.position      | 必须是该图表类型支持的 position 值                            |
| title              | 必须是 TitleConfig 对象（不支持纯字符串）                     |
| legend             | 必须是 LegendConfig 对象（不支持 boolean）                    |
| theme              | 必须是 PresetThemeName 字符串（自定义配置用 customizedTheme） |
| groupField（如有） | 必须与 data 中的字段名完全一致                                |
| innerRadius        | 0-1 之间的数值                                                |
| colors             | 颜色数组，每项为有效的颜色字符串                              |

---

### 步骤 8：输出可运行 HTML

> 🚨 **必须执行**：调用 `scripts/generate_demo_html.py` 脚本生成 HTML 文件。禁止手动拼接 HTML 页面。

```bash
python <SKILL_DIR>/scripts/generate_demo_html.py \
  --template <SKILL_DIR>/assets/template/demo.html \
  --title "[标题]" \
  --schema '[完整 schema JSON]' \
  --output "[文件名].html"
```

**标准输出格式**：

```markdown
## 生成结果

**图表类型**：[chartType]
**数据记录数**：[data.length] 条
**Icon 配置**：已为 [数据项数] 个类目配置语义化图标（图标集：[collection]）

已生成 HTML 文件：[文件名].html
```

---

## 完整示例

**用户输入**："帮我生成一个饼图，展示三个产品的市场份额：产品A 30%，产品B 25%，产品C 45%"

**处理过程**：

1. **解析数据** → `[{name: "产品A", value: 30}, ...]`
2. **选择图表** → `pie`
3. **读取定义** → `references/top-keys/pie.json`，确认支持的字段和 icon position
4. **配置通用字段** → title, theme
5. **Icon 子流程** → 执行 `subprocess-icon-generation.md`
   - 提取类目：["产品A", "产品B", "产品C"]
   - **在终端执行**：`python <SKILL_DIR>/scripts/fetch_icons.py --categories '["产品A","产品B","产品C"]' --keywords '["product","box","package"]'`
   - 获取统一风格图标（同一图标集）
6. **图表特有字段** → 查阅 `type-details/PieLabelConfig.md` 等
7. **验证** → 自查清单通过
8. **在终端执行**：`python <SKILL_DIR>/scripts/generate_demo_html.py --template <SKILL_DIR>/assets/template/demo.html --title "市场份额" --schema '[schema JSON]' --output "market-share.html"`

**最终 Schema**：

```json
{
  "chartType": "pie",
  "title": { "text": "市场份额", "position": "center" },
  "data": [
    { "name": "产品A", "value": 30, "iconKey": "产品A" },
    { "name": "产品B", "value": 25, "iconKey": "产品B" },
    { "name": "产品C", "value": 45, "iconKey": "产品C" }
  ],
  "categoryField": "name",
  "valueField": "value",
  "icon": {
    "field": "iconKey",
    "map": {
      "产品A": "https://api.iconify.design/mdi/package.svg",
      "产品B": "https://api.iconify.design/mdi/shopping.svg",
      "产品C": "https://api.iconify.design/mdi/cube.svg"
    },
    "visible": true,
    "position": "outside",
    "size": 24
  },
  "theme": "fresh"
}
```
