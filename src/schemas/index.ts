/**
 * Zod 验证 Schema
 *
 * 提供基于 Zod 的运行时验证，支持更精细的验证规则
 *
 * @example
 * ```typescript
 * import { pieChartSchema, validateWithZod } from 'vinfo-graphics/schemas';
 *
 * const result = validateWithZod(pieChartSchema, {
 *   chartType: 'pie',
 *   data: [{ name: 'A', value: 30 }],
 *   categoryField: 'name',
 *   valueField: 'value'
 * });
 *
 * console.log('Result:', result);
 *
 * // 验证结果
 * console.log('✅ 校成功!');
 * console.log('❌ 失败');
 * console.log(result.errors);
 * }
 * ```
 */

import { z } from 'zod';
import type { ZodSchema } from 'zod';
import { pieChartSchema } from './pie';
import { barChartSchema } from './bar';
import { columnChartSchema } from './column';
import { areaChartSchema } from './area';
import { treemapChartSchema } from './treemap';
import { circlePackingChartSchema } from './circle-packing';

export { pieChartSchema } from './pie';
export { barChartSchema } from './bar';
export { columnChartSchema } from './column';
export { areaChartSchema } from './area';
export { treemapChartSchema } from './treemap';
export { circlePackingChartSchema } from './circle-packing';

export type { PieChartSchemaZod } from './pie';
export type { BarChartSchemaZod } from './bar';
export type { ColumnChartSchemaZod } from './column';
export type { AreaChartSchemaZod } from './area';
export type { TreemapChartSchemaZod } from './treemap';
export type { CirclePackingChartSchemaZod } from './circle-packing';

/**
 * 所有图表 schema 映射
 */
export const allChartSchemas = {
  pie: pieChartSchema,
  bar: barChartSchema,
  column: columnChartSchema,
  area: areaChartSchema,
  treemap: treemapChartSchema,
  circlePacking: circlePackingChartSchema,
} as const;

/**
 * 联合 schema（可用于统一校验）
 */
export const chartSchema = z.union([
  pieChartSchema,
  barChartSchema,
  columnChartSchema,
  areaChartSchema,
  treemapChartSchema,
  circlePackingChartSchema,
]);

export type ChartSchemaZod = z.infer<typeof chartSchema>;

type ValidationResult<T> = {
  success: boolean;
  data?: T;
  errors?: string[];
};

function formatZodErrors(error: z.ZodError): string[] {
  return error.errors.map((err) => {
    const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
    return `${path}${err.message}`;
  });
}

/**
 * 使用指定 Zod schema 进行校验
 */
export function validateWithZod<T>(
  schemaOrData: ZodSchema<T> | unknown,
  maybeData?: unknown
): ValidationResult<T | ChartSchemaZod> {
  const hasExplicitSchema = maybeData !== undefined;

  if (hasExplicitSchema) {
    const schema = schemaOrData as ZodSchema<T>;
    const result = schema.safeParse(maybeData);

    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    }

    return {
      success: false,
      errors: formatZodErrors(result.error),
    };
  }

  const data = schemaOrData;
  if (!data || typeof data !== 'object') {
    return {
      success: false,
      errors: ['Input must be an object and include chartType'],
    };
  }

  const chartType = (data as { chartType?: unknown }).chartType;
  if (typeof chartType !== 'string' || chartType.length === 0) {
    return {
      success: false,
      errors: ['chartType is required'],
    };
  }

  const schema = getSchemaByChartType(chartType);
  if (!schema) {
    return {
      success: false,
      errors: [`Unsupported chartType: ${chartType}`],
    };
  }

  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    errors: formatZodErrors(result.error),
  };
}

/**
 * 根据图表类型获取对应 schema
 */
export function getSchemaByChartType(chartType: string): ZodSchema | null {
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
