# Column 柱状图生成规则

> 生成或编辑 column 柱状图时，必须遵守以下规则。
> 参考信息图风格：渐变色柱体 + 人物/主题装饰图 + 醒目数值标签 + 主题色背景。

---

## 规则 1：icon、label 位置不可重叠

column 图中 icon 和 label 都沿柱子纵向放置，需要确保二者位置互不冲突。

**icon position 可选值**：`bottom` | `top`
**label position 可选值**：`middle` | `inside-top` | `inside-bottom` | `top` | `bottom`

### 推荐搭配

| icon.position | label.position | 说明                                               |
| ------------- | -------------- | -------------------------------------------------- |
| `bottom`      | `top`          | icon 在柱底（X 轴上方），label 在柱顶 — **最常用** |
| `bottom`      | `inside-top`   | icon 在柱底，label 在柱体内顶部                    |
| `bottom`      | `middle`       | icon 在柱底，label 在柱体正中                      |
| `top`         | `inside-top`   | icon 在柱顶，label 在柱体内顶部                    |
| `top`         | `middle`       | icon 在柱顶，label 在柱体正中                      |
| `top`         | `bottom`       | icon 在柱顶，label 在柱底                          |

### 禁止搭配

| icon.position | label.position | 原因               |
| ------------- | -------------- | ------------------ |
| `bottom`      | `bottom`       | 二者都在柱底，重叠 |
| `top`         | `top`          | 二者都在柱顶，重叠 |

### icon 自带 label

column 的 icon 配置自带 `icon.label` 子字段（紧跟 icon 显示），如果已启用 `icon.label.visible: true`，则**不要**再额外设置顶层 `label` 字段（或设 `label.visible: false`），避免双重标签重叠。

---

## 规则 2：强烈推荐使用 brandImage 装饰图

参考信息图中，**人物插画/主题图**叠加在柱子上方是核心视觉特色。column 图推荐配置 `brandImage`。

### 前景模式（asForeground: true）

当 brandImage 为人物插画或需要覆盖在柱子上方时，使用前景模式：

```json
{
  "brandImage": {
    "visible": true,
    "url": "https://images.unsplash.com/vector-xxx?w=400&h=400&fit=crop",
    "width": 300,
    "height": 400,
    "align": "center",
    "verticalAlign": "middle",
    "asForeground": true
  }
}
```

### 背景模式（asForeground: false）

当 brandImage 仅作为装饰背景时，使用背景模式：

```json
{
  "brandImage": {
    "visible": true,
    "url": "https://images.unsplash.com/vector-xxx?w=400&h=400&fit=crop",
    "width": 200,
    "height": 200,
    "align": "right",
    "verticalAlign": "bottom",
    "asForeground": false
  }
}
```

### 选择策略

通过 **装饰插图子流程** (`references/workflows/subprocess-select-decoration.md`) 从预置装饰插图库 (`references/images/decorations.json`) 按 tags 语义匹配选择：

| 数据主题                 | brandImage 内容              | asForeground | align / verticalAlign | 说明                           |
| ------------------------ | ---------------------------- | ------------ | --------------------- | ------------------------------ |
| 人物数据（净资产、成就） | 从装饰插图库选择人物相关插图 | `true`       | `center` / `middle`   | 人物叠加在柱子前，视觉冲击力强 |
| 品牌/产品数据            | 从装饰插图库选择主题相关插图 | `false`      | `right` / `bottom`    | 低调装饰不遮挡数据             |
| 抽象/通用数据            | 从装饰插图库选择主题相关插图 | `false`      | `right` / `bottom`    | 轻装饰提升美感                 |

### 注意事项

- `asForeground: true` 时，brandImage 会遮挡部分柱子，确保 label 仍可读
- 前景模式下 brandImage 宽高建议不超过画布的 50%，避免完全遮挡数据
- 从装饰插图库 `references/images/decorations.json` 中按 tags 语义匹配选择与数据主题匹配的插图（详见 `references/workflows/subprocess-select-decoration.md`）

---

## 规则 3：推荐使用渐变色柱体

参考信息图中柱体使用渐变色（底部深 → 顶部浅），增强视觉层次。

### 渐变配置

```json
{
  "column": {
    "cornerRadius": [6, 6, 0, 0],
    "linearGradient": {
      "direction": "bottom-top",
      "colors": ["#4F46E5", "#818CF8"]
    }
  }
}
```

### 推荐渐变参数

| 参数        | 推荐值                                | 说明                                       |
| ----------- | ------------------------------------- | ------------------------------------------ |
| `direction` | `"bottom-top"`                        | 柱图推荐底部深 → 顶部浅，增强层次感        |
| `colors`    | 双色数组，如 `["#4F46E5", "#818CF8"]` | 第一个为起始色（深），第二个为结束色（浅） |

### 配合圆角

渐变柱体推荐配合顶部圆角 `cornerRadius: [4, 4, 0, 0]` ~ `[8, 8, 0, 0]`，现代感更强。

---

## 规则 4：label 建议显示在柱顶

参考信息图中，数值标签统一显示在柱顶（`position: "top"`），清晰易读。

### 推荐配置

```json
{
  "label": {
    "visible": true,
    "position": "top"
  }
}
```

### 各种 position 适用场景

| position        | 适用场景                    | 说明                     |
| --------------- | --------------------------- | ------------------------ |
| `top`           | **默认推荐** — 数值对比场景 | 柱顶显示数值，最直观     |
| `inside-top`    | 柱子较高且数值不长时        | 嵌入柱体内顶部，整洁感强 |
| `middle`        | 柱子较宽且数值不长时        | 嵌入柱体正中             |
| `inside-bottom` | 需要强调底部数值时          | 嵌入柱体内底部           |
| `bottom`        | 配合 icon.position=top 时   | 底部补充标签             |

### 注意事项

- 当 `brandImage.asForeground = true` 时，部分柱顶 label 可能被遮挡 — 确保关键数据柱子不在遮挡区域，或使用 `inside` 位置
- label format 可加单位：如 `"{value}B"`（十亿）、`"{value}M"`（百万）、`"{value}K"`（千）

---

## 规则 5：推荐配置主题色背景

参考信息图中背景使用与数据主题呼应的纯色或渐变色（如暖粉色、深红金色），显著提升整体质感。

### 背景配置策略

| 数据风格                | background 推荐                     | 柱体 colors 配合                   | 参考效果     |
| ----------------------- | ----------------------------------- | ---------------------------------- | ------------ |
| 温暖/商务（如个人财富） | 暖色调背景 `#f5d5c8` ~ `#e8b4a0`    | 同色系深色柱 `#8b4513` ~ `#a0522d` | Adani 风格   |
| 热情/运动（如体育数据） | 深红/暗红背景 `#8b0000` ~ `#5c0000` | 金色/亮色柱 `#ffd700` ~ `#daa520`  | Ronaldo 风格 |
| 科技/数据               | 深蓝/暗色背景 `#1a1a2e` ~ `#16213e` | 亮蓝/青色柱 `#00d2ff` ~ `#3a7bd5`  | 科技风格     |
| 自然/环保               | 浅绿/米色背景 `#f0f4e8` ~ `#e8edd4` | 绿色系柱 `#2d5016` ~ `#4a7c25`     | 清新风格     |
| 中性/通用               | 浅灰/白色 `#f5f5f5` ~ `#ffffff`     | 多色系                             | 简洁商务     |

### 也可使用预置图片库背景图

从预置背景图片库 `references/images/images.json` 中按 keywords/tags 语义匹配选择（详见 `references/workflows/subprocess-select-background.md`）：

```json
{
  "background": {
    "image": "https://images.pexels.com/photos/xxx/pexels-photo-xxx.jpeg?w=1920&h=1080&fit=crop"
  }
}
```

使用背景图时，柱体颜色需要确保与背景有足够对比度。如预置图片库中没有匹配的图片，可仅使用纯色背景。

---

## 规则 6：柱体样式推荐

### column 配置推荐值

```json
{
  "column": {
    "cornerRadius": [6, 6, 0, 0],
    "gap": 8,
    "linearGradient": {
      "direction": "bottom-top",
      "colors": ["#4F46E5", "#818CF8"]
    }
  }
}
```

| 参数             | 推荐值                          | 说明                                                   |
| ---------------- | ------------------------------- | ------------------------------------------------------ |
| `cornerRadius`   | `[4, 4, 0, 0]` ~ `[8, 8, 0, 0]` | 顶部圆角，底部直角。四值顺序：[左上, 右上, 右下, 左下] |
| `gap`            | `4` ~ `12`                      | 柱间距。数据量多(>15)用小值，少(<8)用大值              |
| `width`          | 通常不设定，自动                | 仅在需要统一宽度时设置                                 |
| `linearGradient` | 见规则 3                        | 推荐使用，提升视觉层次                                 |

---

## 规则 7：X 轴标签处理（时间序列场景）

参考信息图中 X 轴为年份，标签倾斜 45° 显示以避免重叠 — 这是时间序列柱状图的常见需求。

### 推荐配置

当 X 轴类目较多（>8 个）或文字较长时：

```json
{
  "xAxis": {
    "label": {
      "visible": true,
      "style": {
        "angle": -45
      }
    }
  }
}
```

| X 轴类目数量 | 推荐处理                     | 说明             |
| ------------ | ---------------------------- | ---------------- |
| ≤ 8 个       | 不旋转（默认水平）           | 空间充足         |
| 9 ~ 15 个    | `angle: -45`                 | 倾斜显示避免重叠 |
| > 15 个      | `angle: -45` 或 `angle: -90` | 竖直显示         |

---

## 完整推荐配置参考

结合以上所有规则的典型 column 配置骨架：

```json
{
  "chartType": "column",
  "title": { "text": "人物名称", "position": "center" },
  "footnote": { "text": "Source: xxx | Data: as of 2026 | Amount: USD Billions" },
  "data": [...],
  "width": 800,
  "height": 600,
  "categoryField": "year",
  "valueField": "amount",
  "background": { "color": "#f5d5c8" },
  "theme": "light",
  "colors": ["#8b4513"],
  "column": {
    "cornerRadius": [6, 6, 0, 0],
    "gap": 8,
    "linearGradient": {
      "direction": "bottom-top",
      "colors": ["#8b4513", "#c97b45"]
    }
  },
  "label": { "visible": true, "position": "top" },
  "icon": { "visible": true, "position": "bottom", "field": "iconKey", "map": {...} },
  "brandImage": {
    "visible": true,
    "url": "...",
    "width": 300,
    "height": 400,
    "align": "center",
    "verticalAlign": "middle",
    "asForeground": true
  },
  "xAxis": { "label": { "visible": true, "style": { "angle": -45 } } },
  "sort": "none"
}
```
