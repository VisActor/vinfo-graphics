import type { IconConfig } from '../../components/icon';

export type AreaIconConfig = IconConfig & {
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
