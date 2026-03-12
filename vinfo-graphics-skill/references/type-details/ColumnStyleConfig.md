### ColumnStyleConfig

柱子样式

```typescript
export interface ColumnStyleConfig {
  /** 柱子宽度 */
  width?: number | string;
  /** 圆角，支持四个角分别设置 [topLeft, topRight, bottomRight, bottomLeft] */
  cornerRadius?: number | [number, number, number, number];
  /** 柱子间距 */
  gap?: number;
  /** 渐变填充 */
  linearGradient?: LinearGradientConfig;
}
```
