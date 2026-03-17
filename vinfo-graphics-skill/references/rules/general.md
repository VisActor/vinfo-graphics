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

从预置图片库 (`references/images/images.json`) 中选择图片：

1. **先选 background**：根据数据整体主题从 `backgrounds.categories.{分类}.images` 中选择 1 张
2. **再选数据项图片**：从对应分类的 `illustrations` 中选择，确保与 background 不同

**核心原则**：

- 优先匹配：主题与预置分类匹配时优先使用对应图片
- 分级回退：无精确匹配时回退到 `abstract`（背景）或 `business`（插图）
- 至少一项装饰：`background` 与 `brandImage` 不可同时缺失
- 去重：background 和 brandImage 使用不同图片，数据项之间图片也应不同
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
