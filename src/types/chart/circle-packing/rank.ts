export interface CirclePackingRankConfig {
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
}
