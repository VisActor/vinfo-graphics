# 背景图片选择子流程

> **何时使用**：需要为信息图配置背景图片时——包括 `background.image`、treemap 的 `nodeBackground.map`、circlePacking 的 `circleBackground.map`。
> **图片来源**：预置背景图片库 (`references/images/images.json`)。
> **核心原则**：通过 `keywords` 和 `tags` 语义匹配，保证图片与数据主题一致，所有图片 URL 互不重复。

---

## 图片库结构

`references/images/images.json` 是一个扁平数组，每个条目包含：

| 字段       | 类型     | 说明                                                          |
| ---------- | -------- | ------------------------------------------------------------- |
| `url`      | string   | Pexels 图片 URL（**不含尺寸参数，使用时必须追加**）           |
| `isDark`   | boolean  | `true` = 深色图片（适配深色主题），`false` = 浅色图片         |
| `type`     | string[] | 图片类型：`"background"`（场景图）和/或 `"texture"`（纹理图） |
| `keywords` | string   | 主搜索词（如 `"藏蓝"`、`"car"`、`"石油"`）                    |
| `tags`     | string[] | 可选，更细粒度的语义标签（如 `["深蓝", "夜空", "山峰"]`）     |

---

## 选择流程

### 步骤 1：读取图片库

读取 `references/images/images.json`，获取完整的图片列表。

### 步骤 2：根据主题和色调筛选

按以下优先级匹配：

1. **语义匹配**：`tags` 或 `keywords` 与数据主题相关
2. **色调匹配**：`isDark` 与当前 theme 一致（深色主题选 `isDark: true`，浅色主题选 `isDark: false`）
3. **类型匹配**：根据需要选择 `"background"`（有具体场景内容）或 `"texture"`（抽象纹理）

#### 主题 → 色调对应关系

| 主题 theme                 | 推荐 isDark |
| -------------------------- | ----------- |
| `dark`, `dream`, `neon`    | `true`      |
| `light`, `fresh`, `pastel` | `false`     |

#### 数据主题 → keywords/tags 匹配参考

**宏观主题匹配**（适用于 `background.image`）：

| 数据/用户意图      | 推荐搜索 keywords/tags                  |
| ------------------ | --------------------------------------- |
| 科技、AI、互联网   | `紫色` + tags 含"科技"/"光线"           |
| 能源、石油、矿业   | `石油`、`煤炭`、`深绿`                  |
| 金融、投资、商务   | `深蓝` + tags 含"夜景"/"建筑"           |
| 汽车、交通         | `car`                                   |
| 自然、环保、农业   | `深绿`、`浅绿` + tags 含"植物"/"自然"   |
| 设计、抽象、通用   | `grey gradient`、`grey sky`、纹理类图片 |
| 浪漫、时尚、美妆   | `粉色`、`紫色`                          |
| 海洋、航运         | `blue sea`、`藏蓝` + tags 含"大海"      |
| 夜空、星空、宇宙   | `深蓝` + tags 含"夜空"/"星河"/"银河"    |
| 暖色、阳光、正能量 | `黄色`、`红色`                          |

**实体级匹配**（适用于 `nodeBackground.map` / `circleBackground.map`）：

为每个数据项匹配图片时，应**用数据项的具体实体名称去搜索 tags**，而非只用宏观主题：

| 数据项类型 | 匹配策略                                         | 示例                                               |
| ---------- | ------------------------------------------------ | -------------------------------------------------- |
| 国家/地区  | 用国家名称搜索 tags（中文或英文）                | "U.S." → 搜 tags 含 "美国"；"Singapore" → "新加坡" |
| 品牌/公司  | 用品牌特征关键词搜索                             | "NVIDIA" → 搜 "科技""光线"；"Tesla" → "汽车"       |
| 城市       | 用城市名称或地标搜索 tags                        | "上海" → 搜 "建筑""夜景"；"Paris" → "建筑"         |
| 抽象类目   | 用主题相关的 tags 或选纹理图 (`type: "texture"`) | "投资" → 搜 "金融""数据"；"其他" → 纹理图          |

### 步骤 3：去重校验

在写入 schema 前，确保以下去重规则：

| 检查项                                               | 操作               |
| ---------------------------------------------------- | ------------------ |
| `background.image` 与 `nodeBackground.map[*]` 相同   | 替换其中一个       |
| `background.image` 与 `circleBackground.map[*]` 相同 | 替换其中一个       |
| `nodeBackground.map` 中不同节点使用相同图片          | 重新为重复节点选择 |
| `circleBackground.map` 中不同圆使用相同图片          | 重新为重复圆选择   |

### 步骤 4：根据主题与图片色调设置透明度

背景图片的透明度（`opacity`）需要根据**主题色调**与**图片色调**的组合来设置，以保证文字可读性和视觉和谐：

| 主题类型 (`theme.type`) | 图片色调 (`isDark`) | 推荐 `opacity` 范围 | 说明                                                  |
| ----------------------- | ------------------- | ------------------- | ----------------------------------------------------- |
| `light`（浅色主题）     | `true`（深色图片）  | **0.10 ~ 0.25**     | ⚠️ 冲突！深色图片会压制浅色背景色，必须大幅降低透明度 |
| `light`（浅色主题）     | `false`（浅色图片） | 0.40 ~ 0.65         | 匹配，图片可适度显示                                  |
| `dark`（深色主题）      | `true`（深色图片）  | 0.40 ~ 0.65         | 匹配，图片可适度显示                                  |
| `dark`（深色主题）      | `false`（浅色图片） | **0.10 ~ 0.25**     | ⚠️ 冲突！浅色图片会破坏深色氛围，必须大幅降低透明度   |

**关键规则**：

- 当图片 `isDark` 与主题 `type` **不匹配**（一深一浅）时，透明度必须设为低值（`0.10 ~ 0.25`），否则图文对比度会严重下降
- `nodeBackground` 和 `circleBackground` 的 `opacity` 遵循同样逻辑（通常取 `0.25 ~ 0.4`，适当保留节点内容可读性）

### 步骤 5：集成到 Schema

将选中的图片 URL 直接写入 schema（不需要追加任何尺寸参数）。

#### background.image 示例（浅色主题 + 深色图片 → 低透明度）

```json
{
  "background": {
    "image": "https://images.pexels.com/photos/2098427/pexels-photo-2098427.jpeg",
    "opacity": 0.15
  }
}
```

#### background.image 示例（主题与图片色调匹配 → 正常透明度）

```json
{
  "background": {
    "image": "https://images.pexels.com/photos/2098427/pexels-photo-2098427.jpeg",
    "opacity": 0.55
  }
}
```

#### nodeBackground.map 示例（treemap）

```json
{
  "nodeBackground": {
    "visible": true,
    "field": "bgKey",
    "map": {
      "Bitcoin": "https://images.pexels.com/photos/xxx/pexels-photo-xxx.jpeg",
      "Ethereum": "https://images.pexels.com/photos/yyy/pexels-photo-yyy.jpeg"
    },
    "opacity": 0.3
  }
}
```

#### circleBackground.map 示例（circlePacking）

```json
{
  "circleBackground": {
    "visible": true,
    "field": "bgKey",
    "map": {
      "频道A": "https://images.pexels.com/photos/xxx/pexels-photo-xxx.jpeg",
      "频道B": "https://images.pexels.com/photos/yyy/pexels-photo-yyy.jpeg"
    },
    "opacity": 0.3
  }
}
```

---

## 无匹配时的回退策略

当数据主题在图片库中找不到精确匹配时：

1. **background 回退**：选择纹理类图片（`type` 含 `"texture"`），优先 `grey gradient`、`grey sky` 等中性图片
2. **nodeBackground / circleBackground 回退**：如果无法为每个节点找到语义不同的图片，**跳过该配置**而非使用不相关图片
3. **保底规则**：`background` 与 `brandImage` 不可同时缺失（至少有一项视觉装饰）
