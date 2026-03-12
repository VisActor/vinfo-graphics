export type ColumnBrandImageConfig = {
  /** 是否显示 */
  visible?: boolean;
  /** 图片 URL */
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
