import type { BaseChartSchema, LabelConfig, AxisConfig } from './base';

/**
 * 柱图 Schema
 *
 * @description 纵向柱图，用于简单的分类数值对比。信息图柱图保持简洁，不支持分组、堆叠。
 *
 * @example
 * ```json
 * {
 *   "chartType": "column",
 *   "title": "月度销售额",
 *   "data": [
 *     { "month": "1月", "sales": 120 },
 *     { "month": "2月", "sales": 150 },
 *     { "month": "3月", "sales": 180 }
 *   ],
 *   "categoryField": "month",
 *   "valueField": "sales",
 *   "column": { "cornerRadius": [4, 4, 0, 0] }
 * }
 * ```
 */
export interface ColumnChartSchema extends BaseChartSchema {
  chartType: 'column';

  /** 分类字段名（X轴） */
  categoryField: string;

  /** 数值字段名（Y轴） */
  valueField: string;

  /** 柱子样式 */
  column?: {
    /** 柱子宽度 */
    width?: number | string;
    /** 圆角，支持四个角分别设置 [topLeft, topRight, bottomRight, bottomLeft] */
    cornerRadius?: number | [number, number, number, number];
    /** 柱子间距 */
    gap?: number;
  };

  /** 标签配置 */
  label?: LabelConfig & {
    /** 标签位置 */
    position?: 'inside' | 'top';
  };

  /** 排序方式 */
  sort?: 'asc' | 'desc' | 'none';

  /** X 轴配置（分类轴） */
  xAxis?: AxisConfig;

  /** Y 轴配置（数值轴） */
  yAxis?: AxisConfig;
}
