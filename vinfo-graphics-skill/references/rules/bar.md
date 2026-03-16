# Bar 条形图生成规则

> 生成或编辑 bar 条形图时，必须遵守以下规则。

---

## 规则 1：icon、label 位置不可重叠

bar 图中 icon 和 label 都沿条形放置，需要确保二者位置互不冲突。

**icon position 可选值**：`start` | `end`
**label position 可选值**：`inside` | `inside-left` | `inside-right` | `outside` | `left` | `right` | `top` | `bottom` 等

### 推荐搭配

| icon.position | label.position                                  | 说明                                |
| ------------- | ----------------------------------------------- | ----------------------------------- |
| `start`       | `inside` / `inside-right` / `outside` / `right` | icon 在左侧，label 在条形内部或右侧 |
| `end`         | `inside` / `inside-left` / `left`               | icon 在右侧，label 在条形内部或左侧 |

### 禁止搭配

| icon.position | label.position      | 原因                   |
| ------------- | ------------------- | ---------------------- |
| `start`       | `left`              | 二者都在条形左侧，重叠 |
| `end`         | `right` / `outside` | 二者都在条形右侧，重叠 |

### icon 自带 label

bar 的 icon 配置自带 `icon.label` 子字段（紧跟在 icon 后显示），如果已启用 `icon.label.visible: true`，则**不要**再额外设置顶层 `label` 字段（或设 `label.visible: false`），避免双重标签重叠。

---

## 规则 2：rank 位置不可与 icon、label 重叠

**rank position 可选值**：`start` | `end` | `yAxis`

### 推荐搭配（三者不冲突）

| icon.position | rank.position | label.position       | 说明                                           |
| ------------- | ------------- | -------------------- | ---------------------------------------------- |
| `start`       | `yAxis`       | `inside` / `outside` | icon 条形左侧，rank 在 Y 轴，label 在条形内/右 |
| `start`       | `end`         | `inside`             | icon 在左侧，rank 在右侧，label 在条形内部     |
| `end`         | `start`       | `inside`             | icon 在右侧，rank 在左侧，label 在条形内部     |
| `end`         | `yAxis`       | `inside` / `left`    | icon 在右侧，rank 在 Y 轴，label 在条形内/左   |

### 禁止搭配

- `icon.position` 和 `rank.position` **不可相同**（都是 `start` 或都是 `end`）
- `rank.position` 不可与 `label.position` 在同一侧（如 rank=`start` 且 label=`left`）

---

## 规则 3：尽量生成 background 或 brandImage

生成 bar 条形图时，**推荐**配置以下装饰元素之一以增强视觉效果：

### background（整体背景）

通过 **图片子流程** (`references/workflows/subprocess-image.md`) 从预置图片库获取与数据主题相关的背景图片：

```json
{
  "background": {
    "image": "https://cdn.pixabay.com/photo/xxx/xxx_1280.jpg"
  }
}
```

### brandImage（装饰图片）

使用预置图片库中的插图或主题相关图片作为装饰：

```json
{
  "brandImage": {
    "visible": true,
    "url": "https://pixabay.com/get/xxx_1280.png",
    "width": 200,
    "height": 200,
    "align": "right",
    "verticalAlign": "bottom",
    "asForeground": false
  }
}
```

**选择原则**：

- 数据主题明确时（如科技、金融、自然）→ 优先使用 `background`，从 `images.json` 的 `backgrounds` 分类中选择
- 需要装饰元素时 → 使用 `brandImage`，从 `images.json` 的 `illustrations` 分类中选择
- 两者可以同时使用，`brandImage` 默认作为背景层不遮挡图表
- 如果预置图片库中没有匹配的主题，可以跳过图片配置
