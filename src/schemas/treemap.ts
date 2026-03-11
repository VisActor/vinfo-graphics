import * as z from 'zod';
import { baseChartSchema } from './base';

/**
 * 矩阵树图 Zod Schema
 *
 * 与 src/types/treemap.ts 保持一致
 */

// 矩阵树图标签配置
const treemapLabelSchema = z
  .object({
    visible: z.boolean().optional(),
    position: z.string().optional(),
    format: z.string().optional(),
    minVisible: z.number().optional(),
    showPercent: z.boolean().optional(),
  })
  .optional();

// 矩阵树图 Icon 配置
const treemapIconSchema = z
  .object({
    field: z.string().optional(),
    map: z.record(z.string(), z.string()).optional(),
    size: z.number().optional(),
    visible: z.boolean().optional(),
    position: z.enum(['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right']).optional(),
    offset: z.number().optional(),
    style: z
      .object({
        lineWidth: z.number().optional(),
        stroke: z.string().optional(),
      })
      .optional(),
  })
  .optional();

// 矩阵树图排名配置
const treemapRankSchema = z
  .object({
    visible: z.boolean().optional(),
    position: z.enum(['top-left', 'top-right', 'bottom-left', 'bottom-right']).optional(),
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

// 节点配置
const nodeStyleSchema = z
  .object({
    gap: z.number().optional(),
    padding: z.number().optional(),
    cornerRadius: z.number().optional(),
  })
  .optional();

// 节点背景图片配置
const nodeBackgroundSchema = z
  .object({
    field: z.string().optional(),
    map: z.record(z.string(), z.string()).optional(),
    opacity: z.number().min(0).max(1).optional(),
    visible: z.boolean().optional(),
  })
  .optional();

// 矩阵树图 Schema
export const treemapChartSchema = z.object({
  chartType: z.literal('treemap'),

  // 基础配置
  ...baseChartSchema,

  // 矩阵树图特定配置
  categoryField: z.string().min(1, 'categoryField is required'),
  valueField: z.string().min(1, 'valueField is required'),
  groupField: z.string().optional(),
  node: nodeStyleSchema,
  label: treemapLabelSchema,
  rank: treemapRankSchema,
  icon: treemapIconSchema,
  nodeBackground: nodeBackgroundSchema,
});

// 类型导出
export type TreemapChartSchemaZod = z.infer<typeof treemapChartSchema>;
