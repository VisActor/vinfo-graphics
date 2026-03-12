// ==========================================
// 公共类型（从 base 重新导出）
// ==========================================
export type {
  ChartType,
  DataItem,
  TitleConfig,
  FootnoteConfig,
  FootnoteLayout,
  BackgroundConfig,
  LegendConfig,
  LabelConfig,
  AxisConfig,
  IconConfig,
  ImageMapConfig,
  LinearGradientConfig,
  ThemeType,
  PresetThemeName,
  ThemeConfig,
  Theme,
  BaseChartSchema,
} from './chart/base';

// ==========================================
// 图表 Schema 类型
// ==========================================
export type { PieChartSchema } from './chart/pie';
export type { BarChartSchema } from './chart/bar';
export type { ColumnChartSchema } from './chart/column';
export type { AreaChartSchema } from './chart/area';
export type { TreemapChartSchema } from './chart/treemap';
export type { CirclePackingChartSchema } from './chart/circle-packing';

// ==========================================
// 联合类型
// ==========================================
import type { PieChartSchema } from './chart/pie';
import type { BarChartSchema } from './chart/bar';
import type { ColumnChartSchema } from './chart/column';
import type { AreaChartSchema } from './chart/area';
import type { TreemapChartSchema } from './chart/treemap';
import type { CirclePackingChartSchema } from './chart/circle-packing';

/** 所有图表 Schema 的联合类型 */
export type ChartSchema =
  | PieChartSchema
  | BarChartSchema
  | ColumnChartSchema
  | AreaChartSchema
  | TreemapChartSchema
  | CirclePackingChartSchema;
