### ColumnIconConfig

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

export type ColumnIconConfig = IconConfig & {
  /** 是否显示 icon */
  visible?: boolean;
  /**
   * icon 位置
   * - 'bottom': 显示在柱子底部（X轴上方）
   * - 'top': 显示在柱子顶部
   */
  position?: 'bottom' | 'top';

  /**
   * icon 的尺寸大小
   */
  size?: number;

  /**
   * icon 后紧跟着标签显示
   */
  label?: {
    /** 是否显示标签 */
    visible?: boolean;
    /**
     * 标签和 icon 之间的间距，单位像素
     * - 正值表示标签在 icon 下方，负值表示标签在 icon 上方
     * - 默认值为 10
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
    /** 描边宽度 */
    lineWidth?: number;
    /** 描边颜色 */
    stroke?: string;
  };
};
```
