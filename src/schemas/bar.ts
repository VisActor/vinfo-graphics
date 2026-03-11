import * as z from 'zod';
import { linearGradientSchema, axisSchema, brandImageSchema, baseChartSchema } from './base';

/**
 * 条形图 Zod Schema
 *
 * 与 src/types/bar.ts 保持一致
 */

// 条形图标签配置
const barLabelSchema = z
  .object({
    visible: z.boolean().optional(),
    position: z
      .enum([
        'inside',
        'inside-left',
        'inside-right',
        'inside-top',
        'inside-bottom',
        'outside',
        'top-right',
        'top-left',
        'bottom-right',
        'bottom-left',
        'right',
        'left',
        'top',
        'bottom',
      ])
      .optional(),
    format: z.string().optional(),
    minVisible: z.number().optional(),
  })
  .optional();

// 条形图 Icon 配置
const barIconSchema = z
  .object({
    field: z.string().optional(),
    map: z.record(z.string(), z.string()).optional(),
    size: z.number().optional(),
    visible: z.boolean().optional(),
    position: z.enum(['start', 'end']).optional(),
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

// 条形图排名配置
const barRankSchema = z
  .object({
    visible: z.boolean().optional(),
    position: z.enum(['start', 'end', 'yAxis']).optional(),
    style: z
      .object({
        fontSize: z.number().optional(),
        fill: z.string().optional(),
        fontWeight: z.union([z.number(), z.string()]).optional(),
        backgroundColor: z.string().optional(),
        cornerRadius: z.number().optional(),
      })
      .optional(),
  })
  .optional();

// 条形图样式配置
const barStyleSchema = z
  .object({
    width: z.union([z.number(), z.string()]).optional(),
    cornerRadius: z.number().optional(),
    gap: z.number().optional(),
    linearGradient: linearGradientSchema.optional(),
  })
  .optional();

// 条形图 Schema
export const barChartSchema = z.object({
  chartType: z.literal('bar'),

  // 基础配置
  ...baseChartSchema,

  // 条形图特定配置
  categoryField: z.string().min(1, 'categoryField is required'),
  valueField: z.string().min(1, 'valueField is required'),
  bar: barStyleSchema,
  rank: barRankSchema,
  label: barLabelSchema,
  icon: barIconSchema,
  sort: z.enum(['asc', 'desc', 'none']).optional(),
  brandImage: brandImageSchema,
  xAxis: axisSchema,
  yAxis: axisSchema,
});

// 类型导出
export type BarChartSchemaZod = z.infer<typeof barChartSchema>;
