export interface AnnotationAreaConfig {
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
}
