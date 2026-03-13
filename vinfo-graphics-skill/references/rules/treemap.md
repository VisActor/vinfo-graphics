# Treemap 矩阵树图生成规则

> 生成或编辑 treemap 矩阵树图时，必须遵守以下规则。
> 参考信息图风格：大面积色块 + 排名编号 + 语义化 icon + 节点背景图。

---

## 规则 1：推荐生成 nodeBackground 节点背景图

矩阵树图的 `nodeBackground` 是核心特色功能，能大幅提升视觉冲击力。**推荐默认为至少前 1~3 名的节点配置背景图**。

### 配置方式

`nodeBackground` 使用 field + map 结构，为每个类目映射一张背景图：

```json
{
  "nodeBackground": {
    "visible": true,
    "field": "bgKey",
    "map": {
      "Bitcoin": "https://images.unsplash.com/photo-xxx?w=600&h=400&fit=crop",
      "Ethereum": "https://images.unsplash.com/photo-yyy?w=600&h=400&fit=crop"
    },
    "opacity": 0.3
  }
}
```

### 图片选择策略

| 数据类型                | 背景图来源                    | 说明                                      |
| ----------------------- | ----------------------------- | ----------------------------------------- |
| 品牌/产品（如加密货币） | Unsplash 搜索品牌相关图片     | 如 Bitcoin → 搜 "bitcoin"，获取币种相关图 |
| 人物/组织（如裁员原因） | Unsplash 搜索相关人物或场景图 | 如 DOGE → 搜 "government building"        |
| 具体实体（城市、食物）  | Unsplash 按类目搜索实物图     | 每个类目搜索对应图片                      |
| 抽象类目（部门、类型）  | Unsplash 按主题搜索           | 使用同一主题的不同图片                    |

### 注意事项

- `opacity` 推荐 `0.2` ~ `0.4`，大节点可适当高一些（0.3~0.5），小节点调低或不设背景
- 不必为所有节点都设置背景图 — **前 3~5 个大节点设置即可**，小节点背景图缩得太小反而影响观感
- data 中需要添加 `bgKey` 字段（或直接复用 categoryField 的值作为 map key）
- 图片 URL 使用 Unsplash 的 `?w=600&h=400&fit=crop` 参数，确保合适的分辨率

---

## 规则 2：rank、icon、label 位置不可重叠

矩阵树图节点内空间有限，rank、icon、label 三者的位置必须错开。

**icon position 可选值**：`top-left` | `top-right` | `center` | `bottom-left` | `bottom-right`
**rank position 可选值**：`top-left` | `top-right` | `bottom-left` | `bottom-right`
**label**：默认显示在节点中心区域

### 推荐搭配

| rank.position | icon.position  | label            | 适用风格                | 参考               |
| ------------- | -------------- | ---------------- | ----------------------- | ------------------ |
| `top-left`    | `top-right`    | 默认（中心偏下） | 排名突出 + icon 辅助    | 类似裁员信息图     |
| `top-left`    | `center`       | 默认（下方）     | 排名在角，icon 居中突出 | 类似加密货币信息图 |
| `top-left`    | `bottom-right` | 默认（中心）     | 三角分布，空间利用率高  | 通用布局           |
| `top-right`   | `top-left`     | 默认（中心偏下） | 左右对称                | 通用布局           |
| 不显示        | `top-left`     | 默认（中心）     | 无排名的简洁布局        | 只需 icon + label  |

### 禁止搭配

- `rank.position` 和 `icon.position` **不可相同**（如都是 `top-left`）
- `icon.position = center` 时 label 会被推开，确保节点够大时才用
- 小节点（数据占比 < 5%）建议隐藏 rank 或 icon，避免拥挤

---

## 规则 3：label 格式应包含名称和数值

参考信息图风格，treemap 的 label 应同时展示类目名称和数值，让用户一眼获取关键信息。

### 推荐 format

```json
{
  "label": {
    "visible": true,
    "format": "{name}\n{value}",
    "showPercent": true,
    "minVisible": 30
  }
}
```

| 数据场景               | 推荐 format                                  | 效果                 |
| ---------------------- | -------------------------------------------- | -------------------- |
| 金额数据（市值、预算） | `"{name}\n${value}B"` 或 `"{name}\n{value}"` | "Bitcoin\n$2.36T"    |
| 人数数据（裁员、用户） | `"{name}\n{value}K"` 或 `"{name}\n{value}"`  | "DOGE Actions\n294K" |
| 占比数据               | `"{name}"` + `showPercent: true`             | "产品A\n30%"         |
| 通用                   | `"{name}\n{value}"`                          | "类目\n数值"         |

### 注意事项

- `minVisible` 设置为 `20` ~ `40`，小节点自动隐藏 label 避免文字溢出
- 大节点可以通过 format 包含更多信息，小节点保持简洁

---

## 规则 4：分组模式 vs 单层模式选择

根据数据特征决定使用分组模式（有 groupField）还是单层模式：

| 数据特征                                         | 推荐模式     | groupField                  | 说明                         |
| ------------------------------------------------ | ------------ | --------------------------- | ---------------------------- |
| 数据有明确的分类层级（如：按类型分组的加密货币） | **分组模式** | 设置为分类字段（如 `type`） | 同组颜色一致，有层级感       |
| 数据是平铺的排名列表（如：裁员原因排名）         | **单层模式** | 不设置                      | 每个节点独立着色，排名更突出 |
| 数据量 > 10 且有自然分类                         | **分组模式** | 按自然分类                  | 分组让大量数据更有结构       |
| 数据量 ≤ 10 且无明显分组                         | **单层模式** | 不设置                      | 简洁直观                     |

### 分组模式额外配置

使用分组模式时：

- `legend` 需要设置 `visible: true`，展示各分组名称（如图例：Layer 1、Stablecoin、Synthetic Asset）
- `colors` 建议按分组数量配置，确保每组颜色区分明显

---

## 规则 5：推荐使用 background 整体背景配置

矩阵树图推荐配置整体 `background`（与 `nodeBackground` 不同），提升整体视觉层次：

### 策略

| 场景           | background 配置                                    | 说明                     |
| -------------- | -------------------------------------------------- | ------------------------ |
| 深色主题信息图 | `background.color` 配合深色 + 数据主题 Unsplash 图 | 如加密货币用深蓝/深灰底  |
| 浅色主题信息图 | `background.color` 使用浅色底 + 可选 Unsplash 图   | 如商务数据用浅灰/米色    |
| 无特殊需求     | 至少设置 `background.color`                        | 避免白底时节点边界不清晰 |

```json
{
  "background": {
    "color": "#1a1a2e"
  }
}
```

---

## 规则 6：节点样式推荐

### node 配置推荐值

```json
{
  "node": {
    "gap": 2,
    "padding": 4,
    "cornerRadius": 4
  }
}
```

| 参数           | 推荐值    | 说明                                    |
| -------------- | --------- | --------------------------------------- |
| `gap`          | `2` ~ `4` | 节点间距，太大浪费空间，太小视觉拥挤    |
| `padding`      | `4` ~ `8` | 内边距，给 label/icon/rank 留出呼吸空间 |
| `cornerRadius` | `2` ~ `6` | 圆角，增加现代感，0 为直角              |

---

## 完整推荐配置参考

结合以上所有规则的典型 treemap 配置骨架：

```json
{
  "chartType": "treemap",
  "title": { "text": "标题", "position": "center" },
  "data": [...],
  "categoryField": "name",
  "valueField": "value",
  "groupField": "type",
  "background": { "color": "#1a1a2e" },
  "theme": "dark",
  "colors": ["#f7931a", "#627eea", "#26a17b"],
  "legend": { "visible": true, "position": "top" },
  "node": { "gap": 2, "padding": 4, "cornerRadius": 4 },
  "rank": { "visible": true, "position": "top-left" },
  "icon": { "visible": true, "position": "top-right", "field": "iconKey", "map": {...} },
  "label": { "visible": true, "format": "{name}\n{value}", "showPercent": true, "minVisible": 30 },
  "nodeBackground": { "visible": true, "field": "bgKey", "map": {...}, "opacity": 0.3 },
  "footnote": { "text": "数据来源：xxx" }
}
```
