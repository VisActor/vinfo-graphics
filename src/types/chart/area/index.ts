import { AxisConfig } from '../../components/axis';
import { AnnotationVerticalLineConfig } from '../../components/annotatio-vertical-line';
import { AnnotationAreaConfig } from '../../components/annotation-area';
import { AnnotationHorizontalLineConfig } from '../../components/annotation-horizontal-line';
import { AnnotationPointConfig } from '../../components/annotation-point';
import { BrandImageConfig } from '../../components/brand-image';
import { LabelConfig } from '../../components/label';
import type { BaseChartSchema } from '../base';
import type { AreaIconConfig } from './icon';
import type { AreaLineConfig } from './line';
import type { AreaPointConfig } from './point';
import type { AreaStyleConfig } from './style';

/**
 * 面积图 Schema
 *
 * @description 信息图面积图保持简洁，不支持堆叠、分组、百分比。
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
  area?: AreaStyleConfig;

  /** 线条样式 */
  line?: AreaLineConfig;

  /** 数据点样式 */
  point?: AreaPointConfig;

  /** 标签配置 */
  label?: LabelConfig;

  /** Icon 配置（信息图特色） */
  icon?: AreaIconConfig;

  /** 装饰图片，一般用于装饰图表 */
  brandImage?: BrandImageConfig;

  /** 标注点配置（使用 vchart markPoint） */
  annotationPoint?: AnnotationPointConfig[];

  /** 垂直标注线配置（使用 vchart markLine） */
  annotationVerticalLine?: AnnotationVerticalLineConfig[];

  /** 水平标注线配置（使用 vchart markLine） */
  annotationHorizontalLine?: AnnotationHorizontalLineConfig[];

  /** 标注区域配置（使用 vchart markArea） */
  annotationArea?: AnnotationAreaConfig[];

  /** X 轴配置（分类轴） */
  xAxis?: AxisConfig;

  /** Y 轴配置（数值轴） */
  yAxis?: AxisConfig;
}
