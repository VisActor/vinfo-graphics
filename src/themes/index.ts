import type { ThemeConfig, PresetThemeName } from '../types/chart/base';

/**
 * 预设主题配置
 * 基于信息图示例图片提取的配色方案
 */
export const presetThemes: Record<PresetThemeName, ThemeConfig> = {
  /**
   * 浅色主题 - 默认白底
   * VChart 内置 light 主题
   */
  light: {
    type: 'light',
    colors: [
      '#5B8FF9',
      '#5AD8A6',
      '#5D7092',
      '#F6BD16',
      '#E86452',
      '#6DC8EC',
      '#945FB9',
      '#FF9D4D',
      '#6C8AB7',
      '#FF99C3',
    ],
    backgroundColor: '#FFFFFF',
    textColor: '#333333',
    secondaryTextColor: '#666666',
  },

  /**
   * 深色主题 - 默认黑底
   * VChart 内置 dark 主题
   */
  dark: {
    type: 'dark',
    colors: [
      '#5B8FF9',
      '#5AD8A6',
      '#5D7092',
      '#F6BD16',
      '#E86452',
      '#6DC8EC',
      '#945FB9',
      '#FF9D4D',
      '#6C8AB7',
      '#FF99C3',
    ],
    backgroundColor: '#1F1F1F',
    textColor: '#FFFFFF',
    secondaryTextColor: '#AAAAAA',
  },

  /**
   * 清新现代 - 蓝绿色系
   * 适合：现代、简约、科技风格
   */
  fresh: {
    type: 'light',
    colors: ['#36C9C6', '#6DD8D2', '#9DEADC', '#B8F0ED', '#D8F7F5'],
    backgroundColor: '#FFFFFF',
    textColor: '#333333',
    secondaryTextColor: '#666666',
  },

  /**
   * 暖阳 - 日落橙黄色系
   * 适合：温暖、活力、促销类
   */
  sunset: {
    type: 'light',
    colors: ['#FF7A45', '#FFAB4C', '#FFD680', '#FFE4A0', '#FFF2CC'],
    backgroundColor: '#FFFEF9',
    textColor: '#333333',
    secondaryTextColor: '#666666',
  },

  /**
   * 浪漫粉 - 粉红珊瑚色系
   * 适合：女性、时尚、可爱类
   */
  romantic: {
    type: 'light',
    colors: ['#F5576C', '#F78CA0', '#F98B8B', '#FDA085', '#FECFE0'],
    backgroundColor: '#FFF9FA',
    textColor: '#333333',
    secondaryTextColor: '#666666',
  },

  /**
   * 梦幻紫 - 紫蓝渐变色系
   * 适合：梦幻、神秘、高端类
   */
  dream: {
    type: 'light',
    colors: ['#667EEA', '#764BA2', '#9B72E8', '#B794F6', '#D6BCFA'],
    backgroundColor: '#FAF8FF',
    textColor: '#333333',
    secondaryTextColor: '#666666',
  },

  /**
   * 海洋蓝 - 蓝绿渐变色系
   * 适合：清新、自然、商务类
   */
  ocean: {
    type: 'light',
    colors: ['#2193B0', '#6DD5ED', '#4FACFE', '#00F2FE', '#A7ECEE'],
    backgroundColor: '#F0FCFF',
    textColor: '#333333',
    secondaryTextColor: '#666666',
  },

  /**
   * 森林绿 - 绿色系
   * 适合：自然、环保、健康类
   */
  forest: {
    type: 'light',
    colors: ['#11998E', '#38EF7D', '#56AB2F', '#A8E063', '#C6F58C'],
    backgroundColor: '#F5FFF5',
    textColor: '#333333',
    secondaryTextColor: '#666666',
  },

  /**
   * 霓虹 - 高饱和度色系
   * 适合：潮流、炫酷、年轻类
   */
  neon: {
    type: 'light',
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
    backgroundColor: '#FFFFFF',
    textColor: '#222222',
    secondaryTextColor: '#555555',
  },

  /**
   * 粉彩 - 柔和粉嫩色系
   * 适合：柔和、温馨、儿童类
   */
  pastel: {
    type: 'light',
    colors: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'],
    backgroundColor: '#FFFFFF',
    textColor: '#444444',
    secondaryTextColor: '#777777',
  },

  /**
   * 渐变 - 多色渐变色系
   * 适合：多彩、活泼、创意类
   */
  gradient: {
    type: 'light',
    colors: ['#667EEA', '#764BA2', '#F5576C', '#F6D365', '#4FACFE'],
    backgroundColor: '#FFFFFF',
    textColor: '#333333',
    secondaryTextColor: '#666666',
  },

  /**
   * 人口信息图 - 高对比分类色（提取自示例信息图）
   * 适合：多类别条形图、排行榜、国家/城市对比
   */
  population: {
    type: 'light',
    colors: [
      '#E23A4B',
      '#18B66A',
      '#2E67D6',
      '#1097A6',
      '#F2BE18',
      '#E93F86',
      '#F56D12',
      '#8F5BC6',
      '#C0198E',
      '#0E5CAD',
      '#59B55C',
      '#1D9DF0',
    ],
    backgroundColor: '#F3EEE3',
    textColor: '#111111',
    secondaryTextColor: '#5E5A52',
  },

  /**
   * 信息图分类色 - 通用非相近色
   * 适合：需要强区分度的多系列场景
   */
  categorical: {
    type: 'light',
    colors: [
      '#D62839',
      '#1B9E77',
      '#2F6BD9',
      '#0EA5B7',
      '#F4B400',
      '#8E44AD',
      '#F26B1D',
      '#E83E8C',
      '#43A047',
      '#3949AB',
      '#00796B',
      '#6D4C41',
    ],
    backgroundColor: '#FAF7F0',
    textColor: '#1A1A1A',
    secondaryTextColor: '#666666',
  },

  /**
   * 欧洲充电成本信息图 - 深色高对比分区色
   * 适合：分区条形图、排行榜、信息图风格图表
   */
  'euro-charge': {
    type: 'dark',
    name: 'euro-charge',
    colors: [
      '#F0B7C8',
      '#EEE8CF',
      '#16E18D',
      '#EDE86A',
      '#F09FB7',
      '#D8F2E5',
      '#B2F7CF',
      '#F5ED9B',
    ],
    backgroundColor: '#3C4CB2',
    textColor: '#EAF0FF',
    secondaryTextColor: '#AFC1F2',
  },

  /**
   * 能源消费信息图 - 冷色高对比分类
   * 适合：排行榜、区域分类条形图、信息图风格展示
   */
  energy: {
    type: 'light',
    name: 'energy',
    colors: [
      '#1D97F2',
      '#17B8B8',
      '#0ECF2F',
      '#F24B5A',
      '#E7BD00',
      '#FF8A00',
      '#8A8A8A',
      '#13A8E8',
      '#25C85A',
      '#E95C70',
      '#DDB100',
      '#777777',
    ],
    backgroundColor: '#F3F5F7',
    textColor: '#111111',
    secondaryTextColor: '#566173',
  },

  /**
   * 航空市场信息图 - 环图高对比配色
   * 适合：饼图、环图、份额对比图
   */
  airline: {
    type: 'light',
    name: 'airline',
    colors: ['#0D23A8', '#D80038', '#F39A17', '#6A1FD1', '#23415F', '#A9B7C7'],
    backgroundColor: '#E9EDF2',
    textColor: '#203B5A',
    secondaryTextColor: '#61748A',
  },

  /**
   * 代际房产信息图 - 深色霓虹分层配色
   * 适合：分层对比、桑基图、堆叠图、深色信息图
   */
  ownership: {
    type: 'dark',
    name: 'ownership',
    colors: [
      '#8B4CC9',
      '#5866F2',
      '#1EC3E6',
      '#F1D216',
      '#6A3FA8',
      '#4A52B8',
      '#2AA6C1',
      '#A8952B',
    ],
    backgroundColor: '#25263D',
    textColor: '#F4F6FB',
    secondaryTextColor: '#A8B1CC',
  },

  /**
   * 加密货币信息图 - 矩形热力高对比配色
   * 适合：treemap、矩形分块、深色信息图
   */
  crypto: {
    type: 'dark',
    name: 'crypto',
    colors: [
      '#F79700',
      '#3F78D6',
      '#1C2D88',
      '#16C7C8',
      '#A88C2A',
      '#2DAF8F',
      '#6BA6F2',
      '#7A5AF8',
      '#1F9ED8',
      '#2DCCB7',
    ],
    backgroundColor: '#0500A7',
    textColor: '#F7FBFF',
    secondaryTextColor: '#70E7F0',
  },

  /**
   * 加密货币信息图 - 浅色矩形高对比配色
   * 适合：浅底 treemap、文档图表、报告场景
   */
  'crypto-light': {
    type: 'light',
    name: 'crypto-light',
    colors: [
      '#F59E0B',
      '#4D7CFE',
      '#243C9F',
      '#17BFC8',
      '#B08A1E',
      '#2AA889',
      '#7CAAF7',
      '#8B6AF8',
      '#2498CF',
      '#4CCCB8',
    ],
    backgroundColor: '#F6F8FF',
    textColor: '#172554',
    secondaryTextColor: '#2563EB',
  },

  /**
   * 原油出口信息图 - 深色矩形高冲突配色
   * 适合：treemap、占比矩形、深色信息图
   */
  oil: {
    type: 'dark',
    name: 'oil',
    colors: [
      '#F10A0A',
      '#1D33E6',
      '#11C84A',
      '#D6B21B',
      '#8B140B',
      '#0F8F36',
      '#5160F0',
      '#F5D55A',
    ],
    backgroundColor: '#180B02',
    textColor: '#FFF4E8',
    secondaryTextColor: '#FFC44A',
  },

  /**
   * 裁员信息图 - 浅底矩形高对比配色
   * 适合：treemap、占比矩形、信息图式分类对比
   */
  layoffs: {
    type: 'light',
    name: 'layoffs',
    colors: [
      '#0407B8',
      '#84D8F8',
      '#39A877',
      '#D7E3FF',
      '#FF6900',
      '#E4BE53',
      '#F3B5D7',
      '#0E5AA8',
      '#D23145',
      '#6B28B9',
      '#9D8520',
      '#7D60C7',
      '#2DA9B2',
      '#4B9B46',
    ],
    backgroundColor: '#EAE4CF',
    textColor: '#141414',
    secondaryTextColor: '#5F5645',
  },

  /**
   * 铀供应信息图 - 深色矩形荧光配色
   * 适合：treemap、来源占比矩形、深色信息图
   */
  uranium: {
    type: 'dark',
    name: 'uranium',
    colors: [
      '#EE120D',
      '#F3B7D6',
      '#95E5F7',
      '#D9EA7A',
      '#C7B1F9',
      '#F1EA67',
      '#B6FF18',
      '#F2D8C3',
    ],
    backgroundColor: '#090909',
    textColor: '#F7F2E8',
    secondaryTextColor: '#BFFF2A',
  },

  /**
   * 服装制造信息图 - 深色成本柱形配色
   * 适合：柱状图、堆叠柱图、制造成本类信息图
   */
  apparel: {
    type: 'dark',
    name: 'apparel',
    colors: [
      '#5A45FF',
      '#CF280F',
      '#D46C95',
      '#E39419',
      '#46B93C',
      '#8A7BFF',
      '#F0613B',
      '#E5A1BD',
      '#F0B24A',
      '#76D45D',
    ],
    backgroundColor: '#0F0F10',
    textColor: '#F6F1E8',
    secondaryTextColor: '#BFB7AA',
  },

  /**
   * 投资组合信息图 - 饼图暖金配色
   * 适合：饼图、环图、资产配置类图表
   */
  portfolio: {
    type: 'light',
    name: 'portfolio',
    colors: [
      '#E9BC51',
      '#C79F3F',
      '#F0AA5B',
      '#D6944D',
      '#F56D22',
      '#D45E10',
      '#D13C57',
      '#B81F63',
      '#8D0C4C',
      '#5A0A2B',
    ],
    backgroundColor: '#E5D4AA',
    textColor: '#1F1B1A',
    secondaryTextColor: '#6E5640',
  },

  /**
   * 新能源信息图 - 深色高对比配色
   * 适合：环图、柱图、深色信息图和能源主题图表
   */
  renewables: {
    type: 'dark',
    name: 'renewables',
    colors: [
      '#FF5143',
      '#F2D548',
      '#7379CF',
      '#18AFC0',
      '#E8E8E8',
      '#A6A6A6',
      '#1B1B1B',
      '#A56EEA',
      '#FF6B5E',
      '#5A66C9',
    ],
    backgroundColor: '#121315',
    textColor: '#F5F5F5',
    secondaryTextColor: '#B9BCC3',
  },

  /**
   * 社媒用户信息图 - 深色环图高对比配色
   * 适合：环图、饼图、用户分布与平台主题图表
   */
  tiktok: {
    type: 'dark',
    name: 'tiktok',
    colors: [
      '#990028',
      '#B21E56',
      '#E54584',
      '#EC73AF',
      '#F1B9D8',
      '#15A4BF',
      '#B7892E',
      '#7470CB',
      '#18A86C',
      '#D15B6E',
      '#1E9EE5',
      '#8A9E25',
      '#B96ED4',
      '#19B6B2',
      '#B56C35',
      '#6A8FDE',
      '#A3A3A3',
      '#F7924A',
    ],
    backgroundColor: '#232323',
    textColor: '#F4F4F4',
    secondaryTextColor: '#F7924A',
  },

  /**
   * 招聘系统信息图 - 科技蓝环图配色
   * 适合：环图、科技主题饼图、市场份额图
   */
  ats: {
    type: 'dark',
    name: 'ats',
    colors: [
      '#69D6FF',
      '#5CCEFF',
      '#55C8FF',
      '#4FC3FF',
      '#49BCFF',
      '#43B4FF',
      '#3CACFF',
      '#7AE3FF',
      '#58B9FF',
      '#8BE9FF',
    ],
    backgroundColor: '#042E63',
    textColor: '#EAF9FF',
    secondaryTextColor: '#7ADFFF',
  },
};

/**
 * VChart 内置主题映射
 */
export const vchartThemeMap: Record<Exclude<ThemeConfig['type'], undefined>, string> = {
  light: 'light',
  dark: 'dark',
};

/**
 * 获取解析后的主题配置
 */
export function resolveTheme(
  theme: ThemeConfig | PresetThemeName | undefined
): ThemeConfig | undefined {
  if (!theme) return undefined;

  // 如果是预设主题名称，直接返回预设
  if (typeof theme === 'string') {
    return presetThemes[theme];
  }

  return theme;
}

/**
 * 检查主题是否为暗色主题
 */
export function isDarkTheme(theme: ThemeConfig | undefined): boolean {
  return theme?.type === 'dark';
}
