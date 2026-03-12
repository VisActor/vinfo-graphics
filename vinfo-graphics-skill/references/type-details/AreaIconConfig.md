### AreaIconConfig

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

export type AreaIconConfig = IconConfig & {
  /** 是否显示 icon */
  visible?: boolean;
  /**
   * icon 位置
   * - 'top': 显示在数据点上方
   * - 'bottom': 显示在数据点下方
   */
  position?: 'top' | 'bottom';

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
