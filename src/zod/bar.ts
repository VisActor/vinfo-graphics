import { z } from 'zod';

// 基础验证规则
const nonEmptyArray = z.array(z.record(z.string(), z.any())).min(1, 'data must be a non-empty array');

const titleSchema = z.union([
  z.string(),
  z.object({
    text: z.string(),
    position: z.enum(['left', 'center', 'right']).optional(),
    subtext: z.string().optional(),
  }),
]);

const backgroundSchema = z.object({
  image: z.string().optional(),
  color: z.string().optional(),
  linearlinearGradient: z
    .object({
      direction: z.enum(['left-right', 'right-left', 'top-bottom', 'bottom-top']).optional(),
      colors: z.array(z.string()).min(2),
    })
    .optional(),
}).optional();

const labelSchema = z
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

const legendSchema = z
  .union([
    z.boolean(),
    z.object({
      position: z.enum(['left', 'right', 'top', 'bottom']).optional(),
      visible: z.boolean().optional(),
    }),
  ])
  .optional();

const axisSchema = z
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
const iconLabelSchema = z
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
  .optional();

const iconStyleSchema = z
  .object({
    lineWidth: z.number().optional(),
    stroke: z.string().optional(),
  })
  .optional();

const iconConfigSchema = z
  .object({
    field: z.string().optional(),
    map: z.record(z.string(), z.string()).optional(),
    size: z.number().optional(),
    position: z.enum(['start', 'end']).optional(),
    visible: z.boolean().optional(),
    label: iconLabelSchema,
    style: iconStyleSchema,
  })
  .optional();

// 渐变配置
const linearGradientSchema = z
  .object({
    direction: z.enum(['left-right', 'right-left', 'top-bottom', 'bottom-top']).optional(),
    colors: z.array(z.string()).min(2),
  })
  .optional();

// 排名配置
const rankStyleSchema = z
  .object({
    fontSize: z.number().optional(),
    fill: z.string().optional(),
    fontWeight: z.union([z.number(), z.string()]).optional(),
    backgroundColor: z.string().optional(),
    cornerRadius: z.number().optional(),
  })
  .optional();

const rankSchema = z
  .object({
    visible: z.boolean().optional(),
    position: z.enum(['start', 'end', 'yAxis']).optional(),
    style: rankStyleSchema,
  })
  .optional();

// 脚注配置
const footnoteSchema = z
  .object({
    text: z.string().optional(),
    image: z.string().optional(),
    layout: z
      .enum(['left', 'right', 'image-left-text-right', 'image-right-text-left', 'center'])
      .optional(),
    fontSize: z.number().optional(),
    fill: z.string().optional(),
    imageWidth: z.number().optional(),
    imageHeight: z.number().optional(),
    gap: z.number().optional(),
    offsetBottom: z.number().optional(),
  })
  .optional();

// 条形图 Schema
export const barChartSchema = z.object({
  chartType: z.literal('bar'),
  title: titleSchema.optional(),
  data: nonEmptyArray,
  categoryField: z.string().min(1, 'categoryField is required'),
  valueField: z.string().min(1, 'valueField is required'),
  bar: z
    .object({
      width: z.union([z.number(), z.string()]).optional(),
      cornerRadius: z.union([z.number(), z.array(z.number())]).optional(),
      gap: z.number().optional(),
      linearGradient: linearGradientSchema,
    })
    .optional(),
  label: labelSchema,
  icon: iconConfigSchema,
  rank: rankSchema,
  sort: z.enum(['asc', 'desc', 'none']).optional(),
  xAxis: axisSchema,
  yAxis: axisSchema,
  colors: z.array(z.string()).optional(),
  background: backgroundSchema,
  legend: legendSchema,
  footnote: footnoteSchema,
});

// 类型导出
export type BarChartSchemaZod = z.infer<typeof barChartSchema>;
