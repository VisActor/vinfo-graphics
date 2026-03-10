import type { BaseChartSchema, LabelConfig, IconConfig, ImageMapConfig } from './base';

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
  circle?: {
    /** 圆形间距 */
    padding?: number;
    /** 描边宽度 */
    strokeWidth?: number;
    /** 描边颜色 */
    strokeColor?: string;
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
    position?: 'top-left' | 'top-right' | 'center';
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
     */
    position?: 'top-left' | 'top-right' | 'center';
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

  /** 圆形背景图片配置 */
  circleBackground?: ImageMapConfig & {
    /** 是否显示背景 */
    visible?: boolean;
  };
}
