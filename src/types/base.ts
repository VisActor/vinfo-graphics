/**
 * 图表类型枚举
 */
export type ChartType = 'pie' | 'bar' | 'column' | 'area' | 'treemap' | 'circlePacking';

/**
 * 主题类型
 */
export type ThemeType = 'light' | 'dark';

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
  | 'ats'; // 招聘系统信息图（科技蓝环图配色）

/**
 * 自定义主题配置
 */
export interface ThemeConfig {
  /** 主题类型：light 或 dark */
  type: ThemeType;
  /** 主题名称：使用预设主题 */
  name: PresetThemeName;
  /** 自定义颜色数组 */
  colors: string[];
  /** 背景色 */
  backgroundColor: string;
  /** 文字颜色 */
  textColor: string;
  /** 次要文字颜色 */
  secondaryTextColor: string;
}

/**
 * 主题配置（可以是预设名称或自定义配置）
 */
export type Theme = PresetThemeName | ThemeConfig;

/**
 * 数据项类型（任意对象）
 */
export type DataItem = Record<string, unknown>;

/**
 * 标题配置
 */
export interface TitleConfig {
  /** 标题文本 */
  text: string;
  /** 标题位置 */
  position?: 'left' | 'center' | 'right';
  /** 副标题 */
  subtext?: string;
}

/**
 * 脚注布局方式
 * - 'left': 图片和文字都在左侧
 * - 'right': 图片和文字都在右侧
 * - 'image-left-text-right': 图片在左侧，文字在右侧
 * - 'image-right-text-left': 文字在左侧，图片在右侧
 * - 'center': 居中显示（图片和文字一起居中）
 */
export type FootnoteLayout =
  | 'left'
  | 'right'
  | 'image-left-text-right'
  | 'image-right-text-left'
  | 'center';

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

/**
 * 背景配置（图表整体背景）
 */
export interface BackgroundConfig {
  /** 背景图片 URL */
  image?: string;
  /** 背景色 */
  color?: string;
  /** 线形渐变色 */
  linearGradient?: LinearGradientConfig;
}

/**
 * 线形渐变配置
 */
export interface LinearGradientConfig {
  /** 渐变方向 */
  direction?: 'left-right' | 'right-left' | 'top-bottom' | 'bottom-top';
  /** 渐变颜色数组 */
  colors: string[];
}

/**
 * 图例配置
 */
export interface LegendConfig {
  /** 是否显示图例 */
  visible?: boolean;
  /** 图例位置 */
  position?: 'top' | 'bottom' | 'left' | 'right';
}

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

/**
 * 坐标轴配置
 */
export interface AxisConfig {
  /** 是否显示坐标轴 */
  visible?: boolean;
  /** 格式化字符串，如 '{value}万' */
  format?: string;
}

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

/**
 * 图片映射配置（用于 treemap/circlePacking 的节点背景）
 */
export interface ImageMapConfig {
  /** 从 data 中读取的字段名 */
  field?: string;
  /** 分类值 -> image URL 映射表 */
  map?: Record<string, string>;
  /** 透明度 0-1 */
  opacity?: number;
}

/**
 * 所有信息图的公共配置
 */
export interface BaseChartSchema {
  /** 图表类型 */
  chartType: ChartType;

  /** 图表标题 */
  title?: string | TitleConfig;

  /** 脚注 */
  footnote?: FootnoteConfig;

  /** 数据（扁平数组） */
  data: DataItem[];

  /** 画布宽度 */
  width?: number;

  /** 画布高度 */
  height?: number;

  /** 背景配置 */
  background?: BackgroundConfig;

  /** 颜色配置 */
  colors?: string[];

  /** 图例配置 */
  legend?: boolean | LegendConfig;

  /** 主题配置 */
  theme?: Theme;
}
