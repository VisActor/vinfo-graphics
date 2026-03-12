# 场景三处理流程：信息图诊断

> **何时进入此流程**：用户反馈信息图有问题（不显示、报错、显示异常等）。

---

## 诊断流程

### 步骤 1：收集问题信息

**需要确认的信息**：
1. 问题现象：不显示？报错？显示异常？
2. 错误信息：控制台是否有报错？
3. 当前 schema：用户正在使用的配置

---

### 步骤 2：常见问题检查

**2.1 图表不显示**

| 可能原因                 | 检查方法                                  | 解决方案                               |
| ------------------------ | ----------------------------------------- | -------------------------------------- |
| chartType 缺失或错误     | 检查 schema 是否包含 chartType            | 添加/修正 chartType 字段               |
| data 为空或格式错误      | 检查 data 是否为非空数组                  | 确保 data 是扁平数组                   |
| categoryField 不存在     | 检查 categoryField 是否在 data 字段中     | 修正 field 名称或添加数据字段          |
| valueField 不存在        | 检查 valueField 是否在 data 字段中        | 修正 field 名称或添加数据字段          |
| 图表容器尺寸为 0         | 检查 width/height 是否设置                | 设置合理的 width/height                |

**2.2 验证错误**

| 错误信息                         | 可能原因                       | 解决方案                               |
| -------------------------------- | ------------------------------ | -------------------------------------- |
| "chartType is required"          | 缺少 chartType 字段            | 添加 chartType                         |
| "data is required"               | 缺少 data 字段                 | 添加 data 数组                         |
| "Invalid chartType"              | chartType 值不在支持列表中     | 使用支持的图表类型                     |
| "categoryField is required"      | 缺少 categoryField             | 添加 categoryField                     |
| "valueField is required"         | 缺少 valueField                | 添加 valueField                        |
| "innerRadius must be 0-1"        | innerRadius 超出范围           | 设置 0-1 之间的值                      |

**2.3 显示异常**

| 问题现象                   | 可能原因                       | 解决方案                               |
| -------------------------- | ------------------------------ | -------------------------------------- |
| 图例显示不全               | colors 颜色数量不足            | 添加更多颜色                           |
| 标签重叠                   | 数据项太多                     | 设置 label.minVisible 或减少数据       |
| Icon 不显示                | icon.map 中的 key 与数据不匹配 | 检查 map 的 key 是否对应数据值         |
| 背景图不显示               | URL 无效或图片加载失败         | 使用有效的图片 URL                     |
| 颜色显示错误               | colors 格式不正确              | 使用有效的颜色字符串数组               |

---

### 步骤 3：Schema 结构检查

**必填字段检查**：

```javascript
// 所有图表类型都必须包含
{
  chartType: string,      // 必填
  data: array,            // 必填
  categoryField: string,  // 必填
  valueField: string      // 必填
}
```

**字段名一致性检查**：

```javascript
// 示例：确保字段名匹配
const schema = {
  data: [
    { productName: "A", salesValue: 100 }  // 注意字段名
  ],
  categoryField: "productName",  // 必须与 data 中的字段名一致
  valueField: "salesValue"       // 必须与 data 中的字段名一致
};
```

**常见拼写错误**：

| 错误写法              | 正确写法             |
| --------------------- | -------------------- |
| `charttype`           | `chartType`          |
| `categoryfield`       | `categoryField`      |
| `valuefield`          | `valueField`         |
| `groupfield`          | `groupField`         |
| `innerradius`         | `innerRadius`        |
| `outerradius`         | `outerRadius`        |

---

### 步骤 4：输出诊断结果

**标准输出格式**：

```markdown
## 诊断结果

**问题原因**：[描述发现的问题]

**修复建议**：
1. [具体修复步骤]
2. [具体修复步骤]

**修复后的 Schema**：

\`\`\`json
[修复后的完整 schema]
\`\`\`
```

---

## 常见问题示例

### 问题 1：图表不显示

**用户反馈**："图表不显示，只有空白"

**诊断过程**：
1. 检查 schema → 发现缺少 categoryField
2. 确认 data 中的字段名 → "name"
3. 添加 categoryField

**解决方案**：
```json
{
  "chartType": "pie",
  "data": [...],
  "categoryField": "name",  // 添加此字段
  "valueField": "value"
}
```

### 问题 2：Icon 不显示

**用户反馈**："配置了 icon 但是不显示"

**诊断过程**：
1. 检查 icon 配置 → icon.map 中的 key 是 "A"
2. 检查 data → data 中的值是 "产品A"
3. 发现 key 不匹配

**解决方案**：
```json
{
  "data": [
    { "name": "产品A", "value": 30 }
  ],
  "icon": {
    "field": "name",
    "map": {
      "产品A": "https://..."  // 确保 key 与数据值匹配
    }
  }
}
```

### 问题 3：验证错误

**用户反馈**："Schema 验证失败，innerRadius 报错"

**诊断过程**：
1. 检查 innerRadius 值 → 发现是 50
2. 查阅类型定义 → innerRadius 应为 0-1 之间的比例值

**解决方案**：
```json
{
  "chartType": "pie",
  "innerRadius": 0.5  // 改为比例值，表示 50%
}
```

---

## 预防性检查清单

在生成或编辑 schema 时，使用此清单进行预防性检查：

| 检查项                    | 说明                                      |
| ------------------------- | ----------------------------------------- |
| chartType 存在且有效      | 必须是 pie/bar/column/area/treemap/circlePacking |
| data 是非空数组           | 至少包含 1 条数据记录                     |
| categoryField 存在        | 与 data 中的字段名完全一致                |
| valueField 存在           | 与 data 中的字段名完全一致                |
| 数值字段为数字类型        | value 对应的字段值应为数字                |
| groupField（如有）存在    | 与 data 中的字段名完全一致                |
| innerRadius（如有）在范围内 | 0-1 之间的数值                          |
| colors（如有）格式正确    | 有效的颜色字符串数组                      |
| icon.map（如有）key 匹配  | 与 data 中对应的值匹配                    |
