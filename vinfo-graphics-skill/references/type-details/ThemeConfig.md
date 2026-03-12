### ThemeConfig

```typescript
/**
 * 自定义主题配置
 */
export interface ThemeConfig {
  /** 主题名称（可选，用于标识预设主题） */
  name?: PresetThemeName;
  /** 主题类型：light 或 dark */
  type: ThemeType;
  /** 自定义颜色数组 */
  colors: string[];
  /** 背景色 */
  backgroundColor: string;
  /** 文字颜色 */
  textColor: string;
  /** 次要文字颜色 */
  secondaryTextColor: string;
}
```
