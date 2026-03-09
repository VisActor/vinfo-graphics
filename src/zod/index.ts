/**
 * Zod 验证 Schema
 *
 * 提供基于 Zod 的运行时验证，支持更精细的验证规则
 *
 * @example
 * ```typescript
 * import { pieChartSchema, validateWithZod } from 'vinfo-graphics/zod';
 *
 * const result = validateWithZod(pieChartSchema, {
 *   chartType: 'pie',
 *   data: [{ name: 'A', value: 30 }],
 *   categoryField: 'name',
 *   valueField: 'value'
 * });
 * ```
 */

import { z } from 'zod';

// 重新导出各图表的 Zod Schema
export { pieChartSchema } from './pie';
export type { PieChartSchemaZod } from './pie';

export { barChartSchema } from './bar';
export type { BarChartSchemaZod } from './bar';

export { columnChartSchema } from './column';
export type { ColumnChartSchemaZod } from './column';

export { areaChartSchema } from './area';
export type { AreaChartSchemaZod } from './area';

export { treemapChartSchema } from './treemap';
export type { TreemapChartSchemaZod } from './treemap';

export { circlePackingChartSchema } from './circle-packing';
export type { CirclePackingChartSchemaZod } from './circle-packing';

/**
 * 根据图表类型获取对应的 Zod Schema
 */
export function getChartSchema(chartType: string) {
  switch (chartType) {
    case 'pie':
      return pieChartSchema;
    case 'bar':
      return barChartSchema;
    case 'column':
      return columnChartSchema;
    case 'area':
      return areaChartSchema;
    case 'treemap':
      return treemapChartSchema;
    case 'circlePacking':
      return circlePackingChartSchema;
    default:
      return null;
  }
}

/**
 * 验证图表数据
 */
export function validateWithZod<T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: string[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map((issue: z.ZodIssue) => {
    const path = issue.path.join('.');
    return path ? `${path}: ${issue.message}` : issue.message;
  });

  return { success: false, errors };
}
