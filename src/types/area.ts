import type { BaseChartSchema, LabelConfig, AxisConfig } from './base';

/**
 * 面积图 Schema
 *
 * @description 信息图面积图保持简洁，不支持堆叠、分组、��分比。
 * 如需百分比面积图，后续提供独立的 `percentArea` 类型。
 *
 * @example
 * ```json
 * {
 *   "chartType": "area",
 *   "title": "用户增长趋势",
 *   "data": [
 *     { "month": "1月", "users": 1000 },
 *     { "month": "2月", "users": 1200 },
 *     { "month": "3月", "users": 1500 }
 *   ],
 *   "categoryField": "month",
 *   "valueField": "users",
 *   "area": { "smooth": true, "opacity": 0.6 },
 *   "point": { "visible": true }
 * }
 * ```
 */
export interface AreaChartSchema extends BaseChartSchema {
  chartType: 'area';

  /** 分类字段名（X轴，通常是时间） */
  categoryField: string;

  /** 数值字段名（Y轴） */
  valueField: string;

  /** 面积样式 */
  area?: {
    /** 平滑曲线 */
    smooth?: boolean;
    /** 填充透明度 0-1 */
    opacity?: number;
  };

  /** 线条样式 */
  line?: {
    /** 是否显示线条 */
    visible?: boolean;
    /** 线条宽度 */
    width?: number;
  };

  /** 数据点样式 */
  point?: {
    /** 是否显示数据点 */
    visible?: boolean;
    /** 数据点大小 */
    size?: number;
  };

  /** 标签配置 */
  label?: LabelConfig;

  /** X 轴配置（分类轴） */
  xAxis?: AxisConfig;

  /** Y 轴配置（数值轴） */
  yAxis?: AxisConfig;
}
