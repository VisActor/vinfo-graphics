/**
 * VInfo Graphics - 信息图图表库
 *
 * 基于 VChart 的信息图 Schema 库，提供简化的，大模型友好的图表配置。
 *
 * @example
 * ```typescript
 * import { toVChartSpec, createChart } from 'vinfo-graphics';
 *
 * // 定义图表 Schema
 * const schema = {
 *   chartType: 'bar',
 *   title: '用户分布',
 *   data: [
 *     { platform: '微信', users: 1200 },
 *     { platform: '抖音', users: 800 }
 *   ],
 *   categoryField: 'platform',
 *   valueField: 'users',
 *   sort: 'desc'
 * };
 *
 * // 转换为 VChart Spec
 * const spec = toVChartSpec(schema);
 *
 * // 或直接创建图表
 * const chart = createChart(schema, document.getElementById('chart'));
 * ```
 */

// 类型导出
export type {
  // 公共类型
  ChartType,
  DataItem,
  TitleConfig,
  BackgroundConfig,
  LegendConfig,
  LabelConfig,
  AxisConfig,
  IconConfig,
  ImageMapConfig,
  BaseChartSchema,

  // 主题类型
  ThemeType,
  PresetThemeName,
  ThemeConfig,
  Theme,

  // 图表 Schema 类型
  PieChartSchema,
  BarChartSchema,
  ColumnChartSchema,
  AreaChartSchema,
  TreemapChartSchema,
  CirclePackingChartSchema,

  // 联合类型
  ChartSchema,
} from './types';

// 主题导出
export { presetThemes, resolveTheme, isDarkTheme } from './themes';

// 转换器导出
export {
  BaseConverter,
  PieChartConverter,
  BarChartConverter,
  ColumnChartConverter,
  AreaChartConverter,
  TreemapChartConverter,
  CirclePackingChartConverter,
} from './converters';

// 主 API
import type { ChartSchema } from './types';
import { BarChartConverter } from './converters/bar';
import { ColumnChartConverter } from './converters/column';
import { AreaChartConverter } from './converters/area';
import { TreemapChartConverter } from './converters/treemap';
import { CirclePackingChartConverter } from './converters/circle-packing';
import type { BaseConverter } from './converters/base';
import { PieChartConverter } from './converters/pie';

export { validateWithZod } from './schemas';

// 转换器映射
const converters: Record<string, BaseConverter<any>> = {
  pie: new PieChartConverter(),
  bar: new BarChartConverter(),
  column: new ColumnChartConverter(),
  area: new AreaChartConverter(),
  treemap: new TreemapChartConverter(),
  circlePacking: new CirclePackingChartConverter(),
};

/**
 * 将 Schema 转换为 VChart Spec
 *
 * @param schema - 图表 Schema
 * @returns VChart Spec 对象
 * @throws Error 如果图表类型不支持或校验失败
 *
 * @example
 * ```typescript
 * const spec = toVChartSpec({
 *   chartType: 'pie',
 *   data: [{ name: 'A', value: 30 }],
 *   categoryField: 'name',
 *   valueField: 'value'
 * });
 * ```
 */
export function toVChartSpec(schema: ChartSchema): Record<string, unknown> {
  const converter = converters[schema.chartType];

  if (!converter) {
    throw new Error(`Unsupported chart type: ${schema.chartType}`);
  }

  // 校验
  const validation = converter.validate(schema as any);
  if (!validation.valid) {
    throw new Error(`Schema validation failed: ${validation.errors.join(', ')}`);
  }

  // 转换
  return converter.convert(schema as any);
}

/**
 * 校验 Schema
 *
 * @param schema - 图表 Schema
 * @returns 校验结果
 *
 * @example
 * ```typescript
 * const result = validate({
 *   chartType: 'bar',
 *   data: [{ name: 'A', value: 30 }],
 *   categoryField: 'name',
 *   valueField: 'value'
 * });
 * // result.valid === true
 * ```
 */
export function validate(schema: ChartSchema): { valid: boolean; errors: string[] } {
  const converter = converters[schema.chartType];

  if (!converter) {
    return { valid: false, errors: [`Unknown chart type: ${schema.chartType}`] };
  }

  return converter.validate(schema as any);
}

/**
 * 获取图表类型的默认配置
 *
 * @param chartType - 图表类型
 * @returns 默认配置
 */
export function getDefaults(chartType: string): Record<string, unknown> {
  const converter = converters[chartType];
  return converter?.getDefaults() ?? {};
}
