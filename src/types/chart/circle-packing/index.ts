import type { BaseChartSchema } from '../base';
import type { CirclePackingBackgroundConfig } from './background';
import type { CirclePackingCircleConfig } from './circle';
import type { CirclePackingIconConfig } from './icon';
import type { CirclePackingLabelConfig } from './label';
import type { CirclePackingRankConfig } from './rank';

/**
 * 圆形闭包图 Schema
 *
 * @description 信息图圆形闭包图支持单层和分组两种模式：
 * - 单层模式：无 groupField，数据直接展示为叶子节点
 * - 分组模式：有 groupField，数据按 groupField 分组展示
 *
 * @example 单层模式
 * ```json
 * {
 *   "chartType": "circlePacking",
 *   "title": "产品销售分布",
 *   "data": [
 *     { "product": "手机", "sales": 1200, "icon": "phone" },
 *     { "product": "电脑", "sales": 800, "icon": "computer" }
 *   ],
 *   "categoryField": "product",
 *   "valueField": "sales",
 *   "icon": {
 *     "field": "icon",
 *     "map": { "phone": "/icons/phone.png" },
 *     "size": 32
 *   }
 * }
 * ```
 *
 * @example 分组模式
 * ```json
 * {
 *   "chartType": "circlePacking",
 *   "title": "公司销售分布",
 *   "data": [
 *     { "product": "手机", "company": "A公司", "sales": 1000 },
 *     { "product": "电脑", "company": "A公司", "sales": 800 },
 *     { "product": "手机", "company": "B公司", "sales": 600 }
 *   ],
 *   "categoryField": "product",
 *   "valueField": "sales",
 *   "groupField": "company"
 * }
 * ```
 */
export interface CirclePackingChartSchema extends BaseChartSchema {
  chartType: 'circlePacking';

  /** 分类字段名（叶子节点名称） */
  categoryField: string;

  /** 权重字段名 */
  valueField: string;

  /**
   * 分组字段名（可选）
   * - 不设置时：单层模式，数据直接展示为叶子节点
   * - 设置时：分组模式，数据按 groupField 值分组，每组为一个父节点
   */
  groupField?: string;

  /** 圆形配置 */
  circle?: CirclePackingCircleConfig;

  /** 标签配置 */
  label?: CirclePackingLabelConfig;

  /** 排名标签配置（仅单层模式有效） */
  rank?: CirclePackingRankConfig;

  /** Icon 配置 */
  icon?: CirclePackingIconConfig;

  /** 圆形背景图片配置 */
  circleBackground?: CirclePackingBackgroundConfig;
}
