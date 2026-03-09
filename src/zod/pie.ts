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

const iconConfigSchema = z.object({
  field: z.string(),
  map: z.record(z.string(), z.string()),
  size: z.number().optional(),
  position: z.enum(['start', 'end', 'center']).optional(),
}).optional();

const backgroundMapConfigSchema = z.object({
  field: z.string(),
  map: z.record(z.string(), z.string()),
  opacity: z.number().optional(),
}).optional();

// 饼图 Schema
export const pieChartSchema = z.object({
  chartType: z.literal('pie'),
  title: titleSchema.optional(),
  data: nonEmptyArray,
  categoryField: z.string().min(1, 'categoryField is required'),
  valueField: z.string().min(1, 'valueField is required'),
  innerRadius: z.number().min(0).max(1).optional(),
  outerRadius: z.number().min(0).max(1).optional(),
  label: labelSchema,
  colors: z.array(z.string()).optional(),
  background: backgroundSchema,
  legend: legendSchema,
  icon: iconConfigSchema,
  backgroundMap: backgroundMapConfigSchema,
});

// 类型导出
export type PieChartSchemaZod = z.infer<typeof pieChartSchema>;
