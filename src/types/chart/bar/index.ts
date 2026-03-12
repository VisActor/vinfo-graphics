import { AxisConfig } from '../../components/axis';
import { BrandImageConfig } from '../../components/brand-image';
import type { BaseChartSchema } from '../base';
import { BarIconConfig } from './icon';
import { BarLabelConfig } from './label';
import { BarRankConfig } from './rank';
import { BarStyleConfig } from './style';

/**
 * 条形图 Schema（信息图核心图表）
 *
 * @description 横向条形图，支持 icon 显示、背景图、排序、渐变等功能。
 *
 * @example
 * ```json
 * {
 *   "chartType": "bar",
 *   "title": { "text": "各平台用户数", "position": "right" },
 *   "data": [
 *     { "platform": "微信", "users": 1200, "icon": "wechat" },
 *     { "platform": "抖音", "users": 800, "icon": "douyin" }
 *   ],
 *   "categoryField": "platform",
 *   "valueField": "users",
 *   "rank": {
 *     "visible": true,
 *     "position": "start"
 *   },
 *   "sort": "desc"
 * }
 * ```
 */
export interface BarChartSchema extends BaseChartSchema {
  chartType: 'bar';

  /** 分类字段名（Y轴） */
  categoryField: string;

  /** 数值字段名（X轴） */
  valueField: string;

  /** 条形样式 */
  bar?: BarStyleConfig;

  /** 排名标签 */
  rank?: BarRankConfig;

  /** 标签配置 */
  label?: BarLabelConfig;

  /** Icon 配置（信息图特色） */
  icon?: BarIconConfig;

  /** 排序方式 */
  sort?: 'asc' | 'desc' | 'none';

  /** 装饰图片，一般用于装饰图表，可以放在底层，也可以放在上层 */
  brandImage?: BrandImageConfig;

  /** X 轴配置（数值轴） */
  xAxis?: AxisConfig;

  /** Y 轴配置（分类轴） */
  yAxis?: AxisConfig;
}
