# 子流程：Icon 生成

> **何时使用**：信息图生成/编辑过程中，需要为数据类目配置语义化图标时。
> **核心原则**：所有图标必须来自同一图标集，保持风格和大小一致。图标必须与每个类目的**语义**匹配。

---

## 流程概览

1. 提取数据类目 → 确定 categoryField 对应的所有值
2. **识别语义类型** → 判断类目属于哪种实体类型（关键步骤）
3. 推断搜索关键词 → 根据语义类型选择搜索策略
4. 调用脚本获取图标 → 使用 `scripts/fetch_icons.py` 统一获取
5. 生成 icon 配置 → 写入 schema 的 icon 字段

---

## 步骤 1：提取数据类目

从 schema 的 `data` 数组中，提取 `categoryField` 对应的所有唯一值：

```javascript
// schema.data = [{ name: "微信", value: 35 }, { name: "抖音", value: 30 }, ...]
// schema.categoryField = "name"
// → categories = ["微信", "抖音", ...]
```

---

## 步骤 2：识别语义类型（关键步骤）

> ⚠️ 此步骤决定了图标是否能真正匹配数据语义。**必须先识别语义类型再选搜索策略。**

分析数据类目属于以下哪种实体类型：

### 类型 A：每个类目代表独立实体（需要逐类目搜索）

每个类目是一个可识别的独立实体，需要各自不同的语义图标。

| 实体类型          | 数据示例                    | 推荐图标集                  | 搜索策略                            |
| ----------------- | --------------------------- | --------------------------- | ----------------------------------- |
| **国家/地区**     | Norway, Estonia, 中国, 日本 | `twemoji` 或 `openmoji`     | 每个国家名作为各自的搜索词 + "flag" |
| **品牌/平台**     | 微信, 抖音, GitHub, Twitter | `mdi` 或 `simple-icons`     | 每个品牌名作为各自的搜索词          |
| **编程语言/技术** | Python, Java, React, Vue    | `vscode-icons` 或 `devicon` | 每个技术名作为各自的搜索词          |

**识别标志**：

- 类目名是专有名词（国家名、品牌名、公司名）
- 类目之间有明显的身份差异（不同国家、不同品牌）
- 用同一个通用图标（如通用 "location" 图标）无法区分各类目

→ 使用 `--per-category-keywords` 参数，为每个类目指定独立的搜索关键词

### 类型 B：类目属于同一主题族群（使用共享关键词搜索）

所有类目共享一个相似的语义主题，可以用同一组关键词搜索。

| 数据主题               | 推荐关键词                    | 推荐图标集 |
| ---------------------- | ----------------------------- | ---------- |
| 社交平台（微信、抖音） | social, chat, message, video  | mdi        |
| 产品类型（手机、电脑） | device, phone, laptop, tablet | mdi        |
| 金融数据（股票、基金） | finance, money, chart         | mdi        |
| 电商商品（服装、食品） | shopping, store, cart         | mdi        |
| 城市（北京、上海）     | city, location, map, building | mdi        |
| 人物角色（员工、客户） | user, person, account, people | mdi        |
| 时间周期（1月、Q1）    | calendar, clock, time         | mdi        |
| 排名相关（TOP1、TOP2） | trophy, medal, award, star    | mdi        |
| 增长趋势               | trending-up, growth, arrow    | mdi        |

**识别标志**：

- 类目名是通用名词（产品、食品、设备）
- 类目之间的差异可以通过不同的主题图标表达
- 一组共享关键词能覆盖所有类目

→ 使用 `--keywords` 参数，传入共享的搜索关键词

---

## 步骤 3：构造脚本调用参数

### 类型 A（逐类目搜索）示例 — 国家数据

当数据类目是国家名时：

1. 将每个国家名翻译为英文全名（注意缩写展开：UK → United Kingdom, US → United States）
2. 为每个国家构造搜索关键词：`{国家英文名} flag`
3. 选择国旗图标集：`twemoji`（推荐）或 `openmoji`

```bash
# 国家/国旗场景
python <SKILL_DIR>/scripts/fetch_icons.py \
  --categories '["Norway","Estonia","Greece","Lithuania","UK"]' \
  --per-category-keywords '{"Norway":"norway flag","Estonia":"estonia flag","Greece":"greece flag","Lithuania":"lithuania flag","UK":"united kingdom flag"}' \
  --prefer-collection twemoji
```

> **注意**：`--per-category-keywords` 中的 key 必须与 `--categories` 中的值完全一致。

### 类型 A 示例 — 品牌/平台数据

```bash
# 品牌/平台场景
python <SKILL_DIR>/scripts/fetch_icons.py \
  --categories '["微信","抖音","微博","小红书"]' \
  --per-category-keywords '{"微信":"wechat","抖音":"tiktok","微博":"weibo","小红书":"xiaohongshu book"}' \
  --prefer-collection mdi
```

### 类型 B（共享关键词搜索）示例

```bash
# 产品类型场景（共享关键词）
python <SKILL_DIR>/scripts/fetch_icons.py \
  --categories '["手机","电脑","平板","耳机"]' \
  --keywords '["device","phone","laptop","tablet","headphone"]' \
  --prefer-collection mdi \
  --size 24
```

---

## 步骤 4：调用脚本获取图标

> 🚨 **必须通过终端执行脚本**，禁止手动拼接 Iconify URL。

使用 `scripts/fetch_icons.py` 脚本统一获取图标。

**参数说明**：

| 参数                      | 类型      | 说明                                                          |
| ------------------------- | --------- | ------------------------------------------------------------- |
| `--categories`            | JSON 数组 | categoryField 对应的所有唯一值（必须）                        |
| `--keywords`              | JSON 数组 | 共享搜索关键词（类型 B 使用）                                 |
| `--per-category-keywords` | JSON 对象 | 逐类目搜索关键词（类型 A 使用），key 必须与 categories 值一致 |
| `--prefer-collection`     | 字符串    | 偏好图标集，国旗推荐 `twemoji`，通用推荐 `mdi`                |
| `--size`                  | 整数      | 图标尺寸（像素），可选                                        |

**脚本输出格式**：

```json
{
  "iconField": "iconKey",
  "map": {
    "Norway": "https://api.iconify.design/twemoji/flag-norway.svg",
    "Estonia": "https://api.iconify.design/twemoji/flag-estonia.svg",
    "Greece": "https://api.iconify.design/twemoji/flag-greece.svg"
  },
  "collection": "twemoji",
  "icons": [...]
}
```

---

## 步骤 5：生成 Icon 配置

将脚本的输出集成到 schema 中：

### 5.1 在 data 中添加 iconKey 字段

```javascript
data: [
  { name: 'Norway', value: 21, iconKey: 'Norway' },
  { name: 'Estonia', value: 18, iconKey: 'Estonia' },
  // iconKey 值与 icon.map 的 key 对应
];
```

### 5.2 生成 icon 配置

```javascript
icon: {
  field: "iconKey",           // data 中存储 icon key 的字段名
  map: {
    "Norway": "https://api.iconify.design/twemoji/flag-norway.svg",
    "Estonia": "https://api.iconify.design/twemoji/flag-estonia.svg"
  },
  visible: true,
  position: "start",          // 根据图表类型选择（见下表）
  size: 24
}
```

### 5.3 各图表类型推荐 position

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
| 语义匹配           | 图标必须与每个类目的语义对应（国家→国旗，品牌→品牌图标）             |
| icon.field 有效    | 必须是 data 中存在的字段名                                           |
| icon.map key 完整  | 每个数据项的 iconKey 值都有对应的 URL                                |
| icon.map URL 有效  | 所有 URL 格式为 `https://api.iconify.design/{collection}/{name}.svg` |
| 图标风格一致       | 所有图标来自同一图标集（如全部是 `twemoji:` 或全部是 `mdi:`）        |
| icon.position 有效 | 必须是该图表类型支持的 position 值                                   |
