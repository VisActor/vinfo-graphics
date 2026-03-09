import { z } from 'zod';

// 基础验证规则
const nonEmptyArray = z.array(z.record(z.string(), z.any())).min(1, 'data must be a non-empty array');

const titleSchema = z.union([
  z.string(),
  z.object({
    text: z.string(),
    position: z.enum(['left', 'center', 'right']).optional(),
  }),
]);

const backgroundSchema = z.object({
  image: z.string().optional(),
  color: z.string().optional(),
  opacity: z.number().min(0).max(1).optional(),
}).optional();

const labelSchema = z.object({
  visible: z.boolean().optional(),
  position: z.enum(['inside', 'outside', 'spider', 'top', 'center']).optional(),
  format: z.string().optional(),
  minVisible: z.number().optional(),
}).optional();

const legendSchema = z.union([z.boolean(), z.object({
  position: z.enum(['left', 'right', 'top', 'bottom']).optional(),
  visible: z.boolean().optional(),
})]).optional();

const axisSchema = z.object({
  visible: z.boolean().optional(),
  format: z.string().optional(),
  label: z.object({
    visible: z.boolean().optional(),
    format: z.string().optional(),
  }).optional(),
}).optional();

// 面积图 Schema
export const areaChartSchema = z.object({
  chartType: z.literal('area'),
  title: titleSchema.optional(),
  data: nonEmptyArray,
  categoryField: z.string().min(1, 'categoryField is required'),
  valueField: z.string().min(1, 'valueField is required'),
  area: z.object({
    smooth: z.boolean().optional(),
    opacity: z.number().min(0).max(1).optional(),
  }).optional(),
  line: z.object({
    visible: z.boolean().optional(),
    width: z.number().optional(),
    style: z.object({
      stroke: z.string().optional(),
    }).optional(),
  }).optional(),
  point: z.object({
    visible: z.boolean().optional(),
    size: z.number().optional(),
    style: z.object({
      fill: z.string().optional(),
    }).optional(),
  }).optional(),
  label: labelSchema,
  xAxis: axisSchema,
  yAxis: axisSchema,
  colors: z.array(z.string()).optional(),
  background: backgroundSchema,
  legend: legendSchema,
});

// 类型导出
export type AreaChartSchemaZod = z.infer<typeof areaChartSchema>;
