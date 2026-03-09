import type {
  BaseChartSchema,
  LabelConfig,
  AxisConfig,
  IconConfig,
  LinearGradientConfig,
} from './base';

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
  bar?: {
    /** 条形宽度 */
    width?: number | string;
    /** 圆角 */
    cornerRadius?: number;
    /** 条形间距 */
    gap?: number;
    /** 渐变填充 */
    linearGradient?: LinearGradientConfig;
  };

  /** 排名标签 */
  rank?: {
    /** 是否显示排名 */
    visible?: boolean;
    /**
     * 排名位置
     * - 'start': 显示在条形起始位置（左侧）
     * - 'end': 显示在条形结束位置（右侧）
     * - 'yAxis': 显示在分类轴（Y轴）对应位置
     */
    position?: 'start' | 'end' | 'yAxis';
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
      /** 圆角 */
      cornerRadius?: number;
    };
  };

  /** 标签配置 */
  label?: LabelConfig & {
    /** 标签位置 */
    position?:
      | 'inside'
      | 'inside-left'
      | 'inside-right'
      | 'inside-top'
      | 'inside-bottom'
      | 'outside'
      | 'top-right'
      | 'top-left'
      | 'bottom-right'
      | 'bottom-left'
      | 'right'
      | 'left'
      | 'top'
      | 'bottom';
  };

  /** Icon 配置（信息图特色） */
  icon?: IconConfig & {
    /** 是否显示icon */
    visible?: boolean;
    /** icon 位置（适用于条形图） */
    position?: 'start' | 'end';

    /**
     * icon 后紧跟着标签显示
     */
    label?: {
      /** 是否显示标签 */
      visible?: boolean;
      /**
       * 标签和 icon 之间的间距，单位像素
       * - 正值表示标签在 icon 之后，负值表示标签在 icon 之前
       * - 例如，position 为 'start' 时，正值表示标签在 icon 右侧，负值表示标签在 icon 左侧
       * - position 为 'end' 时，正值表示标签在 icon 左侧，负值表示标签在 icon 右侧
       * - 默认值为 10，即标签在 icon 之后并有 10px 间距
       * - 设置为 0 则紧贴显示，设置为负值则重叠显示
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
      /**
       * 描边宽度
       */
      lineWidth?: number;
      /**
       * 描边颜色
       */
      stroke?: string;
    };
  };

  /** 排序方式 */
  sort?: 'asc' | 'desc' | 'none';

  /** 装饰图片，一般用于装饰图表，可以放在底层，也可以放在上层 */
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
     * - 'left': 左对齐
     * - 'center': 居中对齐
     * - 'right': 右对齐
     */
    align?: 'left' | 'center' | 'right';
    /**
     * 图片与图表的垂直对齐方式
     * - 'top': 顶部对齐
     * - 'middle': 垂直居中对齐
     * - 'bottom': 底部对齐
     * - 默认值为 'middle'，即垂直居中对齐
     */
    verticalAlign?: 'top' | 'middle' | 'bottom';
    /**
     * 是否将图片作为图表前景显示（覆盖在图表上方），默认为 false，即作为背景显示
     */
    asForeground?: boolean;
  };

  /** X 轴配置（数值轴） */
  xAxis?: AxisConfig;

  /** Y 轴配置（分类轴） */
  yAxis?: AxisConfig;
}
