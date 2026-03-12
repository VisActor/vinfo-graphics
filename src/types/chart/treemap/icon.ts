import type { IconConfig } from '../../components/icon';

export type TreemapIconConfig = IconConfig & {
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
