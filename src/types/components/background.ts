import { LinearGradientConfig } from './linear-gradient';

/**
 * 背景配置（图表整体背景）
 */
export interface BackgroundConfig {
  /** 背景图片 URL */
  image?: string;
  /** 背景色 */
  color?: string;
  /** 线形渐变色 */
  linearGradient?: LinearGradientConfig;
}
