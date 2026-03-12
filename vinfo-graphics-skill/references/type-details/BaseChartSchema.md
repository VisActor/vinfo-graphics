### BaseChartSchema

```typescript
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
```
