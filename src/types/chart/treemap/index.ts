import type { BaseChartSchema } from '../base';
import type { TreemapIconConfig } from './icon';
import type { TreemapLabelConfig } from './label';
import type { TreemapNodeBackgroundConfig } from './node-background';
import type { TreemapNodeConfig } from './node';
import type { TreemapRankConfig } from './rank';

/**
 * 矩阵树图 Schema
 *
 * @description 信息图矩阵树图支持单层和分组两种模式：
 * - 单层模式：无 groupField，数据直接展示为叶子节点
 * - 分组模式：有 groupField，数据按 groupField 分组展示
 *
 * @example 单层模式
 * ```json
 * {
 *   "chartType": "treemap",
 *   "title": "部门预算分布",
 *   "data": [
 *     { "dept": "前端组", "budget": 100, "icon": "fe" },
 *     { "dept": "后端组", "budget": 150, "icon": "be" }
 *   ],
 *   "categoryField": "dept",
 *   "valueField": "budget",
 *   "icon": {
 *     "field": "icon",
 *     "map": { "fe": "/icons/frontend.png" },
 *     "size": 32
 *   }
 * }
 * ```
 *
 * @example 分组模式
 * ```json
 * {
 *   "chartType": "treemap",
 *   "title": "公司预算分布",
 *   "data": [
 *     { "dept": "前端组", "company": "A公司", "budget": 100 },
 *     { "dept": "后端组", "company": "A公司", "budget": 150 },
 *     { "dept": "前端组", "company": "B公司", "budget": 80 }
 *   ],
 *   "categoryField": "dept",
 *   "valueField": "budget",
 *   "groupField": "company"
 * }
 * ```
 */
export interface TreemapChartSchema extends BaseChartSchema {
  chartType: 'treemap';

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

  /** 节点配置 */
  node?: TreemapNodeConfig;

  /** 标签配置 */
  label?: TreemapLabelConfig;

  /** 排名标签配置（仅单层模式有效） */
  rank?: TreemapRankConfig;

  /** Icon 配置 */
  icon?: TreemapIconConfig;

  /** 节点背景图片配置 */
  nodeBackground?: TreemapNodeBackgroundConfig;
}
