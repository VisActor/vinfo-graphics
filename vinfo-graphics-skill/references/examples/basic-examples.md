# 基础示例

本文档包含各种图表类型的基础示例，可直接复制使用。

---

## Pie Chart 示例

### 基础饼图
```json
{
  "chartType": "pie",
  "title": "市场份额分布",
  "data": [
    { "name": "产品A", "value": 35 },
    { "name": "产品B", "value": 25 },
    { "name": "产品C", "value": 20 },
    { "name": "其他", "value": 20 }
  ],
  "categoryField": "name",
  "valueField": "value",
  "theme": "fresh"
}
```

### 环形图
```json
{
  "chartType": "pie",
  "title": "市场份额分布",
  "data": [
    { "name": "产品A", "value": 35 },
    { "name": "产品B", "value": 25 },
    { "name": "产品C", "value": 20 },
    { "name": "其他", "value": 20 }
  ],
  "categoryField": "name",
  "valueField": "value",
  "innerRadius": 0.6,
  "theme": "fresh"
}
```

---

## Bar Chart 示例
### 基础条形图
```json
{
  "chartType": "bar",
  "title": "各平台用户数排名",
  "data": [
    { "platform": "微信", "users": 1200 },
    { "platform": "抖音", "users": 800 },
    { "platform": "微博", "users": 600 },
    { "platform": "小红书", "users": 500 },
    { "platform": "知乎", "users": 300 }
  ],
  "categoryField": "platform",
  "valueField": "users",
  "sort": "desc",
  "theme": "fresh"
}
```

### 带排名的条形图
```json
{
  "chartType": "bar",
  "title": "销售排行榜",
  "data": [
    { "name": "张三", "sales": 15000 },
    { "name": "李四", "sales": 12000 },
    { "name": "王五", "sales": 10000 },
    { "name": "赵六", "sales": 8000 }
  ],
  "categoryField": "name",
  "valueField": "sales",
  "sort": "desc",
  "rank": {
    "visible": true,
    "position": "start"
  },
  "bar": {
    "cornerRadius": 4
  },
  "theme": "fresh"
}
```

---

## Column Chart 示例
### 基础柱状图
```json
{
  "chartType": "column",
  "title": "月度销售额",
  "data": [
    { "month": "1月", "sales": 120 },
    { "month": "2月", "sales": 150 },
    { "month": "3月", "sales": 180 },
    { "month": "4月", "sales": 160 },
    { "month": "5月", "sales": 200 }
  ],
  "categoryField": "month",
  "valueField": "sales",
  "column": {
    "cornerRadius": [4, 4, 0, 0]
  },
  "theme": "fresh"
}
```

### 带渐变的柱状图
```json
{
  "chartType": "column",
  "title": "季度收入",
  "data": [
    { "quarter": "Q1", "revenue": 1000 },
    { "quarter": "Q2", "revenue": 1200 },
    { "quarter": "Q3", "revenue": 1500 },
    { "quarter": "Q4", "revenue": 1800 }
  ],
  "categoryField": "quarter",
  "valueField": "revenue",
  "column": {
    "width": 50,
    "cornerRadius": [8, 8, 0, 0],
    "linearGradient": {
      "direction": "bottom-top",
      "colors": ["#1bcebf", "#3370eb"]
    }
  },
  "theme": "fresh"
}
```

---

## Area Chart 示例
### 基础面积图
```json
{
  "chartType": "area",
  "title": "用户增长趋势",
  "data": [
    { "month": "1月", "users": 1000 },
    { "month": "2月", "users": 1200 },
    { "month": "3月", "users": 1500 },
    { "month": "4月", "users": 1800 },
    { "month": "5月", "users": 2200 },
    { "month": "6月", "users": 2500 }
  ],
  "categoryField": "month",
  "valueField": "users",
  "area": {
    "smooth": true,
    "opacity": 0.6
  },
  "point": {
    "visible": true
  },
  "theme": "fresh"
}
```

### 带标注的面积图
```json
{
  "chartType": "area",
  "title": "销售趋势",
  "data": [
    { "month": "1月", "sales": 120 },
    { "month": "2月", "sales": 150 },
    { "month": "3月", "sales": 180 },
    { "month": "4月", "sales": 160 },
    { "month": "5月", "sales": 200 },
    { "month": "6月", "sales": 250 }
  ],
  "categoryField": "month",
  "valueField": "sales",
  "area": {
    "smooth": true,
    "opacity": 0.5
  },
  "annotationHorizontalLine": [
    {
      "yValue": 180,
      "text": "目标线",
      "lineStyle": "dashed",
      "lineColor": "#ff6b6b"
    }
  ],
  "annotationPoint": [
    {
      "value": "6月",
      "text": "峰值",
      "textBackgroundColor": "#3370eb"
    }
  ],
  "theme": "fresh"
}
```

---

## Treemap 示例
### 基础矩阵树图
```json
{
  "chartType": "treemap",
  "title": "部门预算分布",
  "data": [
    { "dept": "研发部", "budget": 500 },
    { "dept": "市场部", "budget": 300 },
    { "dept": "销售部", "budget": 200 },
    { "dept": "人事部", "budget": 100 },
    { "dept": "财务部", "budget": 80 }
  ],
  "categoryField": "dept",
  "valueField": "budget",
  "node": {
    "gap": 2,
    "cornerRadius": 4
  },
  "theme": "fresh"
}
```

### 分组矩阵树图
```json
{
  "chartType": "treemap",
  "title": "公司预算分布",
  "data": [
    { "dept": "研发", "company": "A公司", "budget": 500 },
    { "dept": "市场", "company": "A公司", "budget": 300 },
    { "dept": "研发", "company": "B公司", "budget": 400 },
    { "dept": "市场", "company": "B公司", "budget": 250 }
  ],
  "categoryField": "dept",
  "valueField": "budget",
  "groupField": "company",
  "node": {
    "gap": 4,
    "padding": 8,
    "cornerRadius": 6
  },
  "theme": "fresh"
}
```

---

## CirclePacking 示例
### 基础圆形闭包图
```json
{
  "chartType": "circlePacking",
  "title": "产品销售分布",
  "data": [
    { "product": "手机", "sales": 1200 },
    { "product": "电脑", "sales": 800 },
    { "product": "平板", "sales": 600 },
    { "product": "耳机", "sales": 400 },
    { "product": "手表", "sales": 300 }
  ],
  "categoryField": "product",
  "valueField": "sales",
  "circle": {
    "padding": 4,
    "strokeWidth": 2,
    "strokeColor": "#fff"
  },
  "theme": "fresh"
}
```

### 分组圆形闭包图
```json
{
  "chartType": "circlePacking",
  "title": "公司销售分布",
  "data": [
    { "product": "手机", "company": "A公司", "sales": 1000 },
    { "product": "电脑", "company": "A公司", "sales": 800 },
    { "product": "手机", "company": "B公司", "sales": 600 },
    { "product": "电脑", "company": "B公司", "sales": 500 }
  ],
  "categoryField": "product",
  "valueField": "sales",
  "groupField": "company",
  "circle": {
    "padding": 8,
    "strokeWidth": 2,
    "strokeColor": "#e0e0e0"
  },
  "theme": "fresh"
}
```
