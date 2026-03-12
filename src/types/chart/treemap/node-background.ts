import type { ImageMapConfig } from '../../components/image-map';

export type TreemapNodeBackgroundConfig = ImageMapConfig & {
  /** 是否显示背景 */
  visible?: boolean;
};
