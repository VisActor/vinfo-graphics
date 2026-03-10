import type {
  BaseChartSchema,
  LabelConfig,
  AxisConfig,
  IconConfig,
  LinearGradientConfig,
} from './base';

/**
 * 柱图 Schema
 *
 * @description 纵向柱图，用于简单的分类数值对比。信息图柱图保持简洁，不支持分组、堆叠。
 *
 * @example
 * ```json
 * {
 *   "chartType": "column",
 *   "title": "月度销售额",
 *   "data": [
 *     { "month": "1月", "sales": 120 },
 *     { "month": "2月", "sales": 150 },
 *     { "month": "3月", "sales": 180 }
 *   ],
 *   "categoryField": "month",
 *   "valueField": "sales",
 *   "column": { "cornerRadius": [4, 4, 0, 0] }
 * }
 * ```
 */
export interface ColumnChartSchema extends BaseChartSchema {
  chartType: 'column';

  /** 分类字段名（X轴） */
  categoryField: string;

  /** 数值字段名（Y轴） */
  valueField: string;

  /** 柱子样式 */
  column?: {
    /** 柱子宽度 */
    width?: number | string;
    /** 圆角，支持四个角分别设置 [topLeft, topRight, bottomRight, bottomLeft] */
    cornerRadius?: number | [number, number, number, number];
    /** 柱子间距 */
    gap?: number;
    /** 渐变填充 */
    linearGradient?: LinearGradientConfig;
  };

  /** 标签配置 */
  label?: LabelConfig & {
    /** 标签位置 */
    position?: 'inside' | 'top' | 'bottom';
  };

  /** Icon 配置（信息图特色） */
  icon?: IconConfig & {
    /** 是否显示 icon */
    visible?: boolean;
    /**
     * icon 位置
     * - 'bottom': 显示在柱子底部（X轴上方）
     * - 'top': 显示在柱子顶部
     */
    position?: 'bottom' | 'top';

    /**
     * icon的尺寸大小
     */
    size?: number;

    /**
     * icon 后紧跟着标签显示
     */
    label?: {
      /** 是否显示标签 */
      visible?: boolean;
      /**
       * 标签和 icon 之间的间距，单位像素
       * - 正值表示标签在 icon 下方，负值表示标签在 icon 上方
       * - 默认值为 10
       */
      offset?: number;
      /**
       * 标签样式
       */
      style?: {
        /** 字体大小 */
        fontSize?: number;
        /** 字体颜色 */
        fill?: string;
        /** 字体粗细 */
        fontWeight?: number | string;
      };
    };

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

  /** 装饰图片，一般用于装饰图表 */
  brandImage?: {
    /** 是否显示 */
    visible?: boolean;
    /** 图片URL */
    url: string;
    /** 图片宽度 */
    width?: number;
    /** 图片高度 */
    height?: number;
    /**
     * 图片与图表的对齐方式
     */
    align?: 'left' | 'center' | 'right';
    /**
     * 图片与图表的垂直对齐方式
     */
    verticalAlign?: 'top' | 'middle' | 'bottom';
    /**
     * 是否将图片作为图表前景显示
     */
    asForeground?: boolean;
  };

  /** 排序方式 */
  sort?: 'asc' | 'desc' | 'none';

  /** X 轴配置（分类轴） */
  xAxis?: AxisConfig;

  /** Y 轴配置（数值轴） */
  yAxis?: AxisConfig;
}
