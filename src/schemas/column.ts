import * as z from 'zod';
import { linearGradientSchema, axisSchema, brandImageSchema, baseChartSchema } from './base';

/**
 * 柱图 Zod Schema
 *
 * 与 src/types/column.ts 保持一致
 */

// 柱图标签配置
const columnLabelSchema = z
  .object({
    visible: z.boolean().optional(),
    position: z.enum(['inside', 'top', 'bottom']).optional(),
    format: z.string().optional(),
    minVisible: z.number().optional(),
  })
  .optional();

// 柱图 Icon 配置
const columnIconSchema = z
  .object({
    field: z.string().optional(),
    map: z.record(z.string(), z.string()).optional(),
    size: z.number().optional(),
    visible: z.boolean().optional(),
    position: z.enum(['bottom', 'top']).optional(),
    label: z
      .object({
        visible: z.boolean().optional(),
        offset: z.number().optional(),
        style: z
          .object({
            fontSize: z.number().optional(),
            fill: z.string().optional(),
            fontWeight: z.union([z.number(), z.string()]).optional(),
          })
          .optional(),
      })
      .optional(),
    style: z
      .object({
        lineWidth: z.number().optional(),
        stroke: z.string().optional(),
      })
      .optional(),
  })
  .optional();

// 柱图样式配置
const columnStyleSchema = z
  .object({
    width: z.union([z.number(), z.string()]).optional(),
    cornerRadius: z
      .union([z.number(), z.tuple([z.number(), z.number(), z.number(), z.number()])])
      .optional(),
    gap: z.number().optional(),
    linearGradient: linearGradientSchema.optional(),
  })
  .optional();

// 柱图 Schema
export const columnChartSchema = z.object({
  chartType: z.literal('column'),

  // 基础配置
  ...baseChartSchema,

  // 柱图特定配置
  categoryField: z.string().min(1, 'categoryField is required'),
  valueField: z.string().min(1, 'valueField is required'),
  column: columnStyleSchema,
  label: columnLabelSchema,
  icon: columnIconSchema,
  sort: z.enum(['asc', 'desc', 'none']).optional(),
  brandImage: brandImageSchema,
  xAxis: axisSchema,
  yAxis: axisSchema,
});

// 类型导出
export type ColumnChartSchemaZod = z.infer<typeof columnChartSchema>;
