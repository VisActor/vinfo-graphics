### BarIconConfig

Icon 配置（信息图特色）

```typescript
/**
 * Icon 映射配置
 */
export interface IconConfig {
  /** 从 data 中读取的字段名 */
  field?: string;
  /** 分类值 -> image URL 映射表 */
  map?: Record<string, string>;
  /** 图标尺寸 */
  size?: number;
}

export type BarIconConfig = IconConfig & {
  /** 是否显示icon */
  visible?: boolean;
  /** icon 位置（适用于条形图） */
  position?: 'start' | 'end';

  /**
   * icon 后紧跟着标签显示
   */
  label?: {
    /** 是否显示标签 */
    visible?: boolean;
    /**
     * 标签和 icon 之间的间距，单位像素
     * - 正值表示标签在 icon 之后，负值表示标签在 icon 之前
     * - 例如，position 为 'start' 时，正值表示标签在 icon 右侧，负值表示标签在 icon 左侧
     * - position 为 'end' 时，正值表示标签在 icon 左侧，负值表示标签在 icon 右侧
     * - 默认值为 10，即标签在 icon 之后并有 10px 间距
     * - 设置为 0 则紧贴显示，设置为负值则重叠显示
     */
    offset?: number;
    /**
     * 标签样式
     */
    style?: {
      /** 字体大小 */
      fontSize?: number;
      /** 字体颜色 */
      fill?: string;
      /** 字体粗细 */
      fontWeight?: number | string;
    };
  };

  /**
   * 样式
   */
  style?: {
    /**
     * 描边宽度
     */
    lineWidth?: number;
    /**
     * 描边颜色
     */
    stroke?: string;
  };
};
```
