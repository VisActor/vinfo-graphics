import * as z from 'zod';
import { linearGradientSchema, axisSchema, brandImageSchema, baseChartSchema } from './base';

/**
 * 面积图 Zod Schema
 *
 * 与 src/types/area.ts 保持一致
 */

// 面积图标签配置
const areaLabelSchema = z
  .object({
    visible: z.boolean().optional(),
    position: z.string().optional(),
    format: z.string().optional(),
    minVisible: z.number().optional(),
  })
  .optional();

// 面积图 Icon 配置
const areaIconSchema = z
  .object({
    field: z.string().optional(),
    map: z.record(z.string(), z.string()).optional(),
    size: z.number().optional(),
    visible: z.boolean().optional(),
    position: z.enum(['top', 'bottom']).optional(),
    style: z
      .object({
        lineWidth: z.number().optional(),
        stroke: z.string().optional(),
      })
      .optional(),
  })
  .optional();

// 面积图样式配置
const areaStyleSchema = z
  .object({
    smooth: z.boolean().optional(),
    opacity: z.number().min(0).max(1).optional(),
    linearGradient: linearGradientSchema.optional(),
  })
  .optional();

// 线条样式配置
const lineStyleSchema = z
  .object({
    visible: z.boolean().optional(),
    width: z.number().optional(),
    color: z.string().optional(),
  })
  .optional();

// 数据点样式配置
const pointStyleSchema = z
  .object({
    visible: z.boolean().optional(),
    size: z.number().optional(),
  })
  .optional();

// 标注点配置
const annotationPointSchema = z.array(
  z.object({
    value: z.union([z.string(), z.number()]),
    text: z.string().optional(),
    textColor: z.string().optional(),
    textFontSize: z.number().optional(),
    textFontWeight: z.union([z.number(), z.string()]).optional(),
    textBackgroundVisible: z.boolean().optional(),
    textBackgroundColor: z.string().optional(),
    offsetX: z.number().optional(),
    offsetY: z.number().optional(),
  })
);

// 垂直标注线配置
const annotationVerticalLineSchema = z.array(
  z.object({
    xValue: z.union([z.string(), z.number()]),
    text: z.string().optional(),
    textColor: z.string().optional(),
    textFontSize: z.number().optional(),
    textBackgroundVisible: z.boolean().optional(),
    textBackgroundColor: z.string().optional(),
    lineVisible: z.boolean().optional(),
    lineColor: z.string().optional(),
    lineWidth: z.number().optional(),
    lineStyle: z.enum(['solid', 'dashed', 'dotted']).optional(),
  })
);

// 水平标注线配置
const annotationHorizontalLineSchema = z.array(
  z.object({
    yValue: z.number(),
    text: z.string().optional(),
    textColor: z.string().optional(),
    textFontSize: z.number().optional(),
    textBackgroundVisible: z.boolean().optional(),
    textBackgroundColor: z.string().optional(),
    lineVisible: z.boolean().optional(),
    lineColor: z.string().optional(),
    lineWidth: z.number().optional(),
    lineStyle: z.enum(['solid', 'dashed', 'dotted']).optional(),
  })
);

// 标注区域配置
const annotationAreaSchema = z.array(
  z.object({
    startValue: z.union([z.string(), z.number()]),
    endValue: z.union([z.string(), z.number()]),
    text: z.string().optional(),
    textColor: z.string().optional(),
    textFontSize: z.number().optional(),
    areaColor: z.string().optional(),
    areaColorOpacity: z.number().optional(),
  })
);

// 面积图 Schema
export const areaChartSchema = z.object({
  chartType: z.literal('area'),

  // 基础配置
  ...baseChartSchema,

  // 面积图特定配置
  categoryField: z.string().min(1, 'categoryField is required'),
  valueField: z.string().min(1, 'valueField is required'),
  area: areaStyleSchema,
  line: lineStyleSchema,
  point: pointStyleSchema,
  label: areaLabelSchema,
  icon: areaIconSchema,
  brandImage: brandImageSchema,
  annotationPoint: annotationPointSchema.optional(),
  annotationVerticalLine: annotationVerticalLineSchema.optional(),
  annotationHorizontalLine: annotationHorizontalLineSchema.optional(),
  annotationArea: annotationAreaSchema.optional(),
  xAxis: axisSchema,
  yAxis: axisSchema,
});

// 类型导出
export type AreaChartSchemaZod = z.infer<typeof areaChartSchema>;
