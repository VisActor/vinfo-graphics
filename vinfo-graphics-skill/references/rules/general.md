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
