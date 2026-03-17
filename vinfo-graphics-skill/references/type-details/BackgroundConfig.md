### BackgroundConfig

背景配置，支持背景图片、颜色等

```typescript
/**
 * 背景配置（图表整体背景）
 * 注意，image、linearGradient 和 color 三者优先级依次降低，如果同时存在，优先使用 image，其次 linearGradient，最后 color
 */
export interface BackgroundConfig {
  /** 背景图片 URL */
  image?: string;
  /** 背景色 */
  color?: string;
  /** 线形渐变色 */
  linearGradient?: LinearGradientConfig;
  /**
   * 0-1，背景透明度
   */
  opacity?: number;
}
```
