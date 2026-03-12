import type { BaseChartSchema } from '../base';
import type { PieCenterImageConfig } from './center-image';
import type { PieIconConfig } from './icon';
import type { PieLabelConfig } from './label';

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
 *     { "name": "产品A", "value": 30, "icon": "product-a" },
 *     { "name": "产品B", "value": 25, "icon": "product-b" }
 *   ],
 *   "categoryField": "name",
 *   "valueField": "value",
 *   "innerRadius": 0.5,
 *   "icon": {
 *     "field": "icon",
 *     "map": {
 *       "product-a": "https://example.com/icon-a.png",
 *       "product-b": "https://example.com/icon-b.png"
 *     }
 *   },
 *   "centerImage": {
 *     "url": "https://example.com/logo.png",
 *     "width": 60,
 *     "height": 60
 *   }
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

  /** 外半径比例 0-1，默认 0.8 */
  outerRadius?: number;

  /** 标签配置 */
  label?: PieLabelConfig;

  /** Icon 配置（信息图特色），为每个扇区显示对应的图标 */
  icon?: PieIconConfig;

  /** 中心图片配置（仅环形图有效，innerRadius > 0 时显示） */
  centerImage?: PieCenterImageConfig;
}
