import type { BaseChartSchema, LabelConfig, IconConfig, ImageMapConfig } from './base';

/**
 * 矩阵树图 Schema
 *
 * @description 信息图矩阵树图只支持**一层数据**（扁平数组），不支持多层级嵌套。
 * 支持 icon 和每个节点的背景图片配置。
 *
 * @example
 * ```json
 * {
 *   "chartType": "treemap",
 *   "title": "部门预算分布",
 *   "data": [
 *     { "dept": "前端组", "budget": 100, "icon": "fe", "bg": "blue" },
 *     { "dept": "后端组", "budget": 150, "icon": "be", "bg": "green" }
 *   ],
 *   "categoryField": "dept",
 *   "valueField": "budget",
 *   "icon": {
 *     "field": "icon",
 *     "map": { "fe": "/icons/frontend.png" },
 *     "size": 32
 *   },
 *   "backgroundMap": {
 *     "field": "bg",
 *     "map": { "blue": "/images/bg-blue.png" },
 *     "opacity": 0.3
 *   }
 * }
 * ```
 */
export interface TreemapChartSchema extends BaseChartSchema {
  chartType: 'treemap';

  /** 分类字段名 */
  categoryField: string;

  /** 权重字段名 */
  valueField: string;

  /** 节点配置 */
  node?: {
    /** 节点间距 */
    gap?: number;
    /** 内边距 */
    padding?: number;
    /** 圆角 */
    cornerRadius?: number;
  };

  /** Icon 配置 */
  icon?: IconConfig;

  /** 背景图片映射 */
  backgroundMap?: ImageMapConfig;

  /** 标签配置 */
  label?: LabelConfig;
}
