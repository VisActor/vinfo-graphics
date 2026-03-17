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

## 使用场景与尺寸参数

选择图片后，**必须在 URL 末尾追加尺寸参数**：

| 使用场景                                        | URL 后缀                  | 示例                           |
| ----------------------------------------------- | ------------------------- | ------------------------------ |
| `background.image`（全局背景）                  | `?w=1920&h=1080&fit=crop` | `{url}?w=1920&h=1080&fit=crop` |
| `nodeBackground.map[*]`（treemap 节点）         | `?w=600&h=400&fit=crop`   | `{url}?w=600&h=400&fit=crop`   |
| `circleBackground.map[*]`（circlePacking 圆形） | `?w=600&h=400&fit=crop`   | `{url}?w=600&h=400&fit=crop`   |

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

### 步骤 3：去重校验

在写入 schema 前，确保以下去重规则：

| 检查项                                               | 操作               |
| ---------------------------------------------------- | ------------------ |
| `background.image` 与 `nodeBackground.map[*]` 相同   | 替换其中一个       |
| `background.image` 与 `circleBackground.map[*]` 相同 | 替换其中一个       |
| `nodeBackground.map` 中不同节点使用相同图片          | 重新为重复节点选择 |
| `circleBackground.map` 中不同圆使用相同图片          | 重新为重复圆选择   |

### 步骤 4：追加尺寸参数并集成到 Schema

根据使用场景追加对应尺寸参数（见上表），然后写入 schema。

#### background.image 示例

```json
{
  "background": {
    "image": "https://images.pexels.com/photos/2098427/pexels-photo-2098427.jpeg?w=1920&h=1080&fit=crop"
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
      "Bitcoin": "https://images.pexels.com/photos/xxx/pexels-photo-xxx.jpeg?w=600&h=400&fit=crop",
      "Ethereum": "https://images.pexels.com/photos/yyy/pexels-photo-yyy.jpeg?w=600&h=400&fit=crop"
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
      "频道A": "https://images.pexels.com/photos/xxx/pexels-photo-xxx.jpeg?w=600&h=400&fit=crop",
      "频道B": "https://images.pexels.com/photos/yyy/pexels-photo-yyy.jpeg?w=600&h=400&fit=crop"
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
