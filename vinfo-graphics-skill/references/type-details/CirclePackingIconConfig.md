### CirclePackingIconConfig

Icon 配置

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

export type CirclePackingIconConfig = IconConfig & {
  /** 是否显示 icon */
  visible?: boolean;
  /**
   * icon 位置
   * - 'top-left': 左上角
   * - 'top-right': 右上角
   * - 'center': 中心
   */
  position?: 'top-left' | 'top-right' | 'center';
  /** 偏移量 */
  offset?: number;
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
