import { LinearGradientConfig } from '../../components/linear-gradient';

export interface BarStyleConfig {
  /** 条形宽度 */
  width?: number | string;
  /** 圆角 */
  cornerRadius?: number;
  /** 条形间距 */
  gap?: number;
  /** 渐变填充 */
  linearGradient?: LinearGradientConfig;
}
