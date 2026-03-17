### CirclePackingLabelConfig

标签配置

```typescript
/**
 * 标签配置（统一结构）
 */
export interface LabelConfig {
  /** 是否显示标签 */
  visible?: boolean;
  /** 标签位置（根据图表类型不同） */
  position?: string;
  /** 格式化字符串，如 '{name}: {value}' */
  format?: string;
  /** 最小可见尺寸，小于此值不显示标签 */
  minVisible?: number;
}

/**
 * 文字样式配置（用于 prominent-value 布局中的数值/名称分别设置样式）
 */
export interface CirclePackingTextStyle {
  /** 字体大小（px），prominent-value 模式下可设为 0 表示自动按圆半径缩放 */
  fontSize?: number;
  /** 字体粗细 */
  fontWeight?: number | string;
  /** 字体颜色 */
  fill?: string;
}

export type CirclePackingLabelConfig = LabelConfig & {
  /** 是否显示百分比（仅单层模式有效） */
  showPercent?: boolean;

  /**
   * 标签布局模式
   * - 'default': 默认布局，名称和数值在同一文本中（通过 format + \n 换行）
   * - 'prominent-value': 突出数值布局，数值(大字)在上，名称(小字)在下，各自独立样式
   */
  layout?: 'default' | 'prominent-value';

  /** 数值行样式（仅 prominent-value 模式有效） */
  valueStyle?: CirclePackingTextStyle;

  /** 名称行样式（仅 prominent-value 模式有效） */
  nameStyle?: CirclePackingTextStyle;
};
```
