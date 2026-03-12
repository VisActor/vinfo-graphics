### FootnoteConfig

脚注配置，支持图片和文字的多种布局

```typescript
/**
 * 脚注配置
 */
export interface FootnoteConfig {
  /** 脚注文本 */
  text?: string;
  /** 脚注图片 URL */
  image?: string;
  /** 布局方式，默认 'left' */
  layout?: FootnoteLayout;
  /** 字体大小，默认 12 */
  fontSize?: number;
  /** 字体颜色，默认 '#999' */
  fill?: string;
  /** 图片宽度，默认 16 */
  imageWidth?: number;
  /** 图片高度，默认 16 */
  imageHeight?: number;
  /** 图片和文字之间的间距，默认 8 */
  gap?: number;
  /** 距离图表区域的偏移量，默认 10 */
  offset?: number;
}
```
