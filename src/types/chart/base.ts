// 重新导出公共组件类型
export type { ChartType } from '../components/chart-type';
export type { DataItem } from '../components/data';
export type { TitleConfig } from '../components/title';
export type { FootnoteConfig, FootnoteLayout } from '../components/footnote';
export type { BackgroundConfig } from '../components/background';
export type { LegendConfig } from '../components/legend';
export type { LabelConfig } from '../components/label';
export type { AxisConfig } from '../components/axis';
export type { IconConfig } from '../components/icon';
export type { ImageMapConfig } from '../components/image-map';
export type { LinearGradientConfig } from '../components/linear-gradient';
export type { ThemeType, PresetThemeName, ThemeConfig, Theme } from '../components/theme';

// 导入用于 BaseChartSchema 的类型
import type { BackgroundConfig } from '../components/background';
import type { ChartType } from '../components/chart-type';
import type { DataItem } from '../components/data';
import type { FootnoteConfig } from '../components/footnote';
import type { LegendConfig } from '../components/legend';
import type { PresetThemeName, ThemeConfig } from '../components/theme';
import type { TitleConfig } from '../components/title';

/**
 * 所有信息图的公共配置
 */
export interface BaseChartSchema {
  /** 图表类型 */
  chartType: ChartType;

  /** 图表标题 */
  title?: TitleConfig;

  /** 脚注 */
  footnote?: FootnoteConfig;

  /** 数据（扁平数组） */
  data: DataItem[];

  /** 画布宽度 */
  width?: number;

  /** 画布高度 */
  height?: number;

  /** 背景配置 */
  background?: BackgroundConfig;

  /** 颜色配置 */
  colors?: string[];

  /** 图例配置 */
  legend?: LegendConfig;

  /** 主题配置 */
  theme?: PresetThemeName;
  /**
   * 自定义主题配置，优先级高于 theme 中的预设主题名称
   */
  customizedTheme?: ThemeConfig;
}
