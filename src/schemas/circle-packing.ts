import * as z from 'zod';
import { baseChartSchema } from './base';

/**
 * 圆形闭包图 Zod Schema
 *
 * 与 src/types/circle-packing.ts 保持一致
 */

// 文字样式（用于 prominent-value 布局）
const circlePackingTextStyleSchema = z
  .object({
    fontSize: z.number().optional(),
    fontWeight: z.union([z.number(), z.string()]).optional(),
    fill: z.string().optional(),
  })
  .optional();

// 圆形闭包图标签配置
const circlePackingLabelSchema = z
  .object({
    visible: z.boolean().optional(),
    position: z.string().optional(),
    format: z.string().optional(),
    minVisible: z.number().optional(),
    showPercent: z.boolean().optional(),
    layout: z.enum(['default', 'prominent-value']).optional(),
    valueStyle: circlePackingTextStyleSchema,
    nameStyle: circlePackingTextStyleSchema,
  })
  .optional();

// 圆形闭包图 Icon 配置
const circlePackingIconSchema = z
  .object({
    field: z.string().optional(),
    map: z.record(z.string(), z.string()).optional(),
    size: z.number().optional(),
    visible: z.boolean().optional(),
    position: z.enum(['top-left', 'top-right', 'center']).optional(),
    offset: z.number().optional(),
    style: z
      .object({
        lineWidth: z.number().optional(),
        stroke: z.string().optional(),
      })
      .optional(),
  })
  .optional();

// 圆形闭包图排名配置
const circlePackingRankSchema = z
  .object({
    visible: z.boolean().optional(),
    position: z.enum(['top-left', 'top-right', 'center']).optional(),
    style: z
      .object({
        fontSize: z.number().optional(),
        fill: z.string().optional(),
        fontWeight: z.union([z.number(), z.string()]).optional(),
        backgroundColor: z.string().optional(),
      })
      .optional(),
  })
  .optional();

// 圆形配置
const circleStyleSchema = z
  .object({
    padding: z.number().optional(),
    strokeWidth: z.number().optional(),
    strokeColor: z.string().optional(),
    fillOpacity: z.number().min(0).max(1).optional(),
  })
  .optional();

// 圆形背景图片配置
const circleBackgroundSchema = z
  .object({
    field: z.string().optional(),
    map: z.record(z.string(), z.string()).optional(),
    opacity: z.number().min(0).max(1).optional(),
    visible: z.boolean().optional(),
  })
  .optional();

// 圆形闭包图 Schema
export const circlePackingChartSchema = z.object({
  chartType: z.literal('circlePacking'),

  // 基础配置
  ...baseChartSchema,

  // 圆形闭包图特定配置
  categoryField: z.string().min(1, 'categoryField is required'),
  valueField: z.string().min(1, 'valueField is required'),
  groupField: z.string().optional(),
  circle: circleStyleSchema,
  label: circlePackingLabelSchema,
  rank: circlePackingRankSchema,
  icon: circlePackingIconSchema,
  circleBackground: circleBackgroundSchema,
});

// 类型导出
export type CirclePackingChartSchemaZod = z.infer<typeof circlePackingChartSchema>;
