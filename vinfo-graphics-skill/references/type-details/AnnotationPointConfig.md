### AnnotationPointConfig

标注点配置（使用 vchart markPoint）

```typescript
export interface AnnotationPointConfig {
  /** 标注点选择器：直接指定 category 字段的值来选择数据点 */
  value: string | number;
  /** 标注文字 */
  text?: string;
  /** 标注文字颜色 */
  textColor?: string;
  /** 标注文字大小 */
  textFontSize?: number;
  /** 标注文字是否加粗 */
  textFontWeight?: number | string;
  /** 标注背景是否可见 */
  textBackgroundVisible?: boolean;
  /** 标注背景颜色 */
  textBackgroundColor?: string;
  /** X方向偏移量 */
  offsetX?: number;
  /** Y方向偏移量 */
  offsetY?: number;
}
```
