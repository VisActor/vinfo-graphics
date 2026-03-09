import type { BaseChartSchema, LabelConfig } from './base';

/**
 * 饼图 Schema
 *
 * @description 信息图饼图保持简洁，不支持玫瑰图。如需玫瑰图，后续提供独立的 rose 类型。
 *
 * @example
 * ```json
 * {
 *   "chartType": "pie",
 *   "title": "市场份额",
 *   "data": [
 *     { "name": "产品A", "value": 30 },
 *     { "name": "产品B", "value": 25 }
 *   ],
 *   "categoryField": "name",
 *   "valueField": "value",
 *   "innerRadius": 0.5
 * }
 * ```
 */
export interface PieChartSchema extends BaseChartSchema {
  chartType: 'pie';

  /** 分类字段名 */
  categoryField: string;

  /** 数值字段名 */
  valueField: string;

  /** 内半径比例 0-1，默认 0（饼图），0.5+ 为环形图 */
  innerRadius?: number;

  /** 外半径比��� 0-1，默认 0.8 */
  outerRadius?: number;

  /** 标签配置 */
  label?: LabelConfig & {
    /** 标签位置 */
    position?: 'inside' | 'outside' | 'spider';
  };
}
