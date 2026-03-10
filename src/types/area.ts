import type { BaseChartSchema, LabelConfig, AxisConfig, IconConfig, LinearGradientConfig } from './base';

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
  area?: {
    /** 平滑曲线 */
    smooth?: boolean;
    /** 填充透明度 0-1 */
    opacity?: number;
    /** 渐变填充 */
    linearGradient?: LinearGradientConfig;
  };

  /** 线条样式 */
  line?: {
    /** 是否显示线条 */
    visible?: boolean;
    /** 线条宽度 */
    width?: number;
    /** 线条颜色 */
    color?: string;
  };

  /** 数据点样式 */
  point?: {
    /** 是否显示数据点 */
    visible?: boolean;
    /** 数据点大小 */
    size?: number;
  };

  /** 标签配置 */
  label?: LabelConfig;

  /** Icon 配置（信息图特色） */
  icon?: IconConfig & {
    /** 是否显示 icon */
    visible?: boolean;
    /**
     * icon 位置
     * - 'top': 显示在数据点上方
     * - 'bottom': 显示在数据点下方
     */
    position?: 'top' | 'bottom';

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

  /** 标注点配置（使用 vchart markPoint） */
  annotationPoint?: {
    /** 标注点选择器：直接指定 category 字段的值来选择数据点 */
    value: string | number;
    /** 标注文字 */
    text?: string;
    /** 标注文字颜色 */
    textColor?: string;
    /** 标注文字大小 */
    textFontSize?: number;
    /** 标注文字是否加粗 */
    textFontWeight?: number | string;
    /** 标注背景是否可见 */
    textBackgroundVisible?: boolean;
    /** 标注背景颜色 */
    textBackgroundColor?: string;
    /** X方向偏移量 */
    offsetX?: number;
    /** Y方向偏移量 */
    offsetY?: number;
  }[];

  /** 垂直标注线配置（使用 vchart markLine） */
  annotationVerticalLine?: {
    /** X轴的值，可以是类目值如 '3月'，或者数值 */
    xValue: string | number;
    /** 标注文字 */
    text?: string;
    /** 标注文字颜色 */
    textColor?: string;
    /** 标注文字大小 */
    textFontSize?: number;
    /** 标注背景是否可见 */
    textBackgroundVisible?: boolean;
    /** 标注背景颜色 */
    textBackgroundColor?: string;
    /** 线是否可见 */
    lineVisible?: boolean;
    /** 线颜色 */
    lineColor?: string;
    /** 线宽度 */
    lineWidth?: number;
    /** 线样式 */
    lineStyle?: 'solid' | 'dashed' | 'dotted';
  }[];

  /** 水平标注线配置（使用 vchart markLine） */
  annotationHorizontalLine?: {
    /** Y轴的值 */
    yValue: number;
    /** 标注文字 */
    text?: string;
    /** 标注文字颜色 */
    textColor?: string;
    /** 标注文字大小 */
    textFontSize?: number;
    /** 标注背景是否可见 */
    textBackgroundVisible?: boolean;
    /** 标注背景颜色 */
    textBackgroundColor?: string;
    /** 线是否可见 */
    lineVisible?: boolean;
    /** 线颜色 */
    lineColor?: string;
    /** 线宽度 */
    lineWidth?: number;
    /** 线样式 */
    lineStyle?: 'solid' | 'dashed' | 'dotted';
  }[];

  /** 标注区域配置（使用 vchart markArea） */
  annotationArea?: {
    /** 区域选择器：指定起始和结束的 category 值 */
    startValue: string | number;
    endValue: string | number;
    /** 标注文字 */
    text?: string;
    /** 标注文字颜色 */
    textColor?: string;
    /** 标注文字大小 */
    textFontSize?: number;
    /** 区域颜色 */
    areaColor?: string;
    /** 区域透明度 */
    areaColorOpacity?: number;
  }[];

  /** X 轴配置（分类轴） */
  xAxis?: AxisConfig;

  /** Y 轴配置（数值轴） */
  yAxis?: AxisConfig;
}
