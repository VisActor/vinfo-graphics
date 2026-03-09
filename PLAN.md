# 信息图图表库实现计划 v2

## 项目概述

基于 VChart 实现一个**信息图**图表库，提供极简的、大模型友好的 Schema。

### 信息图 vs BI 图表的区别

| 特性 | BI 图表 (VSeed) | 信息�� (本项目) |
|------|----------------|----------------|
| 定位 | 数据分析、交互探索 | 数据展示、视觉传达 |
| 复杂度 | 支持分组、堆叠、透视 | 单一数据系列，极简 |
| 视觉 | 功能导向 | 视觉丰富（背景图、icon） |
| 标题 | 固定位置 | 灵活布局（左/中/右） |
| 交互 | 丰富（下钻、联动） | 简单（hover 提示） |

---

## 支持的图表类型

| 图表类型 | chartType | 描述 | 特点 |
|---------|-----------|------|------|
| 饼图 | `pie` | 占比分布 | 环形图（通过 `innerRadius` 配置） |
| 条形图 | `bar` | 横向比较 | 带 icon、背景图、排序 |
| 柱图 | `column` | 纵向比较 | 简单对比 |
| 面积图 | `area` | 趋势累积 | 单系列，简洁 |
| 矩阵树图 | `treemap` | 占比分布 | 一层数据，支持 icon 和背景图 |
| 圆形闭包图 | `circlePacking` | 占比分布 | 一层数据，支持背景图 |

> **设计原则**：
> - 所有图表只支持**单系列数据**，不支持分组、堆叠、透视
> - 层级图表（treemap、circlePacking）只支持**一层数据**
> - 如需更复杂图表（玫瑰图、百分比面积图等），后续提供独立类型

### Schema 设计总结

| 图表 | chartType | 数据字段 | 样式容器 | 坐标轴 | 特色功能 |
|------|-----------|---------|---------|--------|---------|
| 饼图 | `pie` | `categoryField`, `valueField` | - | - | `innerRadius` |
| 条形图 | `bar` | `categoryField`, `valueField` | `bar` | `xAxis`, `yAxis` | `icon`, `sort` |
| 柱图 | `column` | `categoryField`, `valueField` | `column` | `xAxis`, `yAxis` | `sort` |
| 面积图 | `area` | `categoryField`, `valueField` | `area`, `line`, `point` | `xAxis`, `yAxis` | - |
| 矩阵树图 | `treemap` | `categoryField`, `valueField` | `node` | - | `icon`, `backgroundMap` |
| 圆形闭包图 | `circlePacking` | `categoryField`, `valueField` | `circle` | - | `backgroundMap` |

**公共配置（继承自 BaseChartSchema）**：
- `title`: string | TitleConfig
- `data`: DataItem[]
- `background`: BackgroundConfig
- `colors`: string[]
- `legend`: boolean | LegendConfig
- `label`: LabelConfig

**公共类型**：
- `TitleConfig`: 标题配置（支持位置）
- `BackgroundConfig`: 背景配置
- `LabelConfig`: 标签配置
- `AxisConfig`: 坐标轴配置
- `IconConfig`: Icon 映射配置
- `ImageMapConfig`: 背景图片映射配置

---

## Phase 1: Schema 设计

### 1.1 公共类型定义

```typescript
// ============== 基础 Schema ==============

/** 所有信息图的公共配置 */
interface BaseChartSchema {
  /** 图表类型 */
  chartType: ChartType;

  /** 图表标题 */
  title?: string | TitleConfig;

  /** 数据（扁平数组） */
  data: DataItem[];

  /** 尺寸 */
  width?: number;
  height?: number;

  /** 背景配置 */
  background?: BackgroundConfig;

  /** 颜色配置 */
  colors?: string[];

  /** 图例 */
  legend?: boolean | LegendConfig;
}

// ============== 公共组件类型 ==============

/** 标题配置 */
interface TitleConfig {
  text: string;
  position?: 'left' | 'center' | 'right';
  subtext?: string;
}

/** 背景配置（图表整体背景） */
interface BackgroundConfig {
  image?: string;    // 背景图片 URL
  color?: string;    // 背景色
  opacity?: number;  // 透明度 0-1
}

/** 图例配置 */
interface LegendConfig {
  visible?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

/** 标签配置（统一结构） */
interface LabelConfig {
  visible?: boolean;
  position?: string;        // 根据图表类型: 'inside' | 'outside' | 'top' | 'spider' 等
  format?: string;          // 格式化字符串，如 '{name}: {value}'
  minVisible?: number;      // 最小可见尺寸，小于此值不显示标签
}

/** 坐标轴配置 */
interface AxisConfig {
  visible?: boolean;
  format?: string;          // 如 '{value}万'
}

/** Icon 映射配置 */
interface IconConfig {
  field?: string;                              // 从 data 中读取的字段名
  map?: Record<string, string>;                // 分类值 -> image URL
  size?: number;                               // icon 尺寸
  position?: 'start' | 'end';                  // 位置（条形图）
}

/** 图片映射配置（用于 treemap/circlePacking 的节点背景） */
interface ImageMapConfig {
  field?: string;                              // 从 data 中读取的字段名
  map?: Record<string, string>;                // 分类值 -> image URL
  opacity?: number;                            // 透明度 0-1
}
```

### 1.2 饼图 Schema

> **设计原则**：信息图饼图保持简洁，不支持玫瑰图。如需玫瑰图，后续提供独立的 `rose` 类型。

```typescript
interface PieChartSchema extends BaseChartSchema {
  chartType: 'pie';

  /** 分类字段名 */
  categoryField: string;

  /** 数值字段名 */
  valueField: string;

  /** 内半径比例 0-1，默认 0（饼图），0.5+ 为环形图 */
  innerRadius?: number;

  /** 外半径比例 0-1，默认 0.8 */
  outerRadius?: number;

  /** 标签配置 */
  label?: LabelConfig & {
    position?: 'inside' | 'outside' | 'spider';
  };
}
```

**示例：**
```json
{
  "chartType": "pie",
  "title": "市场份额",
  "data": [
    { "name": "产品A", "value": 30 },
    { "name": "产品B", "value": 25 },
    { "name": "产品C", "value": 20 },
    { "name": "其他", "value": 25 }
  ],
  "categoryField": "name",
  "valueField": "value",
  "innerRadius": 0.5,
  "label": {
    "visible": true,
    "position": "outside",
    "format": "{name}: {value}%"
  }
}
```

### 1.3 条形图 Schema（信息图核心）

```typescript
interface BarChartSchema extends BaseChartSchema {
  chartType: 'bar';

  /** 分类字段名（Y轴） */
  categoryField: string;

  /** 数值字段名（X轴） */
  valueField: string;

  /** 条形样式 */
  bar?: {
    width?: number | string;
    cornerRadius?: number;
    gap?: number;
  };

  /** 标签配置 */
  label?: LabelConfig & {
    position?: 'inside' | 'outside';
  };

  /** Icon 配置 */
  icon?: IconConfig;

  /** 排序 */
  sort?: 'asc' | 'desc' | 'none';

  /** X 轴配置（数值轴） */
  xAxis?: AxisConfig;

  /** Y 轴配置（分类轴） */
  yAxis?: AxisConfig;
}
```

**示例：带 Icon 的条形图**
```json
{
  "chartType": "bar",
  "title": {
    "text": "各平台用户数",
    "position": "right"
  },
  "background": {
    "image": "/images/bg-blue.png",
    "opacity": 0.3
  },
  "data": [
    { "platform": "微信", "users": 1200, "icon": "wechat" },
    { "platform": "抖音", "users": 800, "icon": "douyin" },
    { "platform": "微博", "users": 600, "icon": "weibo" }
  ],
  "categoryField": "platform",
  "valueField": "users",
  "icon": {
    "field": "icon",
    "map": {
      "wechat": "/icons/wechat.png",
      "douyin": "/icons/douyin.png",
      "weibo": "/icons/weibo.png"
    },
    "size": 24,
    "position": "start"
  },
  "bar": {
    "cornerRadius": 4
  },
  "label": {
    "visible": true,
    "position": "outside",
    "format": "{value}万"
  },
  "sort": "desc"
}
```

### 1.4 柱图 Schema

```typescript
interface ColumnChartSchema extends BaseChartSchema {
  chartType: 'column';

  /** 分类字段名（X轴） */
  categoryField: string;

  /** 数值字段名（Y轴） */
  valueField: string;

  /** 柱子样式 */
  column?: {
    width?: number | string;
    cornerRadius?: number;
    gap?: number;
  };

  /** 标签配置 */
  label?: LabelConfig & {
    position?: 'inside' | 'top';
  };

  /** 排序 */
  sort?: 'asc' | 'desc' | 'none';

  /** X 轴配置（分类轴） */
  xAxis?: AxisConfig;

  /** Y 轴配置（数值轴） */
  yAxis?: AxisConfig;
}
```

**示例：**
```json
{
  "chartType": "column",
  "title": "月度销售额",
  "data": [
    { "month": "1月", "sales": 120 },
    { "month": "2月", "sales": 150 },
    { "month": "3月", "sales": 180 }
  ],
  "categoryField": "month",
  "valueField": "sales",
  "column": {
    "cornerRadius": 4
  },
  "label": {
    "visible": true,
    "position": "top",
    "format": "{value}万"
  },
  "yAxis": {
    "visible": true,
    "format": "{value}万"
  }
}
```

### 1.5 面积图 Schema

> **设计原则**：信息图面积图保持简洁，不支持堆叠、分组、百分比。
> 如需百分比面积图，后续提供独立的 `percentArea` 类型。

```typescript
interface AreaChartSchema extends BaseChartSchema {
  chartType: 'area';

  /** 分类字段名（X轴，通常是时间） */
  categoryField: string;

  /** 数值字段名（Y轴） */
  valueField: string;

  /** 面积样式 */
  area?: {
    smooth?: boolean;      // 平滑曲线
    opacity?: number;      // 填充透明度 0-1
  };

  /** 线条样式 */
  line?: {
    visible?: boolean;
    width?: number;
  };

  /** 数据点 */
  point?: {
    visible?: boolean;
    size?: number;
  };

  /** 标签配置 */
  label?: LabelConfig;

  /** X 轴配置（分类轴） */
  xAxis?: AxisConfig;

  /** Y 轴配置（数值轴） */
  yAxis?: AxisConfig;
}
```

**示例：**
```json
{
  "chartType": "area",
  "title": "用户增长趋势",
  "data": [
    { "month": "1月", "users": 1000 },
    { "month": "2月", "users": 1200 },
    { "month": "3月", "users": 1500 }
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
  "yAxis": {
    "format": "{value}人"
  }
}
```

### 1.6 矩阵树图 Schema

> **设计原则**：信息图矩阵树图只支持**一层数据**（扁平数组），不支持多层级嵌套。
> 支持 icon 和每个节点的背景图片配置。

```typescript
interface TreemapChartSchema extends BaseChartSchema {
  chartType: 'treemap';

  /** 分类字段名 */
  categoryField: string;

  /** 权重字段名 */
  valueField: string;

  /** 节点配置 */
  node?: {
    gap?: number;          // 节点间距
    padding?: number;      // 内边距
    cornerRadius?: number; // 圆角
  };

  /** Icon 配置 */
  icon?: IconConfig;

  /** 背景图片映射 */
  backgroundMap?: ImageMapConfig;

  /** 标签配置 */
  label?: LabelConfig;
}
```

**示例：带 Icon 和背景图的矩阵树图**
```json
{
  "chartType": "treemap",
  "title": "部门预算分布",
  "data": [
    { "dept": "前端组", "budget": 100, "icon": "fe", "bg": "blue" },
    { "dept": "后端组", "budget": 150, "icon": "be", "bg": "green" },
    { "dept": "设计组", "budget": 80, "icon": "design", "bg": "purple" },
    { "dept": "测试组", "budget": 60, "icon": "qa", "bg": "orange" }
  ],
  "categoryField": "dept",
  "valueField": "budget",
  "icon": {
    "field": "icon",
    "map": {
      "fe": "/icons/frontend.png",
      "be": "/icons/backend.png",
      "design": "/icons/design.png",
      "qa": "/icons/qa.png"
    },
    "size": 32
  },
  "backgroundMap": {
    "field": "bg",
    "map": {
      "blue": "/images/bg-blue.png",
      "green": "/images/bg-green.png",
      "purple": "/images/bg-purple.png",
      "orange": "/images/bg-orange.png"
    },
    "opacity": 0.3
  },
  "node": {
    "gap": 4,
    "cornerRadius": 8
  },
  "label": {
    "visible": true,
    "format": "{name}\n{value}万"
  }
}
```

### 1.7 圆形闭包图 Schema

> **设计原则**：信息图圆形闭包图只支持**一层数据**（扁平数组），不支持多层级嵌套。
> 支持每个圆配置独立的背景图片。

```typescript
interface CirclePackingChartSchema extends BaseChartSchema {
  chartType: 'circlePacking';

  /** 分类字段名 */
  categoryField: string;

  /** 权重字段名 */
  valueField: string;

  /** 圆形配置 */
  circle?: {
    padding?: number;      // 圆形间距
    strokeWidth?: number;  // 描边宽度
    strokeColor?: string;  // 描边颜色
  };

  /** 背景图片映射 */
  backgroundMap?: ImageMapConfig;

  /** 标签配置 */
  label?: LabelConfig;
}
```

**示例：带背景图的圆形闭包图**
```json
{
  "chartType": "circlePacking",
  "title": "产品销售分布",
  "data": [
    { "product": "手机", "sales": 1200, "bg": "phone" },
    { "product": "电脑", "sales": 800, "bg": "computer" },
    { "product": "平板", "sales": 600, "bg": "tablet" },
    { "product": "手表", "sales": 400, "bg": "watch" }
  ],
  "categoryField": "product",
  "valueField": "sales",
  "backgroundMap": {
    "field": "bg",
    "map": {
      "phone": "/images/phone-bg.png",
      "computer": "/images/computer-bg.png",
      "tablet": "/images/tablet-bg.png",
      "watch": "/images/watch-bg.png"
    },
    "opacity": 0.5
  },
  "circle": {
    "padding": 10,
    "strokeWidth": 2,
    "strokeColor": "#fff"
  },
  "label": {
    "visible": true,
    "format": "{name}\n{value}万台"
  }
}
```

---

## Phase 2: 转换器设计

### 2.1 Schema 校验

使用 **Zod** 进行 Schema 校验，提供友好的错误提示：

```typescript
import { z } from 'zod';

// 基础 Schema
const BaseChartZodSchema = z.object({
  chartType: z.enum(['pie', 'bar', 'column', 'area', 'treemap', 'circlePacking']),
  title: z.union(z.string(), z.object({
    text: z.string(),
    position: z.enum(['left', 'center', 'right']).optional(),
    subtext: z.string().optional()
  })).optional(),
  data: z.array(z.record(z.any())),
  width: z.number().optional(),
  height: z.number().optional(),
  background: z.object({
    image: z.string().optional(),
    color: z.string().optional(),
    opacity: z.number().min(0).max(1).optional()
  }).optional(),
  colors: z.array(z.string()).optional(),
  legend: z.union(z.boolean(), z.object({
    visible: z.boolean().optional(),
    position: z.enum(['top', 'bottom', 'left', 'right']).optional()
  })).optional()
});

// 饼图 Schema
const PieChartZodSchema = BaseChartZodSchema.extend({
  chartType: z.literal('pie'),
  categoryField: z.string(),
  valueField: z.string(),
  innerRadius: z.number().min(0).max(1).optional(),
  outerRadius: z.number().min(0).max(1).optional(),
  label: z.object({
    visible: z.boolean().optional(),
    position: z.enum(['inside', 'outside', 'spider']).optional(),
    format: z.string().optional()
  }).optional()
});

// 条形图 Schema
const BarChartZodSchema = BaseChartZodSchema.extend({
  chartType: z.literal('bar'),
  categoryField: z.string(),
  valueField: z.string(),
  bar: z.object({
    width: z.union(z.number(), z.string()).optional(),
    cornerRadius: z.number().optional(),
    gap: z.number().optional()
  }).optional(),
  label: z.object({
    visible: z.boolean().optional(),
    position: z.enum(['inside', 'outside']).optional(),
    format: z.string().optional()
  }).optional(),
  icon: z.object({
    field: z.string().optional(),
    map: z.record(z.string()).optional(),
    size: z.number().optional(),
    position: z.enum(['start', 'end']).optional()
  }).optional(),
  sort: z.enum(['asc', 'desc', 'none']).optional(),
  xAxis: z.object({
    visible: z.boolean().optional(),
    format: z.string().optional()
  }).optional(),
  yAxis: z.object({
    visible: z.boolean().optional(),
    format: z.string().optional()
  }).optional()
});

// ... 其他图表类似
```

**校验示例**：
```typescript
import { PieChartZodSchema } from './schemas';

// 校验
const result = PieChartZodSchema.safeParse(schema);
if (!result.success) {
  console.error(result.error.errors);
}

// 类型推导
type PieChartInput = z.infer<typeof PieChartZodSchema>;
```

### 2.2 转换器接口

```typescript
interface SchemaConverter<T extends BaseChartSchema> {
  /** 图表类型 */
  chartType: string;

  /** 将信息图 Schema 转换为 VChart Spec */
  convert(schema: T): any;

  /** 验证 Schema */
  validate(schema: T): { valid: boolean; errors: string[] };

  /** 获取默认配置 */
  getDefaults(): Partial<T>;
}
```

### 2.2 条形图转换器示例

```typescript
class BarChartConverter implements SchemaConverter<BarChartSchema> {
  chartType = 'bar';

  convert(schema: BarChartSchema) {
    // 基础配置
    const spec: any = {
      type: 'bar',
      direction: 'horizontal',
      data: { values: schema.data },
      xField: schema.valueField,
      yField: schema.categoryField,
    };

    // 标题
    if (schema.title) {
      spec.title = typeof schema.title === 'string'
        ? { text: schema.title }
        : schema.title;
    }

    // 背景
    if (schema.background) {
      spec.background = {
        image: schema.background.image,
        fill: schema.background.color,
        fillOpacity: schema.background.opacity,
      };
    }

    // 条形样式
    if (schema.bar) {
      spec.bar = {
        style: {
          cornerRadius: schema.bar.cornerRadius,
        },
      };
      spec.barWidth = schema.bar.width;
      spec.barGapInGroup = schema.bar.gap;
    }

    // 标签
    if (schema.label?.visible !== false) {
      spec.label = {
        visible: true,
        position: schema.label?.position ?? 'outside',
        style: { fill: '#666' },
      };
      if (schema.label?.format) {
        spec.label.formatter = (datum) => {
          return schema.label.format.replace('{value}', datum[schema.valueField]);
        };
      }
    }

    // 排序
    if (schema.sort && schema.sort !== 'none') {
      spec.sortDataByAxis = true;
      // VChart 通过数据排序实现
    }

    // Icon 处理（通过 customMark）
    if (schema.icon?.field && schema.icon?.map) {
      spec.customMark = (data.map(item => ({
        type: 'image',
        style: {
          x: schema.icon.position === 'start' ? -30 : 'max',
          y: item[schema.categoryField],
          width: schema.icon.size ?? 24,
          height: schema.icon.size ?? 24,
          src: schema.icon.map[item[schema.icon.field]],
        },
      })));
    }

    // 颜色
    if (schema.colors) {
      spec.color = schema.colors;
    }

    // 图例
    if (schema.legend !== false) {
      spec.legends = typeof schema.legend === 'object'
        ? { visible: true, ...schema.legend }
        : { visible: true };
    }

    return spec;
  }

  validate(schema: BarChartSchema) {
    const errors: string[] = [];
    if (!schema.categoryField) errors.push('categoryField is required');
    if (!schema.valueField) errors.push('valueField is required');
    if (!Array.isArray(schema.data)) errors.push('data must be an array');
    return { valid: errors.length === 0, errors };
  }

  getDefaults(): Partial<BarChartSchema> {
    return {
      bar: { cornerRadius: 0, gap: 8 },
      label: { visible: true, position: 'outside' },
      sort: 'none',
      legend: false,
    };
  }
}
```

---

## Phase 3: 项目结构

```
vinfo-graphics/
├── src/
│   ├── index.ts                 # 主入口
│   ├── types/
│   │   ├── base.ts              # 基础类型
│   │   ├── pie.ts               # 饼图
│   │   ├── bar.ts               # 条形图
│   │   ├── column.ts            # 柱图
│   │   ├── area.ts              # 面积图
│   │   ├── treemap.ts           # 矩阵树图
│   │   └── circle-packing.ts    # 圆形闭包图
│   ├── converters/
│   │   ├── base.ts              # 转换器基类
│   │   ├── pie.ts
│   │   ├── bar.ts
│   │   ├── column.ts
│   │   ├── area.ts
│   │   ├── treemap.ts
│   │   └── circle-packing.ts
│   ├── presets/
│   │   ├── colors.ts            # 预设配色
│   │   └── themes.ts            # 预设主题
│   └── utils/
│       └── helpers.ts
├── examples/
│   ├── pie-demo.html
│   ├── bar-demo.html
│   └── ...
├── tests/
├── package.json
├── tsconfig.json
└── README.md
```

---

## Phase 4: 主入口 API

```typescript
import VChart from '@visactor/vchart';

export type { ChartType } from './types';
export type * from './types/base';
export type * from './types/pie';
export type * from './types/bar';
export type * from './types/column';
export type * from './types/area';
export type * from './types/treemap';
export type * from './types/circle-packing';

import { PieChartConverter } from './converters/pie';
import { BarChartConverter } from './converters/bar';
import { ColumnChartConverter } from './converters/column';
import { AreaChartConverter } from './converters/area';
import { TreemapChartConverter } from './converters/treemap';
import { CirclePackingChartConverter } from './converters/circle-packing';

const converters = {
  pie: new PieChartConverter(),
  bar: new BarChartConverter(),
  column: new ColumnChartConverter(),
  area: new AreaChartConverter(),
  treemap: new TreemapChartConverter(),
  circlePacking: new CirclePackingChartConverter(),
};

type ChartSchema = PieChartSchema | BarChartSchema | ColumnChartSchema |
                    AreaChartSchema | TreemapChartSchema | CirclePackingChartSchema;

/** 将 Schema 转换为 VChart Spec */
export function toVChartSpec(schema: ChartSchema): any {
  const converter = converters[schema.chartType];
  if (!converter) {
    throw new Error(`Unknown chart type: ${schema.chartType}`);
  }
  const result = converter.validate(schema as any);
  if (!result.valid) {
    throw new Error(`Schema validation failed: ${result.errors.join(', ')}`);
  }
  return converter.convert(schema as any);
}

/** 创建并渲染图表 */
export function createChart(schema: ChartSchema, container: HTMLElement): VChart {
  const spec = toVChartSpec(schema);
  const chart = new VChart(spec, { dom: container });
  chart.renderSync();
  return chart;
}

/** 验证 Schema */
export function validate(schema: ChartSchema): { valid: boolean; errors: string[] } {
  const converter = converters[schema.chartType];
  return converter?.validate(schema as any) ?? { valid: false, errors: ['Unknown type'] };
}
```

---

## 信息图特色功能设计

### 1. Icon 支持

在条形图中支持显示 Icon，是信息图的常见需求：

```typescript
// Schema 配置
{
  "icon": {
    "field": "platform",       // 从 data 中读取的字段
    "map": {                   // 值到图片的映射
      "微信": "/icons/wechat.png",
      "抖音": "/icons/douyin.png"
    },
    "size": 24,
    "position": "start"        // start | end
  }
}

// 转换为 VChart customMark
spec.extensionMark = [{
  type: 'image',
  style: {
    x: { field: 'category', scale: 'y', offset: -30 },
    y: { field: 'value', scale: 'x' },
    width: 24,
    height: 24,
    src: { callback: (d) => iconMap[d.icon] }
  }
}];
```

### 2. 背景图片

```typescript
// Schema 配置
{
  "background": {
    "image": "/images/bg.png",
    "opacity": 0.3
  }
}

// 转换为 VChart background
spec.background = {
  image: schema.background.image,
  fillOpacity: schema.background.opacity,
};
```

### 3. 标题位置

```typescript
// Schema 配置
{
  "title": {
    "text": "标题",
    "position": "right",      // left | center | right
    "subtext": "副标题"
  }
}

// 转换为 VChart title
spec.title = {
  text: schema.title.text,
  subtext: schema.title.subtext,
  align: schema.title.position, // 利用 textAlign 实现
};
```

---

## 时间线

| 阶段 | 内容 | 时间 |
|------|------|------|
| Phase 1 | Schema 类型定义 | 2 天 |
| Phase 2 | 转换器实现 | 3 天 |
| Phase 3 | 特色功能（icon、背景） | 2 天 |
| Phase 4 | 测试与示例 | 1 天 |
| Phase 5 | 文档 | 1 天 |
| **总计** | | **9 天** |

---

## Schema 对比：VSeed vs VInfoGraphics

### VSeed (BI 分析)
```json
{
  "chartType": "bar",
  "dataset": [...],
  "dimensions": [
    { "id": "product", "encoding": "yAxis" },
    { "id": "region", "encoding": "color" }
  ],
  "measures": [
    { "id": "sales", "encoding": "xAxis" }
  ]
}
```

### VInfoGraphics (信息图)
```json
{
  "chartType": "bar",
  "title": { "text": "销售排行", "position": "right" },
  "background": { "image": "/bg.png" },
  "data": [...],
  "categoryField": "product",
  "valueField": "sales",
  "icon": { "field": "icon", "map": {...} },
  "sort": "desc"
}
```

**关键差异**：
1. 信息图使用 `categoryField/valueField` 而非 `dimensions/measures`
2. 信息图支持 `background`、`icon` 等视觉增强
3. 信息图标题支持位置配置
4. 信息图更简洁，不支持分组/堆叠等复杂场景
