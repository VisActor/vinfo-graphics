# 子流程：品牌 Logo 获取

> **何时使用**：信息图的数据类目是**品牌/公司/平台名**时，优先使用此流程获取官方品牌 Logo，而非 Iconify 图标。品牌 Logo 比通用图标更具辨识度和专业感。
> **核心原则**：品牌数据应使用真实品牌 Logo，而非 simple-icons 等单色图标替代。Brandfetch 提供 4400 万品牌库和模糊搜索，覆盖中外主流品牌。

### 技术原理

脚本通过 Brandfetch **Search API**（`GET https://api.brandfetch.io/v2/search/{name}`）搜索品牌，直接使用搜索结果中的 `icon` 字段作为图片 URL。该 URL 是 128×128 WebP 格式的品牌图标，内含自动生成的鉴权 token，可直接在浏览器/VChart 中加载。

> ⚠️ **禁止手动拼接 CDN URL**（如 `https://cdn.brandfetch.io/{domain}?c=...`），这种方式已失效（返回 403）。必须通过脚本调用搜索 API 获取可用的 icon URL。

---

## 流程概览

1. 识别品牌类目 → 确认数据中的品牌名
2. 构造搜索参数 → 准备中英文映射
3. 调用脚本获取 Logo → 使用 `scripts/fetch_brand_logos.py`
4. 检查失败项 → 对未找到的品牌回退到 Iconify
5. 生成 icon 配置 → 写入 schema

---

## 何时使用此流程 vs Iconify 流程

| 条件                             | 使用此流程（Brandfetch） | 使用 Iconify 流程 |
| -------------------------------- | ------------------------ | ----------------- |
| 数据类目是**商业品牌/公司**      | ✅ 优先                  | 回退              |
| 数据类目是**互联网平台/App**     | ✅ 优先                  | 回退              |
| 数据类目是**汽车品牌**           | ✅ 优先                  | 回退              |
| 数据类目是通用名词（手机、食品） | ❌                       | ✅                |
| 数据类目是国家/国旗              | ❌                       | ✅                |
| 数据类目是编程语言/技术          | ❌                       | ✅（devicon）     |

**判断规则**：如果类目是一个可以在互联网上搜到官方网站的商业实体（公司/品牌/平台），就使用此流程。

---

## 步骤 1：识别品牌类目

从 schema 的 `data` 中提取品牌名列表：

```javascript
// schema.data = [{ name: "比亚迪", value: 35 }, { name: "蔚来", value: 30 }, ...]
// → brands = ["比亚迪", "蔚来", ...]
```

**确认所有类目都是品牌**：如果混合了品牌和非品牌（如 "其他"、"合计"），非品牌类目不参与品牌 Logo 搜索。

---

## 步骤 2：构造搜索参数

### 2.1 中文品牌 → 英文搜索名映射

脚本内置了常见中文品牌映射（汽车、科技、互联网、消费品等），可自动识别。如果品牌不在内置列表中，需要手动提供 `--search-names` 参数：

```bash
# 内置品牌（无需额外参数，自动识别）
# 比亚迪 → BYD, 蔚来 → NIO, 华为 → Huawei, 微信 → WeChat ...

# 非内置品牌（需手动指定搜索名）
--search-names '{"极氪":"Zeekr","智己":"IM Motors","岚图":"Voyah"}'
```

### 2.2 已知域名辅助验证（可选）

如果已知品牌域名，可通过 `--domains` 辅助验证搜索结果的准确性。脚本会在搜索结果中优先匹配该域名对应的品牌：

```bash
--domains '{"比亚迪":"byd.com","蔚来":"nio.com","小鹏":"xpeng.com"}'
```

> 注意：`--domains` 仅用于**验证搜索结果**，不跳过搜索。脚本始终通过搜索 API 获取可用的 icon URL。

---

## 步骤 3：调用脚本获取 Logo

> 🚨 **必须通过终端执行脚本**，禁止手动拼接 Brandfetch URL。

### 示例 A：中文品牌（内置映射，最简单）

```bash
python <SKILL_DIR>/scripts/fetch_brand_logos.py \
  --brands '["比亚迪","蔚来","小鹏","理想","领克"]'
```

### 示例 B：英文品牌（直接搜索）

```bash
python <SKILL_DIR>/scripts/fetch_brand_logos.py \
  --brands '["Apple","Google","Microsoft","Amazon","Meta"]'
```

### 示例 C：混合品牌 + 手动映射

```bash
python <SKILL_DIR>/scripts/fetch_brand_logos.py \
  --brands '["极氪","智己","岚图","比亚迪","蔚来"]' \
  --search-names '{"极氪":"Zeekr","智己":"IM Motors","岚图":"Voyah"}'
```

### 示例 D：域名验证（提高搜索准确性）

```bash
python <SKILL_DIR>/scripts/fetch_brand_logos.py \
  --brands '["比亚迪","蔚来","小鹏"]' \
  --domains '{"比亚迪":"byd.com","蔚来":"nio.com","小鹏":"xpeng.com"}'
```

**参数说明**：

| 参数             | 类型      | 说明                                              |
| ---------------- | --------- | ------------------------------------------------- |
| `--brands`       | JSON 数组 | 品牌名列表（必须）                                |
| `--search-names` | JSON 对象 | 品牌名 → 搜索词映射（非英文品牌推荐）             |
| `--domains`      | JSON 对象 | 品牌名 → 域名映射（可选，辅助验证搜索结果准确性） |
| `--client-id`    | 字符串    | Brandfetch Client ID（可选，搜索 API 不强制要求） |
| `--output`       | 字符串    | 输出 JSON 文件路径（默认 stdout）                 |

**脚本输出格式**：

```json
{
  "iconField": "iconKey",
  "map": {
    "比亚迪": "https://cdn.brandfetch.io/idLmxqpO1F/w/128/h/128/fallback/lettermark/icon.webp?c=...",
    "蔚来": "https://cdn.brandfetch.io/idXyz12345/w/128/h/128/fallback/lettermark/icon.webp?c=...",
    "小鹏": "https://cdn.brandfetch.io/idAbc67890/w/128/h/128/fallback/lettermark/icon.webp?c=..."
  },
  "source": "brandfetch",
  "details": [{ "brand": "比亚迪", "domain": "byd.com", "url": "...", "displayName": "BYD" }],
  "failed": []
}
```

> **URL 格式说明**：icon URL 由搜索 API 自动生成，包含 brandId（如 `idLmxqpO1F`）和鉴权 token（`?c=...`），格式为 128×128 WebP 图片。URL 可直接在浏览器和 VChart 中加载。

````

---

## 步骤 4：处理失败项

检查输出中的 `failed` 数组。如果有品牌未找到：

1. **检查拼写**：确认品牌名是否正确
2. **尝试手动指定搜索名**：用 `--search-names` 提供英文名
3. **尝试手动指定域名**：如果知道品牌官网，用 `--domains` 直接指定
4. **回退到 Iconify**：如果 Brandfetch 确实不收录该品牌，对失败的品牌使用 `fetch_icons.py` 从 `simple-icons` 图标集获取替代图标

### 回退示例

```bash
# 假设 "极越" 在 Brandfetch 中未找到，回退到 Iconify
python <SKILL_DIR>/scripts/fetch_icons.py \
  --categories '["极越"]' \
  --per-category-keywords '{"极越":"jiyue car"}' \
  --prefer-collection simple-icons
````

> ⚠️ **混合使用时注意**：如果部分品牌用 Brandfetch Logo、部分用 Iconify 图标，视觉风格可能不一致。建议要么全部用 Brandfetch，要么全部用 Iconify，避免混搭。

---

## 步骤 5：生成 icon 配置

将脚本输出集成到 schema 中，方式与 Iconify 图标相同：

### 5.1 在 data 中添加 iconKey 字段

```javascript
data: [
  { name: '比亚迪', value: 35, iconKey: '比亚迪' },
  { name: '蔚来', value: 30, iconKey: '蔚来' },
  // iconKey 值与 icon.map 的 key 对应
];
```

### 5.2 生成 icon 配置

```javascript
icon: {
  field: "iconKey",
  map: {
    "比亚迪": "https://cdn.brandfetch.io/idLmxqpO1F/w/128/h/128/fallback/lettermark/icon.webp?c=...",
    "蔚来": "https://cdn.brandfetch.io/idXyz12345/w/128/h/128/fallback/lettermark/icon.webp?c=...",
    "小鹏": "https://cdn.brandfetch.io/idAbc67890/w/128/h/128/fallback/lettermark/icon.webp?c=...",
    "理想": "https://cdn.brandfetch.io/idgFirWT1b/w/128/h/128/fallback/lettermark/icon.webp?c=...",
    "领克": "https://cdn.brandfetch.io/idDef11111/w/128/h/128/fallback/lettermark/icon.webp?c=..."
  },
  visible: true,
  position: "start",  // 根据图表类型选择，参考 subprocess-icon-generation.md 步骤 5.3
  size: 24
}
```

> **注意**：Brandfetch Logo 是彩色/多色的，**不需要**追加 `color` 参数。无论深色还是浅色主题，Logo 保持品牌原色。

### 5.3 icon.position 参考

与 Iconify 图标相同，参考 `subprocess-icon-generation.md` 步骤 5.3 的各图表类型推荐 position。

---

## 验证清单

| 检查项             | 要求                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| 品牌识别           | 所有数据类目确实是品牌/公司名                                                                                 |
| Logo 可用          | `failed` 数组为空，或已对失败项做了回退处理                                                                   |
| URL 格式正确       | URL 含 brandId 和 token（如 `/idXxx.../w/128/h/128/.../icon.webp?c=...`），不是旧格式 `/{domain}?c=...&t=...` |
| icon.field 有效    | 必须是 data 中存在的字段名                                                                                    |
| icon.map key 完整  | 每个数据项的 iconKey 值都有对应的 URL                                                                         |
| 无 color 参数      | Brandfetch Logo 不追加 `?color=` 参数（品牌 Logo 保持原色）                                                   |
| icon.position 有效 | 必须是该图表类型支持的 position 值                                                                            |
| 风格统一           | 所有 icon 均来自 Brandfetch（不与 Iconify 混用），或全部来自 Iconify                                          |

---

## Brandfetch 内置品牌映射参考

脚本已内置以下常见中文品牌的英文搜索名和域名映射，无需手动指定：

### 汽车品牌

比亚迪(byd.com)、蔚来(nio.com)、小鹏(xpeng.com)、理想(li.auto)、领克(lynkco.com)、吉利(geely.com)、长城(gwm.com.cn)、奇瑞(cheryinternational.com)、零跑(leapmotor.cn)、哪吒(netauto.com)、长安(changan.com.cn)、赛力斯(seres.cn)、鸿蒙智行(huawei.com)、上汽通用五菱(wuling.id)、极氪(zeekr.com)、智己(immotors.com)、岚图(voyah.com)、广汽埃安(aion.com.cn)、深蓝(deepal.com.cn)、特斯拉(tesla.com)、宝马(bmw.com)、奔驰(mercedes-benz.com)、奥迪(audi.com)、大众(volkswagen.com)、丰田(toyota.com)、本田(honda.com)、日产(nissan.com)、沃尔沃(volvo.com)、保时捷(porsche.com)

### 科技品牌

苹果(apple.com)、华为(huawei.com)、小米(xiaomi.com)、OPPO(oppo.com)、vivo(vivo.com)、荣耀(honor.com)、联想(lenovo.com)、三星(samsung.com)、谷歌(google.com)、微软(microsoft.com)

### 互联网/社交

微信(wechat.com)、抖音(tiktok.com)、微博(weibo.com)、小红书(xiaohongshu.com)、淘宝(taobao.com)、京东(jd.com)、拼多多(pinduoduo.com)、美团(meituan.com)、百度(baidu.com)、腾讯(tencent.com)、阿里巴巴(alibaba.com)、字节跳动(bytedance.com)、哔哩哔哩/B站(bilibili.com)

### 消费品牌

耐克(nike.com)、阿迪达斯(adidas.com)、可口可乐(coca-cola.com)、星巴克(starbucks.com)、麦当劳(mcdonalds.com)
