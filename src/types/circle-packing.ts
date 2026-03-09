import type { BaseChartSchema, LabelConfig, ImageMapConfig } from './base';

/**
 * 圆形闭包图 Schema
 *
 * @description 信息图圆形闭包图只支持**一层数据**（扁平数组），不支持多层级嵌套。
 * 支持每个圆配置独立的背景图片。
 *
 * @example
 * ```json
 * {
 *   "chartType": "circlePacking",
 *   "title": "产品销售分布",
 *   "data": [
 *     { "product": "手机", "sales": 1200, "bg": "phone" },
 *     { "product": "电脑", "sales": 800, "bg": "computer" }
 *   ],
 *   "categoryField": "product",
 *   "valueField": "sales",
 *   "backgroundMap": {
 *     "field": "bg",
 *     "map": { "phone": "/images/phone-bg.png" },
 *     "opacity": 0.5
 *   }
 * }
 * ```
 */
export interface CirclePackingChartSchema extends BaseChartSchema {
  chartType: 'circlePacking';

  /** 分类字段名 */
  categoryField: string;

  /** 权重字段名 */
  valueField: string;

  /** 圆形配置 */
  circle?: {
    /** 圆形间距 */
    padding?: number;
    /** 描边宽度 */
    strokeWidth?: number;
    /** 描边颜色 */
    strokeColor?: string;
  };

  /** 背景图片映射 */
  backgroundMap?: ImageMapConfig;

  /** 标签配置 */
  label?: LabelConfig;
}
