### PresetThemeName

预设主题名称，如 light, dark, fresh, sunset 等

```typescript
/**
 * 预设主题名称
 */
export type PresetThemeName =
  | 'light' // 浅色主题（白底灰字）
  | 'dark' // 深色主题（黑底白字）
  | 'fresh' // 清新现代（蓝绿色）
  | 'sunset' // 暖阳（日落橙黄）
  | 'romantic' // 浪漫粉（粉红珊瑚）
  | 'dream' // 梦幻紫（紫蓝渐变）
  | 'ocean' // 海洋蓝（蓝绿渐变）
  | 'forest' // 森林绿（绿色系）
  | 'neon' // 霓虹（高饱和度）
  | 'pastel' // 粉彩（柔和粉嫩')
  | 'gradient' // 渐变（多色渐变）
  | 'population' // 人口信息图（高对比分类色）
  | 'categorical' // 信息图分类色（通用非相近色）
  | 'euro-charge' // 欧洲充电成本信息图（深色分区色）
  | 'energy' // 能源消费信息图（冷色高对比）
  | 'airline' // 航空市场信息图（环图高对比）
  | 'ownership' // 代际房产信息图（深色分层配色）
  | 'crypto' // 加密货币信息图（矩形热力配色）
  | 'crypto-light' // 加密货币信息图（浅色矩形配色）
  | 'oil' // 原油出口信息图（深色矩形配色）
  | 'layoffs' // 裁员信息图（浅底矩形配色）
  | 'uranium' // 铀供应信息图（深色矩形荧光配色）
  | 'apparel' // 服装制造信息图（深色成本配色）
  | 'portfolio' // 投资组合信息图（暖金扇形配色）
  | 'renewables' // 新能源信息图（深色高对比配色）
  | 'tiktok' // 社媒用户信息图（深色环图配色）
  | 'ats';
```
