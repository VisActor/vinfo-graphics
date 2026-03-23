# 子流程：Icon 生成

> **何时使用**：信息图生成/编辑过程中，需要为数据类目配置语义化图标时。
> **核心原则**：所有图标必须来自同一图标集，保持风格和大小一致。图标必须与每个类目的**语义**匹配。图标颜色要与整体主题协调，单色图标可通过 URL `color` 参数自定义颜色。若语义不成立，必须跳过 icon 配置。

---

## 流程概览

1. 提取数据类目 → 确定 categoryField 对应的所有值
2. **识别语义类型** → 判断类目属于哪种实体类型（关键步骤）
3. **选择图标集** → 参考「Iconify 图标集分类参考」匹配最佳图标集
4. 构造脚本调用参数 → 根据语义类型选择搜索策略
5. 调用脚本获取图标 → 使用 `scripts/fetch_icons.py` 统一获取
6. 生成 icon 配置（或跳过）→ 仅在语义成立时写入 schema 的 icon 字段

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

| 实体类型          | 数据示例                                   | 推荐图标集                                                                                                                                     | 搜索策略                                                   |
| ----------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **国家**          | Norway, Estonia, 中国, 日本                | `circle-flags`（首选，圆形国旗）→ `twemoji` → `flagpack`                                                                                       | 每个国家名作为各自的搜索词 + "flag"                        |
| **地理区域/大洲** | North America, Middle East, Africa, Europe | `gis`（GIS 地理图标）→ `map` → `mdi`                                                                                                           | 每个区域名作为各自的搜索词（区域没有国旗，用区域特征图标） |
| **品牌/平台**     | 微信, 抖音, GitHub, Twitter                | ⭐ **优先使用 Brandfetch 品牌 Logo**（→ `subprocess-brand-logo.md`）→ 回退：`simple-icons`（3412, 单色可调色）→ `fa7-brands` → `logos`（彩色） | 优先走品牌 Logo 子流程；回退时每个品牌名作为各自的搜索词   |
| **编程语言/技术** | Python, Java, React, Vue                   | `devicon`（彩色）→ `devicon-plain`（单色）→ `vscode-icons` → `skill-icons`                                                                     | 每个技术名作为各自的搜索词                                 |
| **游戏/娱乐**     | 角色, 武器, 道具, 技能                     | `game-icons`（4123, 最大游戏主题集）                                                                                                           | 每个游戏元素名作为各自的搜索词                             |
| **医疗/健康**     | 心脏, 肺部, 药物, 手术                     | `healthicons`（2024, 医疗专用）→ `mdi`                                                                                                         | 每个医疗术语作为各自的搜索词                               |
| **天气/气象**     | 晴天, 多云, 暴雨, 大风                     | `meteocons`（447, 动画天气）→ `wi`（219）                                                                                                      | 每个天气类型名作为各自的搜索词                             |

**识别标志**：

- 类目名是专有名词（国家名、品牌名、公司名）
- 类目之间有明显的身份差异（不同国家、不同品牌）
- 用同一个通用图标（如通用 "location" 图标）无法区分各类目

→ 使用 `--per-category-keywords` 参数，为每个类目指定独立的搜索关键词

> ⚠️ **关键原则：icon 必须代表类目本身，而非数据的度量主题**。
> 例如数据是「各地区原油产量」，icon 应代表**地区**（如区域地图/特征图标），而**不是**代表「原油」（如 oil-barrel）。
> 如果所有类目都用同一主题的 icon 变体（如 oil、oil-lamp、oil-barrel、oil-truck），用户无法通过 icon 区分类目，这等于没有 icon。

### 类型 B：类目属于同一主题族群（使用共享关键词搜索）

所有类目共享一个相似的语义主题，可以用同一组关键词搜索。

| 数据主题               | 推荐关键词                    | 推荐图标集                    |
| ---------------------- | ----------------------------- | ----------------------------- |
| 社交平台（微信、抖音） | social, chat, message, video  | `mdi`, `fluent`, `ph`         |
| 产品类型（手机、电脑） | device, phone, laptop, tablet | `mdi`, `fluent`, `tabler`     |
| 金融数据（股票、基金） | finance, money, chart         | `mdi`, `fluent`, `carbon`     |
| 电商商品（服装、食品） | shopping, store, cart         | `mdi`, `fluent`, `ph`         |
| 城市（北京、上海）     | city, location, map, building | `mdi`, `fluent`, `tabler`     |
| 人物角色（员工、客户） | user, person, account, people | `mdi`, `ph`, `solar`          |
| 时间周期（1月、Q1）    | calendar, clock, time         | `mdi`, `fluent`, `tabler`     |
| 排名相关（TOP1、TOP2） | trophy, medal, award, star    | `mdi`, `fluent`, `game-icons` |
| 增长趋势               | trending-up, growth, arrow    | `mdi`, `carbon`, `lucide`     |

**识别标志**：

- 类目名是通用名词（产品、食品、设备）
- 类目之间的差异可以通过不同的主题图标表达
- 一组共享关键词能覆盖所有类目

→ 使用 `--keywords` 参数，传入共享的搜索关键词

### 类型 C：语义不可区分或不可解释（必须跳过 icon）

当类目无法建立稳定、可解释的一一图标语义时，不应生成 icon。

常见场景：

- 中国省份 GDP、城市 GDP、行政区财政数据（类目是地区名，但无统一且可验证的专属图标体系）
- 类目是抽象标签（A组/B组、高/中/低、一期/二期）
- 搜索结果与类目语义弱相关，仅是“看起来不同”的随机图标

处理方式：

- 不写入 `icon` 字段
- 保留 `label` / `rank` / `colors` 等其他视觉编码
- 若需要视觉强化，优先使用 `background` 或 `brandImage`（走图片子流程）

---

## Iconify 图标集分类参考

> 基于 https://icon-sets.iconify.design/ 的官方分类。选择图标集时，优先从下表中匹配数据场景对应的专用集，再回退到通用集。

### 按数据场景推荐

| 数据场景          | 首选图标集                                                        | 备选图标集                                                                                 | 说明                                                                |
| ----------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| **国家/国旗**     | `circle-flags`（634 icons, 圆形国旗）                             | `flagpack`（254）, `flag`（542）, `twemoji`（3988, emoji 风格国旗）                        | `circle-flags` 圆形风格最适合图表；`twemoji` 覆盖面广但风格偏 emoji |
| **地理区域/大洲** | `gis`（367, GIS/地理图标）                                        | `map`（167）, `mdi`（通用地图相关子集）                                                    | 区域无国旗，用地理/地图特征图标                                     |
| **品牌/公司**     | ⭐ **Brandfetch 品牌 Logo**（优先，→ `subprocess-brand-logo.md`） | 回退：`simple-icons`（3412）→ `fa7-brands`（586）→ `logos`（1837, 彩色）                   | 品牌数据优先走 Brand Logo 子流程获取官方 Logo；Iconify 作为回退     |
| **编程语言/技术** | `devicon`（1033, 彩色技术图标）                                   | `devicon-plain`（753, 单色）, `skill-icons`（400, badge 风格）, `vscode-icons`（1475）     | 技术类数据优先用专用集而非通用集                                    |
| **游戏/娱乐**     | `game-icons`（4123, CC BY 3.0, 单色）                             | `mdi`（游戏相关子集）                                                                      | `game-icons` 是最大的游戏主题图标集                                 |
| **医疗/健康**     | `healthicons`（2024, MIT）                                        | `mdi`（医疗相关子集）                                                                      | 专为医疗健康领域设计的专用集                                        |
| **天气/气象**     | `meteocons`（447, MIT, 动画天气图标）                             | `wi`（219, Weather Icons）                                                                 | 天气数据必须用专用天气图标集                                        |
| **通用 UI 场景**  | `mdi`（7447）                                                     | `fluent`（19152, 最大）, `ph`（9072）, `tabler`（6074）, `solar`（7401）, `lucide`（1703） | 产品/金融/电商/城市/人物等通用场景                                  |
| **多色需求**      | `fluent-emoji-flat`（3145, 扁平彩色）                             | `noto`（3710）, `twemoji`（3988）, `openmoji`（4460, 开放 emoji）                          | 需要视觉冲击力或 emoji 风格时使用                                   |

### 单色 vs 多色图标集

| 类别                   | 代表图标集                                                                                            | `color` 参数                                   | 适用场景                                |
| ---------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------- | --------------------------------------- |
| **单色（Monotone）**   | `mdi`, `lucide`, `tabler`, `ph`, `carbon`, `simple-icons`, `game-icons`, `healthicons`                | ✅ 有效，可通过 URL `?color=%23xxx` 自定义颜色 | 需要与图表主题色统一时                  |
| **多色（Multicolor）** | `twemoji`, `openmoji`, `noto`, `fluent-emoji-flat`, `circle-flags`, `logos`, `devicon`, `skill-icons` | ❌ 无效，图标有内置调色板                      | 国旗、品牌 Logo、emoji 等自带颜色的场景 |

> **选择策略**：
>
> - 默认使用**单色图标集**，便于通过 `color` 参数适配深色/浅色主题
> - 国旗、品牌 Logo 等**实体自带固有颜色**的场景，使用多色图标集
> - 同一 schema 中所有 icon 必须来自**同一图标集**，不可混用单色和多色

---

## 步骤 3：构造脚本调用参数（对应流程步骤 4）

### 类型 A（逐类目搜索）示例 — 国家数据

当数据类目是国家名时：

1. 将每个国家名翻译为英文全名（注意缩写展开：UK → United Kingdom, US → United States）
2. 为每个国家构造搜索关键词：`{国家英文名} flag`
3. 选择国旗图标集：`circle-flags`（首选，圆形国旗适合图表）→ `twemoji` → `flagpack`

```bash
# 国家/国旗场景
python <SKILL_DIR>/scripts/fetch_icons.py \
  --categories '["Norway","Estonia","Greece","Lithuania","UK"]' \
  --per-category-keywords '{"Norway":"norway flag","Estonia":"estonia flag","Greece":"greece flag","Lithuania":"lithuania flag","UK":"united kingdom flag"}' \
  --prefer-collection circle-flags
```

> **注意**：`--per-category-keywords` 中的 key 必须与 `--categories` 中的值完全一致。

### 类型 A 示例 — 地理区域数据

当数据类目是地理区域/大洲名时（如 North America、Middle East、Africa），**不能用国旗**（区域没有国旗），应为每个区域搜索具有区域特征的图标：

```bash
# 地理区域场景 — 每个区域用不同的区域特征关键词
python <SKILL_DIR>/scripts/fetch_icons.py \
  --categories '["North America","Middle East","Eurasia","Asia-Pacific","Central & South America","Africa","Europe"]' \
  --per-category-keywords '{"North America":"america continent","Middle East":"islam mosque","Eurasia":"russia bear","Asia-Pacific":"asia rice","Central & South America":"south america forest","Africa":"africa safari","Europe":"europe castle"}' \
  --prefer-collection mdi
```

> **关键**：区域类目的搜索关键词应体现该区域的**地理/文化特征**，而非数据的度量主题（如「原油」）。
> 每个区域的关键词必须**互不相同**，以确保搜索结果视觉可区分。

### 类型 A 示例 — 品牌/平台数据

> ⭐ **品牌数据优先使用 Brandfetch 品牌 Logo 子流程**（`subprocess-brand-logo.md`），可获取官方品牌 Logo，辨识度远高于单色图标。仅当 Brandfetch 不可用或未收录时，回退到以下 Iconify 方案。

**方案一（推荐）：Brandfetch 品牌 Logo**

```bash
# 品牌 Logo（官方 Logo，彩色，高辨识度）
python <SKILL_DIR>/scripts/fetch_brand_logos.py \
  --brands '["微信","抖音","微博","小红书"]' \
  --type icon
```

**方案二（回退）：Iconify 单色图标**

```bash
# 品牌/平台场景（simple-icons 覆盖最广，单色可调色）
python <SKILL_DIR>/scripts/fetch_icons.py \
  --categories '["微信","抖音","微博","小红书"]' \
  --per-category-keywords '{"微信":"wechat","抖音":"tiktok","微博":"weibo","小红书":"xiaohongshu book"}' \
  --prefer-collection simple-icons
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

| 参数                      | 类型      | 说明                                                           |
| ------------------------- | --------- | -------------------------------------------------------------- |
| `--categories`            | JSON 数组 | categoryField 对应的所有唯一值（必须）                         |
| `--keywords`              | JSON 数组 | 共享搜索关键词（类型 B 使用）                                  |
| `--per-category-keywords` | JSON 对象 | 逐类目搜索关键词（类型 A 使用），key 必须与 categories 值一致  |
| `--prefer-collection`     | 字符串    | 偏好图标集，参考上方「Iconify 图标集分类参考」选择合适的图标集 |
| `--size`                  | 整数      | 图标尺寸（像素），可选                                         |

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

> **脚本输出的是不带颜色参数的基础 URL。** 对于单色图标（如 `mdi`、`lucide`、`bi` 等），需要在写入 schema 前根据主题手动追加 `color` 参数（见步骤 5.2）。国旗类图标（`twemoji`、`circle-flags`）及其他多色图标已有内置调色板，不受 `color` 参数影响，无需追加。详见「单色 vs 多色图标集」。

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

对于单色图标，根据 schema 的整体主题在 URL 中追加 `color` 参数（`#` 必须编码为 `%23`）：

| 主题类型                                      | 推荐颜色             | color 参数示例                 |
| --------------------------------------------- | -------------------- | ------------------------------ |
| 深色主题（`dark`、`dream`、`neon`、`oil` 等） | 白色或浅色           | `?color=%23ffffff`             |
| 浅色主题（默认、`light`）                     | 深灰或品牌主色       | `?color=%231e293b`             |
| 彩色背景（linearGradient/image）              | 白色，与背景形成对比 | `?color=%23ffffff`             |
| 自定义颜色方案                                | 与图表主色调一致     | `?color=%234A90D9`（蓝色示例） |

> ⚠️ `color` 参数仅对**单色图标**（monotone）有效，`twemoji`、`fluent-emoji-flat` 等带内置调色板的图标不受影响，无需追加。

```javascript
// 浅色主题示例（color = #1e293b）
icon: {
  field: "iconKey",
  map: {
    "Norway": "https://api.iconify.design/twemoji/flag-norway.svg",      // 国旗：不加 color
    "Estonia": "https://api.iconify.design/twemoji/flag-estonia.svg"
  },
  visible: true,
  position: "start",
  size: 24
}

// 深色主题示例（color = #ffffff，单色图标集）
icon: {
  field: "iconKey",
  map: {
    "手机": "https://api.iconify.design/mdi/cellphone.svg?color=%23ffffff",
    "电脑": "https://api.iconify.design/mdi/laptop.svg?color=%23ffffff",
    "平板": "https://api.iconify.design/mdi/tablet.svg?color=%23ffffff"
  },
  visible: true,
  position: "start",
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

| 检查项             | 要求                                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| 语义匹配           | 图标必须与每个类目的语义对应（国家→国旗，地理区域→区域特征图标，品牌→品牌图标）                           |
| **视觉可区分**     | **每个类目的 icon 在视觉上必须明显不同**；禁止使用同一主题的微小变体（如全用 oil-_、全用 chart-_）        |
| icon.field 有效    | 必须是 data 中存在的字段名                                                                                |
| icon.map key 完整  | 每个数据项的 iconKey 值都有对应的 URL                                                                     |
| icon.map URL 有效  | 所有 URL 格式为 `https://api.iconify.design/{collection}/{name}.svg`（单色图标可附加 `?color=%23xxxxxx`） |
| 图标风格一致       | 所有图标来自同一图标集（如全部是 `twemoji:` 或全部是 `mdi:`）                                             |
| 图标颜色与主题适配 | 深色主题用白/浅色，浅色主题用深灰/主色；国旗等多色图标无需追加 color 参数                                 |
| icon.position 有效 | 必须是该图表类型支持的 position 值                                                                        |
| 语义可解释性       | 至少 70% 类目可解释地匹配图标；若达不到阈值，必须整体跳过 icon                                            |
