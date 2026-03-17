# 预置图片库

> **何时使用**：需要为信息图配置背景图片（background.image）或装饰图片（brandImage）时。
> **图片来源**：预置图片库 (`references/images/images.json`)，按主题分类。
> **核心原则**：优先匹配主题分类，并保证至少一项可视装饰（`background` 或 `brandImage`）。

---

## 原则

1. **优先精确匹配**：主题与预置分类匹配时优先使用对应图片
2. **分级回退**：无精确匹配时，回退到 `abstract`（背景）或 `business`（插图）
3. **至少一项装饰**：最终 schema 中 `background` 与 `brandImage` 不可同时缺失
4. **去重**：background 和 brandImage 使用不同图片，数据项之间图片也应不同

---

## 主题分类映射

根据数据主题确定使用哪个分类：

| 数据/用户意图        | 推荐分类        | 关键词                     |
| -------------------- | --------------- | -------------------------- |
| 科技产品、互联网数据 | `technology`    | 科技, 数据, 网络, AI, 芯片 |
| 商务报告、销售数据   | `business`      | 商务, 办公, 会议, 团队     |
| 环保、农业数据       | `nature`        | 自然, 绿色, 环保, 植物     |
| 城市、房产、交通     | `city`          | 城市, 建筑, 夜景, 交通     |
| 设计感、通用背景     | `abstract`      | 抽象, 渐变, 几何, 纹理     |
| 金融、投资、理财     | `finance`       | 金融, 股票, 投资, 货币     |
| 食品、餐饮、农业     | `food`          | 食物, 餐饮, 美食, 水果     |
| 体育、赛事、运动     | `sports`        | 体育, 运动, 比赛, 健身     |
| 医疗、健康、制药     | `healthcare`    | 医疗, 健康, 医生, 医院     |
| 能源、石油、电力     | `energy`        | 能源, 电力, 太阳能         |
| 汽车、交通出行       | `automotive`    | 汽车, 车辆, 交通           |
| 影视、音乐、娱乐     | `entertainment` | 电影, 音乐, 游戏           |
| 零售、电商、消费品   | `retail`        | 购物, 零售, 电商           |
| 教育、学校、培训     | `education`     | 教育, 学习, 书籍           |
| 奢侈品、高端消费     | `luxury`        | 奢侈品, 珠宝, 手表         |
| 旅游、酒店、度假     | `travel`        | 旅行, 旅游, 度假           |

---

## 背景图配置流程

### 步骤 1：确定主题分类

根据数据内容和用户意图选择最匹配的分类。

### 步骤 2：查表获取图片

从 `references/images/images.json` 的 `backgrounds.categories.{分类}.images` 中选择一张图片。

### 步骤 3：生成 URL

根据使用场景添加尺寸参数：

| 使用场景                    | 推荐尺寸                 |
| --------------------------- | ------------------------ |
| 背景图 (background.image)   | `w=1920&h=1080&fit=crop` |
| 节点背景 (nodeBackground)   | `w=600&h=400&fit=crop`   |
| 圆形背景 (circleBackground) | `w=300&h=300&fit=crop`   |
| 环形图中心 (centerImage)    | `w=300&h=300&fit=crop`   |
| 装饰图 (brandImage)         | `w=400&h=400&fit=crop`   |

### 步骤 4：集成到 Schema

```json
{
  "background": {
    "image": "https://cdn.pixabay.com/photo/xxx/xxx_1280.jpg"
  }
}
```

---

## 插图配置流程（BrandImage）

### 步骤 1：确定用途

- 装饰图表 → 使用 `illustrations` 分类
- 与主题相关 → 选择匹配分类

### 步骤 2：查表获取图片

从 `references/images/images.json` 的 `illustrations.categories.{分类}.images` 中选择。

### 步骤 3：集成到 Schema

```json
{
  "brandImage": {
    "visible": true,
    "url": "https://pixabay.com/get/xxx_1280.png",
    "width": 200,
    "height": 200,
    "align": "right",
    "verticalAlign": "top"
  }
}
```

---

## 去重校验

在将图片写入 schema 前，检查以下去重规则：

| 检查项                              | 操作         |
| ----------------------------------- | ------------ |
| background.image 与 brandImage 相同 | 替换其中一个 |
| 两个数据项使用相同图片              | 重新选择     |

---

## 不匹配时的处理（回退策略）

当数据主题与预置分类不匹配时：

1. **background 回退**：使用 `backgrounds.categories.abstract` 中的一张图
2. **brandImage 回退**：若需要插图，使用 `illustrations.categories.business` 或 `illustrations.categories.abstract`
3. **保底规则**：至少输出一项（`background.image` 或 `brandImage.url`），禁止二者同时为空

---

## 主题与背景图色调建议

| 主题类型                              | 推荐背景分类                                |
| ------------------------------------- | ------------------------------------------- |
| 深色主题 (`dark`, `dream`, `neon`)    | `technology`, `city`, `abstract`, `finance` |
| 浅色主题 (`light`, `fresh`, `pastel`) | `nature`, `business`, `abstract`, `food`    |

背景图的色调应与主题颜色协调，避免视觉冲突。
