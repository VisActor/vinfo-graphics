# Icon 查询流程

> **何时使用**：用户需要搜索、添加或修改图标（icon）时。

---

## Iconify API 说明

本 skill 使用 Iconify API 搜索图标：

- **免费**：无需 API Key
- **搜索 API**：`https://api.iconify.design/search?query={keyword}&limit=999`
- **图标 URL**：`https://api.iconify.design/{collection}/{icon}.svg`

---

## Icon 查询流程

### 步骤 1：理解用户需求

分析用户描述，提取关键词：

| 用户表述示例                   | 提取的关键词           | 建议搜索词             |
| ------------------------------ | ---------------------- | ---------------------- |
| "找一个手机的图标"             | 手机                   | phone, mobile          |
| "给微信加个图标"               | 微信                   | wechat, chat           |
| "搜索一个金钱相关的图标"       | 金钱                   | money, dollar, coin    |
| "需要一个箭头的图标"           | 箭头                   | arrow                  |
| "找一个表示增长的图标"         | 增长                   | growth, chart, up      |
| "给产品加个星星图标"           | 星星                   | star                   |
| "需要一个用户的图标"           | 用户                   | user, person           |

---

### 步骤 2：调用 Iconify 搜索 API

使用 WebFetch 工具调用搜索 API：

```
https://api.iconify.design/search?query={keyword}&limit=999
```

**API 响应格式**：

```json
{
  "icons": [
    "mdi:phone",
    "mdi:cellphone",
    "fa:mobile",
    "bi:phone",
    ...
  ]
}
```

---

### 步骤 3：筛选和推荐图标

**3.1 常用图标集合优先级**：

| 优先级 | 集合名称    | 前缀     | 说明                   |
| ------ | ----------- | -------- | ---------------------- |
| 1      | Material Design Icons | `mdi` | Google 风格，图标丰富  |
| 2      | Font Awesome | `fa`    | 经典图标库             |
| 3      | Bootstrap Icons | `bi`  | Bootstrap 风格         |
| 4      | Carbon | `carbon` | IBM 设计风格           |
| 5      | Tabler Icons | `tabler` | 简洁现代风格          |

**3.2 推荐格式**：

向用户展示搜索结果时，优先推荐常用集合的图标：

```markdown
## Icon 搜索结果

为您找到以下图标（点击可预览）：

| 图标 | URL | 预览 |
| ---- | --- | ---- |
| 手机 | `https://api.iconify.design/mdi/phone.svg` | ![](https://api.iconify.design/mdi/phone.svg) |
| 移动电话 | `https://api.iconify.design/mdi/cellphone.svg` | ![](https://api.iconify.design/mdi/cellphone.svg) |
| 手机 | `https://api.iconify.design/bi/phone.svg` | ![](https://api.iconify.design/bi/phone.svg) |
```

---

### 步骤 4：集成到 Schema

用户选择图标后，将其集成到 schema 中：

**4.1 Pie Chart Icon 配置**：

```json
{
  "icon": {
    "field": "icon",
    "map": {
      "产品A": "https://api.iconify.design/mdi/star.svg",
      "产品B": "https://api.iconify.design/mdi/heart.svg"
    },
    "position": "outside",
    "visible": true,
    "size": 24
  }
}
```

**4.2 Bar/Column Chart Icon 配置**：

```json
{
  "icon": {
    "field": "icon",
    "map": {
      "产品A": "https://api.iconify.design/mdi/star.svg",
      "产品B": "https://api.iconify.design/mdi/heart.svg"
    },
    "position": "start",
    "visible": true,
    "size": 24
  }
}
```

**4.3 更新 data 数组**：

确保 data 中包含对应的 icon 字段：

```json
{
  "data": [
    { "name": "产品A", "value": 30, "icon": "产品A" },
    { "name": "产品B", "value": 25, "icon": "产品B" }
  ]
}
```

---

## 常用 Icon 推荐

以下是一些常用场景的推荐图标：

### 数据可视化相关

| 用途       | 推荐图标                                                |
| ---------- | ------------------------------------------------------- |
| 增长/上升  | `mdi:trending-up`, `mdi:arrow-up`, `mdi:chart-line`     |
| 下降       | `mdi:trending-down`, `mdi:arrow-down`                   |
| 图表       | `mdi:chart-bar`, `mdi:chart-pie`, `mdi:chart-areas`     |
| 数据       | `mdi:database`, `mdi:chart-box`                         |

### 社交媒体

| 平台       | 推荐图标                                                |
| ---------- | ------------------------------------------------------- |
| 微信       | `mdi:wechat`, `fa:weixin`                               |
| 微博       | `mdi:sina-weibo`, `fa:weibo`                            |
| 抖音       | `bi:tiktok`                                             |
| Twitter    | `mdi:twitter`, `fa:twitter`                             |
| Facebook   | `mdi:facebook`, `fa:facebook`                           |

### 商务相关

| 用途       | 推荐图标                                                |
| ---------- | ------------------------------------------------------- |
| 金钱       | `mdi:cash`, `mdi:currency-usd`, `fa:money`              |
| 用户       | `mdi:account`, `mdi:account-group`, `fa:user`           |
| 购物       | `mdi:cart`, `mdi:shopping`, `fa:shopping-cart`          |
| 时间       | `mdi:clock`, `mdi:calendar`, `fa:clock`                 |

### 通用图标

| 用途       | 推荐图标                                                |
| ---------- | ------------------------------------------------------- |
| 星星/评分  | `mdi:star`, `mdi:star-outline`, `fa:star`               |
| 心形/喜欢  | `mdi:heart`, `mdi:heart-outline`, `fa:heart`            |
| 对勾/完成  | `mdi:check`, `mdi:check-circle`, `fa:check`             |
| 警告       | `mdi:alert`, `mdi:alert-circle`, `fa:exclamation-triangle` |

---

## Icon 位置配置

不同图表类型支持不同的 icon 位置：

### Pie Chart

| position 值       | 说明                           |
| ----------------- | ------------------------------ |
| `inside`          | 扇区中心点                     |
| `inside-inner`    | 扇区内部靠近圆心的位置         |
| `inside-outer`    | 扇区内部靠近外侧的位置         |
| `outside`         | 扇区外侧                       |

### Bar Chart

| position 值 | 说明               |
| ----------- | ------------------ |
| `start`     | 条形起始位置（左侧） |
| `end`       | 条形结束位置（右侧） |

### Column Chart

| position 值 | 说明               |
| ----------- | ------------------ |
| `bottom`    | 柱子底部（X轴上方） |
| `top`       | 柱子顶部           |

### Area Chart

| position 值 | 说明         |
| ----------- | ------------ |
| `top`       | 数据点上方   |
| `bottom`    | 数据点下方   |

### Treemap / CirclePacking

| position 值       | 说明       |
| ----------------- | ---------- |
| `top-left`        | 左上角     |
| `top-right`       | 右上角     |
| `center`          | 中心       |
| `bottom-left`     | 左下角（仅 treemap） |
| `bottom-right`    | 右下角（仅 treemap） |

---

## 注意事项

1. **URL 格式**：使用完整的 Iconify API URL，格式为 `https://api.iconify.design/{collection}/{icon}.svg`
2. **key 匹配**：`icon.map` 中的 key 必须与 data 中对应字段的值完全匹配
3. **size 设置**：默认 size 为 24，可根据需要调整
4. **缓存考虑**：相同的 icon URL 会被浏览器缓存，可以重复使用
