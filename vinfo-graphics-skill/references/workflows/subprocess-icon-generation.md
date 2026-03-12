# 子流程：Icon 生成

> **何时使用**：信息图生成/编辑过程中，需要为数据类目配置语义化图标时。
> **核心原则**：所有图标必须来自同一图标集，保持风格和大小一致。

---

## 流程概览

1. 提取数据类目 → 确定 categoryField 对应的所有值
2. 推断搜索关键词 → 将中文类目翻译为英文语义关键词
3. 调用脚本获取图标 → 使用 `scripts/fetch_icons.py` 统一获取
4. 生成 icon 配置 → 写入 schema 的 icon 字段

---

## 步骤 1：提取数据类目

从 schema 的 `data` 数组中，提取 `categoryField` 对应的所有唯一值：

```javascript
// schema.data = [{ name: "微信", value: 35 }, { name: "抖音", value: 30 }, ...]
// schema.categoryField = "name"
// → categories = ["微信", "抖音", ...]
```

---

## 步骤 2：推断搜索关键词

将数据类目翻译为可在 Iconify 中搜索的英文关键词。同类数据应共享关键词以增加同一图标集命中率：

| 数据主题               | 推荐关键词                    |
| ---------------------- | ----------------------------- |
| 社交平台（微信、抖音） | social, chat, message, video  |
| 产品类型（手机、电脑） | device, phone, laptop, tablet |
| 金融数据（股票、基金） | finance, money, chart         |
| 电商商品（服装、食品） | shopping, store, cart         |
| 地区城市（北京、上海） | city, location, map, building |
| 人物角色（员工、客户） | user, person, account, people |
| 时间周期（1月、Q1）    | calendar, clock, time         |
| 排名相关（TOP1、TOP2） | trophy, medal, award, star    |
| 增长趋势               | trending-up, growth, arrow    |

**关键词选择原则**：

- 选择 2-3 个语义相关但不过于具体的关键词
- 优先选择大图标集（mdi、bi）中常见的词汇
- 每个类目的搜索关键词应有一定重叠，确保能命中同一图标集

---

## 步骤 3：调用脚本获取图标

使用 `scripts/fetch_icons.py` 脚本统一获取图标：

```bash
python <SKILL_DIR>/scripts/fetch_icons.py \
  --categories '["微信","抖音","微博","小红书"]' \
  --keywords '["social","chat","message"]' \
  --prefer-collection mdi \
  --size 24
```

**参数说明**：

- `--categories`：JSON 数组，categoryField 对应的所有唯一值
- `--keywords`：JSON 数组，步骤 2 推断的英文搜索关键词
- `--prefer-collection`：偏好图标集（推荐 `mdi`），确保风格统一
- `--size`：图标尺寸（像素），默认不指定由 SVG 自适应

**脚本输出格式**：

```json
{
  "iconField": "iconKey",
  "map": {
    "微信": "https://api.iconify.design/mdi/wechat.svg",
    "抖音": "https://api.iconify.design/mdi/music-note.svg",
    "微博": "https://api.iconify.design/mdi/post.svg",
    "小红书": "https://api.iconify.design/mdi/book-open.svg"
  },
  "collection": "mdi",
  "icons": [...]
}
```

**如果脚本不可用**，也可以手动通过 WebFetch 调用 Iconify API：

```
https://api.iconify.design/search?query={keyword}&limit=999
```

返回 `{ "icons": ["mdi:phone", "mdi:cellphone", ...] }`，手动从结果中筛选同一集合的图标。

---

## 步骤 4：生成 Icon 配置

将脚本的输出集成到 schema 中：

### 4.1 在 data 中添加 iconKey 字段

```javascript
data: [
  { name: '微信', value: 35, iconKey: '微信' },
  { name: '抖音', value: 30, iconKey: '抖音' },
  // iconKey 值与 icon.map 的 key 对应
];
```

### 4.2 生成 icon 配置

```javascript
icon: {
  field: "iconKey",           // data 中存储 icon key 的字段名
  map: {
    "微信": "https://api.iconify.design/mdi/wechat.svg",
    "抖音": "https://api.iconify.design/mdi/music-note.svg"
  },
  visible: true,
  position: "outside",        // 根据图表类型选择（见下表）
  size: 24
}
```

### 4.3 各图表类型推荐 position

| 图表类型        | 推荐 position | 备选 position                                  |
| --------------- | ------------- | ---------------------------------------------- |
| `pie`           | outside       | inside, inside-inner, inside-outer             |
| `bar`           | start         | end                                            |
| `column`        | bottom        | top                                            |
| `area`          | top           | bottom                                         |
| `treemap`       | center        | top-left, top-right, bottom-left, bottom-right |
| `circlePacking` | center        | top-left, top-right                            |

> **注意**：icon.position 的可选值是图表类型特有的，必须查阅 `references/top-keys/{chartType}.json` 中 icon 字段对应的 `references/type-details/{IconConfig}.md` 确认。

---

## 验证清单

| 检查项             | 要求                                                                 |
| ------------------ | -------------------------------------------------------------------- |
| icon.field 有效    | 必须是 data 中存在的字段名                                           |
| icon.map key 完整  | 每个数据项的 iconKey 值都有对应的 URL                                |
| icon.map URL 有效  | 所有 URL 格式为 `https://api.iconify.design/{collection}/{name}.svg` |
| 图标风格一致       | 所有图标来自同一图标集（如全部是 `mdi:`）                            |
| icon.position 有效 | 必须是该图表类型支持的 position 值                                   |
