# 子流程：Unsplash 背景/装饰图片

> **何时使用**：需要为信息图配置背景图片或装饰图片时。
> **图片来源**：预设 Unsplash 图片库 (`references/unsplash/images.json`)，确保可用性。

---

## 流程概览

1. 分析主题 → 根据数据内容和用户需求确定图片风格
2. 搜索图片 → 使用脚本或手动查阅图片库
3. 集成到 schema → 写入 background 或其他图片字段

---

## 步骤 1：分析主题

根据数据内容和用户意图推断所需的图片风格：

| 数据/用户意图        | 推荐分类     | 搜索关键词           |
| -------------------- | ------------ | -------------------- |
| 科技产品、互联网数据 | `technology` | 科技, 数据, 网络     |
| 商务报告、销售数据   | `business`   | 商务, 办公, 数据分析 |
| 环保、农业数据       | `nature`     | 自然, 绿色, 环保     |
| 城市、房产、交通     | `city`       | 城市, 建筑, 夜景     |
| 设计感、通用背景     | `abstract`   | 抽象, 渐变, 几何     |
| 节日促销、活动数据   | `festival`   | 节日, 庆祝, 灯光     |
| 金融、投资、理财     | `finance`    | 金融, 图表, 投资     |
| 教育、学校、培训     | `education`  | 教育, 学习, 书籍     |

**主题选择原则**：

- 深色主题 (`dark`, `dream`, `neon`) → 推荐 `technology`、`city`、`abstract` 分类
- 浅色主题 (`light`, `fresh`, `pastel`) → 推荐 `nature`、`business`、`abstract` 分类
- 背景图的色调应与主题颜色协调，避免冲突

---

## 步骤 2：搜索图片

### 方式 A：使用脚本（推荐）

```bash
# 按关键词搜索
python <SKILL_DIR>/scripts/fetch_unsplash.py \
  --keywords '["科技","数据"]' \
  --width 1920 --height 1080

# 按分类获取
python <SKILL_DIR>/scripts/fetch_unsplash.py \
  --category technology

# 获取多张图片
python <SKILL_DIR>/scripts/fetch_unsplash.py \
  --keywords '["商务","办公"]' --count 3

# 列出所有可用分类
python <SKILL_DIR>/scripts/fetch_unsplash.py --list-categories
```

**脚本输出格式**：

```json
[
  {
    "id": "1451187580459-43490279c0fa",
    "description": "数字地球网络，深蓝色科技感",
    "url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop",
    "category": "technology",
    "tags": ["科技", "网络", "数字", "蓝色"]
  }
]
```

### 方式 B：手动查阅图片库

直接读取 `references/unsplash/images.json`，从对应分类中选择：

```json
// images.json 结构
{
  "categories": {
    "technology": { "images": [...] },
    "business": { "images": [...] },
    "nature": { "images": [...] },
    "city": { "images": [...] },
    "abstract": { "images": [...] },
    "festival": { "images": [...] },
    "finance": { "images": [...] },
    "education": { "images": [...] }
  },
  "urlTemplate": "https://images.unsplash.com/photo-{id}?w=1920&h=1080&fit=crop"
}
```

---

## 步骤 3：集成到 Schema

### 3.1 作为背景图

```json
{
  "background": {
    "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop"
  }
}
```

### 3.2 背景图 + 半透明遮罩（推荐，提高可读性）

使用背景图时建议搭配主题，确保文字和图表元素的可读性。深色背景图搭配 `dark` 类主题，浅色背景图搭配 `light` 类主题。

### 3.3 作为脚注图片

```json
{
  "footnote": {
    "image": "https://images.unsplash.com/photo-xxx?w=64&h=64&fit=crop",
    "text": "数据来源：xxx",
    "layout": "image-left-text-right",
    "imageWidth": 24,
    "imageHeight": 24
  }
}
```

### 3.4 作为饼图中心图片（仅环形图）

```json
{
  "centerImage": {
    "src": "https://images.unsplash.com/photo-xxx?w=200&h=200&fit=crop",
    "width": 60,
    "height": 60
  }
}
```

---

## URL 参数说明

Unsplash 图片 URL 支持的参数：

| 参数  | 说明         | 示例                   |
| ----- | ------------ | ---------------------- |
| `w`   | 宽度（像素） | `w=1920`               |
| `h`   | 高度（像素） | `h=1080`               |
| `fit` | 裁剪方式     | `fit=crop`（居中裁剪） |

**常用尺寸**：

- 背景图：`w=1920&h=1080`
- 缩略图/小图：`w=200&h=200`
- 脚注 logo：`w=64&h=64`
