import type { IconConfig } from '../../components/icon';

export type CirclePackingIconConfig = IconConfig & {
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
