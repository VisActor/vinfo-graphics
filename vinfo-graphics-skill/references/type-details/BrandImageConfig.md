### BrandImageConfig

装饰图片，一般用于装饰图表，可以放在底层，也可以放在上层

```typescript
/**
 * 装饰图片配置
 */
export interface BrandImageConfig {
  /** 是否显示 */
  visible?: boolean;
  /** 图片URL */
  url: string;
  /** 图片宽度 */
  width?: number;
  /** 图片高度 */
  height?: number;
  /**
   * 图片与图表的对齐方式
   * - 'left': 左对齐
   * - 'center': 居中对齐
   * - 'right': 右对齐
   */
  align?: 'left' | 'center' | 'right';
  /**
   * 图片与图表的垂直对齐方式
   * - 'top': 顶部对齐
   * - 'middle': 垂直居中对齐
   * - 'bottom': 底部对齐
   * - 默认值为 'middle'，即垂直居中对齐
   */
  verticalAlign?: 'top' | 'middle' | 'bottom';
  /**
   * 是否将图片作为图表前景显示（覆盖在图表上方），默认为 false，即作为背景显示
   */
  asForeground?: boolean;
}
```
