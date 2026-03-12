### BarLabelConfig

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

export type BarLabelConfig = LabelConfig & {
  /** 标签位置 */
  position?:
    | 'inside'
    | 'inside-left'
    | 'inside-right'
    | 'inside-top'
    | 'inside-bottom'
    | 'outside'
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'right'
    | 'left'
    | 'top'
    | 'bottom';
};
```
