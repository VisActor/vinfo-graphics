import * as z from 'zod';

/**
 * 公共 Zod 验证 Schema
 *
 * 与 src/types/base.ts 保持一致
 */

// 基础验证规则
export const nonEmptyArray = z
  .array(z.record(z.string(), z.any()))
  .min(1, 'data must be a non-empty array');

// 标题配置
export const titleSchema = z.union([
  z.string(),
  z.object({
    text: z.string(),
    position: z.enum(['left', 'center', 'right']).optional(),
    subtext: z.string().optional(),
  }),
]);

// 线形渐变配置
export const linearGradientSchema = z.object({
  direction: z.enum(['left-right', 'right-left', 'top-bottom', 'bottom-top']).optional(),
  colors: z.array(z.string()).min(2),
});

// 背景配置
export const backgroundSchema = z
  .object({
    image: z.string().optional(),
    color: z.string().optional(),
    linearGradient: linearGradientSchema.optional(),
  })
  .optional();

// 标签配置
export const labelSchema = z
  .object({
    visible: z.boolean().optional(),
    position: z.string().optional(), // 各图表 position 值不同，使用 string 统一处理
    format: z.string().optional(),
    minVisible: z.number().optional(),
  })
  .optional();

// 图例配置
export const legendSchema = z
  .union([
    z.boolean(),
    z.object({
      position: z.enum(['left', 'right', 'top', 'bottom']).optional(),
      visible: z.boolean().optional(),
    }),
  ])
  .optional();

// 坐标轴配置
export const axisSchema = z
  .object({
    visible: z.boolean().optional(),
    format: z.string().optional(),
    label: z
      .object({
        visible: z.boolean().optional(),
        format: z.string().optional(),
      })
      .optional(),
  })
  .optional();

// Icon 配置
export const iconConfigSchema = z
  .object({
    field: z.string().optional(),
    map: z.record(z.string(), z.string()).optional(),
    size: z.number().optional(),
    visible: z.boolean().optional(),
    position: z.string().optional(), // 各图表 position 值不同
    offsetRadius: z.number().optional(),
    offset: z.number().optional(),
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

// 图片映射配置（用于 treemap/circlePacking 的节点背景）
export const imageMapConfigSchema = z
  .object({
    field: z.string().optional(),
    map: z.record(z.string(), z.string()).optional(),
    opacity: z.number().min(0).max(1).optional(),
    visible: z.boolean().optional(),
  })
  .optional();

// 脚注配置
export const footnoteSchema = z
  .object({
    text: z.string().optional(),
    image: z.string().optional(),
    layout: z.enum(['left', 'right', 'image-left-text-right', 'image-right-text-left', 'center']).optional(),
    fontSize: z.number().optional(),
    fill: z.string().optional(),
    imageWidth: z.number().optional(),
    imageHeight: z.number().optional(),
    gap: z.number().optional(),
    offset: z.number().optional(),
  })
  .optional();

// 装饰图片配置
export const brandImageSchema = z
  .object({
    visible: z.boolean().optional(),
    url: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
    align: z.enum(['left', 'center', 'right']).optional(),
    verticalAlign: z.enum(['top', 'middle', 'bottom']).optional(),
    asForeground: z.boolean().optional(),
  })
  .optional();

// 中心图片配置（饼图用）
export const centerImageSchema = z
  .object({
    visible: z.boolean().optional(),
    url: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
  })
  .optional();

// 排名标签配置
export const rankStyleSchema = z
  .object({
    fontSize: z.number().optional(),
    fill: z.string().optional(),
    fontWeight: z.union([z.number(), z.string()]).optional(),
    backgroundColor: z.string().optional(),
    cornerRadius: z.number().optional(),
  })
  .optional();

export const rankSchema = z
  .object({
    visible: z.boolean().optional(),
    position: z.string().optional(), // 各图表 position 值不同
    style: rankStyleSchema.optional(),
  })
  .optional();

// 主题配置
export const themeSchema = z.union([
  z.string(), // PresetThemeName
  z.object({
    type: z.enum(['light', 'dark']).optional(),
    name: z.string().optional(),
    colors: z.array(z.string()).optional(),
    backgroundColor: z.string().optional(),
    textColor: z.string().optional(),
    secondaryTextColor: z.string().optional(),
  }),
]);

// 公共基础 Schema（适用于所有图表）
export const baseChartSchema = {
  title: titleSchema.optional(),
  data: nonEmptyArray,
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  background: backgroundSchema,
  colors: z.array(z.string()).optional(),
  legend: legendSchema,
  footnote: footnoteSchema,
  theme: themeSchema.optional(),
};
