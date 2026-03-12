export interface AnnotationVerticalLineConfig {
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
}
