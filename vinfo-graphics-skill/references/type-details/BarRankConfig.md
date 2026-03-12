### BarRankConfig

排名标签

```typescript
export type BarRankConfig = {
  /** 是否显示排名 */
  visible?: boolean;
  /**
   * 排名位置
   * - 'start': 显示在条形起始位置（左侧）
   * - 'end': 显示在条形结束位置（右侧）
   * - 'yAxis': 显示在分类轴（Y轴）对应位置
   */
  position?: 'start' | 'end' | 'yAxis';
  /** 排名样式 */
  style?: {
    /** 字体大小 */
    fontSize?: number;
    /** 字体颜色 */
    fill?: string;
    /** 字体粗细 */
    fontWeight?: number | string;
    /** 背景色 */
    backgroundColor?: string;
    /** 圆角 */
    cornerRadius?: number;
  };
};
```
