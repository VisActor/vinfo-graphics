import * as z from 'zod';
import { centerImageSchema, baseChartSchema } from './base';

/**
 * 饼图 Zod Schema
 *
 * 与 src/types/pie.ts 保持一致
 */

// 饼图标签配置
const pieLabelSchema = z
  .object({
    visible: z.boolean().optional(),
    position: z.enum(['inside', 'outside', 'spider']).optional(),
    format: z.string().optional(),
    minVisible: z.number().optional(),
  })
  .optional();

// 饼图 Icon 配置
const pieIconSchema = z
  .object({
    field: z.string().optional(),
    map: z.record(z.string(), z.string()).optional(),
    size: z.number().optional(),
    visible: z.boolean().optional(),
    offsetRadius: z.number().optional(),
    position: z.enum(['inside-inner', 'inside-outer', 'outside', 'inside']).optional(),
    style: z
      .object({
        lineWidth: z.number().optional(),
        stroke: z.string().optional(),
      })
      .optional(),
  })
  .optional();

// 饼图 Schema
export const pieChartSchema = z.object({
  chartType: z.literal('pie'),

  // 基础配置
  ...baseChartSchema,

  // 饼图特定配置
  categoryField: z.string().min(1, 'categoryField is required'),
  valueField: z.string().min(1, 'valueField is required'),
  innerRadius: z.number().min(0).max(1).optional(),
  outerRadius: z.number().min(0).max(1).optional(),
  label: pieLabelSchema,
  icon: pieIconSchema,
  centerImage: centerImageSchema,
});

// 类型导出
export type PieChartSchemaZod = z.infer<typeof pieChartSchema>;
