import type { BaseChartSchema, LabelConfig, IconConfig, ImageMapConfig } from './base';

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
  node?: {
    /** 节点间距 */
    gap?: number;
    /** 内边距 */
    padding?: number;
    /** 圆角 */
    cornerRadius?: number;
  };

  /** 标签配置 */
  label?: LabelConfig & {
    /** 是否显示百分比（仅单层模式有效） */
    showPercent?: boolean;
  };

  /** 排名标签配置（仅单层模式有效） */
  rank?: {
    /** 是否显示排名 */
    visible?: boolean;
    /** 排名位置 */
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    /** 排名样式 */
    style?: {
      /** 字体大小 */
      fontSize?: number;
      /** 字体颜色 */
      fill?: string;
      /** 字体粗细 */
      fontWeight?: number | string;
      /** 背景色 */
      backgroundColor?: string;
    };
  };

  /** Icon 配置 */
  icon?: IconConfig & {
    /** 是否显示 icon */
    visible?: boolean;
    /**
     * icon 位置
     * - 'top-left': 左上角
     * - 'top-right': 右上角
     * - 'center': 中心
     * - 'bottom-left': 左下角
     * - 'bottom-right': 右下角
     */
    position?: 'top-left' | 'top-right' | 'center' | 'bottom-left' | 'bottom-right';
    /** 偏移量 */
    offset?: number;
    /**
     * 样式
     */
    style?: {
      /** 描边宽度 */
      lineWidth?: number;
      /** 描边颜色 */
      stroke?: string;
    };
  };

  /** 节点背景图片配置 */
  nodeBackground?: ImageMapConfig & {
    /** 是否显示背景 */
    visible?: boolean;
  };
}
