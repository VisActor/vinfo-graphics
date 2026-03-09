// 公共类型
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
  BaseChartSchema,
} from './base';

// 图表 Schema 类型
export type { PieChartSchema } from './pie';
export type { BarChartSchema } from './bar';
export type { ColumnChartSchema } from './column';
export type { AreaChartSchema } from './area';
export type { TreemapChartSchema } from './treemap';
export type { CirclePackingChartSchema } from './circle-packing';

// 联合类型
import type { PieChartSchema } from './pie';
import type { BarChartSchema } from './bar';
import type { ColumnChartSchema } from './column';
import type { AreaChartSchema } from './area';
import type { TreemapChartSchema } from './treemap';
import type { CirclePackingChartSchema } from './circle-packing';

/** 所有图表 Schema 的联合类型 */
export type ChartSchema =
  | PieChartSchema
  | BarChartSchema
  | ColumnChartSchema
  | AreaChartSchema
  | TreemapChartSchema
  | CirclePackingChartSchema;
