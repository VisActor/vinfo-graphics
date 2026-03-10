import type { ColumnChartSchema } from '../../src/types/column';

export const columnExamples: { name: string; schema: ColumnChartSchema }[] = [
  {
    name: '基础柱图',
    schema: {
      chartType: 'column',
      title: '月度销售额',
      data: [
        { month: '1月', sales: 120 },
        { month: '2月', sales: 150 },
        { month: '3月', sales: 180 },
        { month: '4月', sales: 160 },
        { month: '5月', sales: 200 },
      ],
      categoryField: 'month',
      valueField: 'sales',
    },
  },
  {
    name: '降序排列',
    schema: {
      chartType: 'column',
      title: '月度销售额（降序）',
      data: [
        { month: '1月', sales: 120 },
        { month: '2月', sales: 150 },
        { month: '3月', sales: 180 },
        { month: '4月', sales: 160 },
        { month: '5月', sales: 200 },
      ],
      categoryField: 'month',
      valueField: 'sales',
      sort: 'desc',
    },
  },
  {
    name: '带标签',
    schema: {
      chartType: 'column',
      title: '月度销售额（带标签）',
      data: [
        { month: '1月', sales: 120 },
        { month: '2月', sales: 150 },
        { month: '3月', sales: 180 },
        { month: '4月', sales: 160 },
        { month: '5月', sales: 200 },
      ],
      categoryField: 'month',
      valueField: 'sales',
      label: {
        visible: true,
        position: 'top',
        format: '{value}万',
      },
    },
  },
  {
    name: '圆角柱子',
    schema: {
      chartType: 'column',
      title: '月度销售额（圆角）',
      data: [
        { month: '1月', sales: 120 },
        { month: '2月', sales: 150 },
        { month: '3月', sales: 180 },
        { month: '4月', sales: 160 },
        { month: '5月', sales: 200 },
      ],
      categoryField: 'month',
      valueField: 'sales',
      column: {
        cornerRadius: 4,
      },
    },
  },
  {
    name: '自定义颜色',
    schema: {
      chartType: 'column',
      title: '月度销售额（自定义颜色）',
      data: [
        { month: '1月', sales: 120 },
        { month: '2月', sales: 150 },
        { month: '3月', sales: 180 },
        { month: '4月', sales: 160 },
        { month: '5月', sales: 200 },
      ],
      categoryField: 'month',
      valueField: 'sales',
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
    },
  },
  {
    name: '渐变填充',
    schema: {
      chartType: 'column',
      title: '月度销售额（渐变）',
      data: [
        { month: '1月', sales: 120 },
        { month: '2月', sales: 150 },
        { month: '3月', sales: 180 },
        { month: '4月', sales: 160 },
        { month: '5月', sales: 200 },
      ],
      categoryField: 'month',
      valueField: 'sales',
      column: {
        cornerRadius: 4,
        linearGradient: {
          direction: 'bottom-top',
          colors: ['#667eea', '#764ba2'],
        },
      },
    },
  },
  {
    name: '带图标（底部）',
    schema: {
      chartType: 'column',
      title: '社交媒体用户数',
      data: [
        { platform: '微信', users: 1200, icon: 'wechat' },
        { platform: '抖音', users: 800, icon: 'douyin' },
        { platform: '微博', users: 600, icon: 'weibo' },
        { platform: '小红书', users: 400, icon: 'xiaohongshu' },
      ],
      categoryField: 'platform',
      valueField: 'users',
      icon: {
        visible: true,
        field: 'icon',
        position: 'bottom',
        size: 24,
        map: {
          wechat: 'https://img.icons8.com/color/96/weixin.png',
          douyin: 'https://img.icons8.com/color/96/tiktok.png',
          weibo: 'https://img.icons8.com/color/96/weibo.png',
          xiaohongshu: 'https://img.icons8.com/color/96/video.png',
        },
      },
      sort: 'desc',
    },
  },
  {
    name: '带图标（顶部）',
    schema: {
      chartType: 'column',
      title: '游戏下载量',
      data: [
        { game: '王者荣耀', downloads: 150, icon: 'game1' },
        { game: '原神', downloads: 120, icon: 'game2' },
        { game: '和平精英', downloads: 100, icon: 'game3' },
      ],
      categoryField: 'game',
      valueField: 'downloads',
      icon: {
        visible: true,
        field: 'icon',
        position: 'top',
        size: 24,
        map: {
          game1: 'https://img.icons8.com/color/96/controller.png',
          game2: 'https://img.icons8.com/color/96/controller.png',
          game3: 'https://img.icons8.com/color/96/controller.png',
        },
      },
      sort: 'desc',
    },
  },
  {
    name: '带装饰图片',
    schema: {
      chartType: 'column',
      title: '季度销售报告',
      data: [
        { quarter: 'Q1', value: 450 },
        { quarter: 'Q2', value: 520 },
        { quarter: 'Q3', value: 480 },
        { quarter: 'Q4', value: 600 },
      ],
      categoryField: 'quarter',
      valueField: 'value',
      column: {
        cornerRadius: 4,
        linearGradient: {
          direction: 'bottom-top',
          colors: ['#11998e', '#38ef7d'],
        },
      },
      brandImage: {
        visible: true,
        url: 'https://img.icons8.com/clouds/100/statistics.png',
        width: 60,
        height: 60,
        align: 'center',
        verticalAlign: 'top',
      },
    },
  },
  {
    name: '带脚注',
    schema: {
      chartType: 'column',
      title: '市场份额分析',
      data: [
        { product: '产品A', share: 35 },
        { product: '产品B', share: 28 },
        { product: '产品C', share: 22 },
        { product: '其他', share: 15 },
      ],
      categoryField: 'product',
      valueField: 'share',
      colors: ['#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
      footnote: {
        text: '数据来源：2024年市场调研报告',
        image: 'https://img.icons8.com/ios-filled/50/info.png',
        layout: 'image-left-text-right',
        fontSize: 11,
        fill: '#666',
      },
    },
  },
];
