# 场景二处理流程：信息图编辑

> **何时进入此流程**：对话中已存在 schema，用户要求修改。详细场景识别规则见 SKILL.md。

---

## 编辑操作分类

| 操作类别     | 常见用户表述示例                   | 处理方式                     |
| ------------ | ---------------------------------- | ---------------------------- |
| **添加元素** | "加个图标"、"添加脚注"、"加背景图" | 新增配置字段                 |
| **修改样式** | "改颜色"、"换主题"、"改成环形图"   | 修改现有字段值               |
| **删除元素** | "去掉图例"、"不要标签"、"删掉背景" | 删除/隐藏配置字段            |
| **切换类型** | "换成柱状图"、"改成条形图"         | 修改 chartType + 重建 schema |

---

## 标准编辑流程

### 步骤 1：提取现有 Schema

从对话历史中提取上一轮生成的 schema。如果对话历史中没有 schema，则转入场景一（生成）。

---

### 步骤 2：识别编辑意图

根据用户表述识别编辑操作类型：

**2.1 添加元素类**

| 用户表述   | 需要添加的配置     | 参考文档                           |
| ---------- | ------------------ | ---------------------------------- |
| "加个图标" | `icon` 配置        | `scenario-icon-query.md`           |
| "添加脚注" | `footnote` 配置    | `type-details/FootnoteConfig.md`   |
| "加背景图" | `background.image` | `type-details/BackgroundConfig.md` |
| "加标题"   | `title` 配置       | `type-details/TitleConfig.md`      |
| "加图例"   | `legend` 配置      | 对应图表类型定义                   |

**2.2 修改样式类**

| 用户表述     | 需要修改的配置                             | 参考文档                      |
| ------------ | ------------------------------------------ | ----------------------------- |
| "改颜色"     | `colors` 数组                              | `type-details/ThemeConfig.md` |
| "换主题"     | `theme` 字段                               | `type-details/ThemeConfig.md` |
| "改成环形图" | `innerRadius: 0.5+`                        | `top-keys/pie.json`           |
| "改圆角"     | `bar.cornerRadius` / `column.cornerRadius` | 对应图表类型定义              |
| "改成渐变"   | `linearGradient` 配置                      | 对应图表类型定义              |

**2.3 删除元素类**

| 用户表述   | 需要的操作                        |
| ---------- | --------------------------------- |
| "去掉图例" | `legend: {visible: false}` 或删除 |
| "不要标签" | `label: {visible: false}`         |
| "删掉背景" | 删除 `background` 字段            |
| "去掉脚注" | 删除 `footnote` 字段              |

**2.4 切换图表类型**

| 用户表述     | 操作方式                            |
| ------------ | ----------------------------------- |
| "换成柱状图" | `chartType: "column"` + 重建 schema |
| "改成条形图" | `chartType: "bar"` + 重建 schema    |
| "换成饼图"   | `chartType: "pie"` + 重建 schema    |

> **注意**：切换图表类型时，需要重新查阅对应的图表类型定义，确保字段结构正确。

---

### 步骤 3：查阅组件配置文档

对于不熟悉的配置项，必须查阅对应的组件文档：

- `references/top-keys/{chartType}.json` - 该图表类型可用顶层字段
- `references/type-details/TitleConfig.md` - 标题配置
- `references/type-details/FootnoteConfig.md` - 脚注配置
- `references/type-details/BackgroundConfig.md` - 背景配置
- `references/type-details/IconConfig.md` 与 `{Chart}IconConfig.md` - Icon 配置
- `references/type-details/ThemeConfig.md` - 主题配置

---

### 步骤 4：生成修改后的 Schema

**增量修改原则**：

- 保留原有配置中不需要修改的部分
- 只修改/添加/删除用户明确要求的部分
- 不主动添加用户未要求的配置

**示例**：

原始 schema：

```json
{
  "chartType": "pie",
  "data": [...],
  "categoryField": "name",
  "valueField": "value"
}
```

用户："加个脚注，数据来源是 2024 年报"

修改后：

```json
{
  "chartType": "pie",
  "data": [...],
  "categoryField": "name",
  "valueField": "value",
  "footnote": {
    "text": "数据来源：2024 年报"
  }
}
```

---

### 步骤 5：输出修改结果

**标准输出格式**：

```markdown
## 编辑结果

**修改内容**：[描述修改了什么]

**修改后的 Schema**：

\`\`\`json
[完整修改后的 schema]
\`\`\`

**生成命令**：

\`\`\`bash
python <SKILL_DIR>/scripts/generate_demo_html.py \
 --template <SKILL_DIR>/assets/template/demo.html \
 --title "[标题]" \
 --schema '[完整 schema JSON]' \
 --output "[文件名].html"
\`\`\`
```

---

## 常见编辑操作示例

### 添加 Icon

用户："给每个产品加个图标"

1. 执行 Icon 查询流程（`scenario-icon-query.md`）
2. 在 schema 中添加 `icon` 配置：

```json
{
  "icon": {
    "field": "icon",
    "map": {
      "产品A": "https://api.iconify.design/mdi/star.svg",
      "产品B": "https://api.iconify.design/mdi/heart.svg"
    },
    "position": "outside",
    "size": 24
  }
}
```

3. 在 data 中添加 icon 字段：

```json
{
  "data": [
    { "name": "产品A", "value": 30, "icon": "产品A" },
    { "name": "产品B", "value": 25, "icon": "产品B" }
  ]
}
```

### 切换为环形图

用户："改成环形图"

修改 schema：

```json
{
  "chartType": "pie",
  "innerRadius": 0.5
}
```

### 添加背景图片

用户："换个科技感的背景"

1. 查阅 `references/unsplash/images.json` 找到科技类图片
2. 修改 schema：

```json
{
  "background": {
    "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop"
  }
}
```

### 修改主题和颜色

用户："换成深色主题，用蓝色系的颜色"

```json
{
  "theme": "dark",
  "colors": ["#1e3a5f", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"]
}
```

---

## 注意事项

1. **不直接修改 HTML**：编辑操作必须修改 schema 后重新生成 HTML，不能直接修改已生成的 HTML 文件
2. **保持数据完整**：编辑时不要修改 data 数组中的数据内容，除非用户明确要求
3. **查阅文档**：对于不确定的配置项结构，必须查阅对应的类型定义或组件文档
4. **验证字段**：修改后确保所有字段名（categoryField、valueField 等）与 data 中的字段名一致
