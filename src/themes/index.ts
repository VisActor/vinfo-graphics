import type { ThemeConfig, PresetThemeName } from '../types/base';

/**
 * 预设主题配置
 * 基于信息图示例图片提取的配色方案
 */
export const presetThemes: Record<PresetThemeName, ThemeConfig> = {
  /**
   * 清新现代 - 蓝绿色系
   * 适合：现代、简约、科技风格
   */
  fresh: {
    type: 'light',
    name: 'fresh',
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
    name: 'sunset',
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
    name: 'romantic',
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
    name: 'dream',
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
    name: 'ocean',
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
    name: 'forest',
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
    name: 'neon',
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
    name: 'pastel',
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
    name: 'gradient',
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
    name: 'population',
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
    name: 'categorical',
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
    colors: [
      '#0D23A8',
      '#D80038',
      '#F39A17',
      '#6A1FD1',
      '#23415F',
      '#A9B7C7',
    ],
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
export function resolveTheme(theme: ThemeConfig | PresetThemeName | undefined): ThemeConfig | undefined {
  if (!theme) return undefined;

  // 如果是预设主题名称，直接返回预设
  if (typeof theme === 'string') {
    return presetThemes[theme];
  }

  // 如果是 ThemeConfig，合并预设（如果有 name）
  if (theme.name && presetThemes[theme.name]) {
    const preset = presetThemes[theme.name];
    return {
      ...preset,
      ...theme,
      // 保留预设的 colors，除非用户明确指定了自定义 colors
      colors: theme.colors ?? preset.colors,
    };
  }

  return theme;
}

/**
 * 检查主题是否为暗色主题
 */
export function isDarkTheme(theme: ThemeConfig | undefined): boolean {
  return theme?.type === 'dark';
}
