import { LinearGradientConfig } from '../../components/linear-gradient';

export interface AreaStyleConfig {
  /** 平滑曲线 */
  smooth?: boolean;
  /** 填充透明度 0-1 */
  opacity?: number;
  /** 渐变填充 */
  linearGradient?: LinearGradientConfig;
}
