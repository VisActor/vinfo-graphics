import type { IconConfig } from '../../components/icon';

export type PieIconConfig = IconConfig & {
  /** 是否显示 icon */
  visible?: boolean;
  /**
   * 当 position 不等于 'inside' 的时候，设置定位相对于定位点的偏移半径，默认值为 10px
   */
  offsetRadius?: number;
  /**
   * 设置 icon 的位置
   * - 'inside-inner': 扇区内部靠近圆心的位置
   * - 'inside-outer': 扇区内部靠近外侧的位置
   * - 'inside': 扇区中心点
   * - 'outside': 外侧
   */
  position?: 'inside-inner' | 'inside-outer' | 'outside' | 'inside';
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
