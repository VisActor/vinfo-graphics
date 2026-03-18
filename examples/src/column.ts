import type { ColumnChartSchema } from '@visactor/vinfo-graphics';

export const columnExamples: { name: string; schema: ColumnChartSchema }[] = [
  {
    name: '基础柱图',
    schema: {
      chartType: 'column',
      title: { text: '月度销售额' },
      data: [
        { month: '1月', sales: 120 },
        { month: '2月', sales: 150 },
        { month: '3月', sales: 180 },
        { month: '4月', sales: 160 },
        { month: '5月', sales: 200 },
      ],
      categoryField: 'month',
      valueField: 'sales',
      theme: 'ats',
    },
  },
  {
    name: '降序排列',
    schema: {
      chartType: 'column',
      title: { text: '月度销售额（降序）' },
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
      title: { text: '月度销售额（带标签）' },
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
      title: { text: '月度销售额（圆角）' },
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
      title: { text: '月度销售额（自定义颜色）' },
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
      title: { text: '月度销售额（渐变）' },
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
      title: { text: '社交媒体用户数' },
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
      title: { text: '游戏下载量' },
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
      title: { text: '季度销售报告' },
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
      title: { text: '市场份额分析' },
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
  {
    name: 'test',
    schema: {
      chartType: 'column',
      title: {
        text: 'The State of Depression in Latin America',
        position: 'center',
      },
      data: [
        {
          country: 'Chile',
          rate: 5.4613,
        },
        {
          country: 'Argentina',
          rate: 4.6962,
        },
        {
          country: 'Dominican Republic',
          rate: 4.5757,
        },
        {
          country: 'Haiti',
          rate: 4.4947,
        },
        {
          country: 'Cuba',
          rate: 4.4922,
        },
        {
          country: 'Brazil',
          rate: 4.4136,
        },
        {
          country: 'Venezuela',
          rate: 4.2027,
        },
        {
          country: 'Uruguay',
          rate: 4.1463,
        },
        {
          country: 'Guatemala',
          rate: 4.101,
        },
        {
          country: 'Costa Rica',
          rate: 3.9136,
        },
        {
          country: 'Ecuador',
          rate: 3.8073,
        },
        {
          country: 'Peru',
          rate: 3.7131,
        },
        {
          country: 'Paraguay',
          rate: 3.5947,
        },
        {
          country: 'Mexico',
          rate: 3.5799,
        },
        {
          country: 'El Salvador',
          rate: 3.4169,
        },
        {
          country: 'Honduras',
          rate: 3.3896,
        },
        {
          country: 'Panama',
          rate: 3.3188,
        },
        {
          country: 'Nicaragua',
          rate: 3.2687,
        },
        {
          country: 'Bolivia',
          rate: 3.2373,
        },
        {
          country: 'Colombia',
          rate: 2.8023,
        },
      ],
      width: 840,
      height: 600,
      background: {
        color: '#F9FAFB',
      },
      theme: 'fresh',
      colors: ['#4F46E5'],
      legend: {
        visible: false,
      },
      categoryField: 'country',
      valueField: 'rate',
      sort: 'desc',
      column: {
        cornerRadius: [6, 6, 0, 0],
        gap: 6,
        linearGradient: {
          direction: 'bottom-top',
          colors: ['#4F46E5', '#818CF8'],
        },
      },
      label: {
        visible: true,
        position: 'middle',
        format: '{value}',
      },
      icon: {
        field: 'country',
        visible: true,
        position: 'bottom',
        size: 20,
        map: {
          Chile: 'https://api.iconify.design/twemoji/flag-chile.svg',
          Argentina: 'https://api.iconify.design/twemoji/flag-argentina.svg',
          'Dominican Republic': 'https://api.iconify.design/twemoji/flag-dominican-republic.svg',
          Haiti: 'https://api.iconify.design/twemoji/flag-haiti.svg',
          Cuba: 'https://api.iconify.design/twemoji/flag-cuba.svg',
          Brazil: 'https://api.iconify.design/twemoji/flag-brazil.svg',
          Venezuela: 'https://api.iconify.design/twemoji/flag-venezuela.svg',
          Uruguay: 'https://api.iconify.design/twemoji/flag-uruguay.svg',
          Guatemala: 'https://api.iconify.design/twemoji/flag-guatemala.svg',
          'Costa Rica': 'https://api.iconify.design/twemoji/flag-costa-rica.svg',
          Ecuador: 'https://api.iconify.design/twemoji/flag-ecuador.svg',
          Peru: 'https://api.iconify.design/twemoji/flag-peru.svg',
          Paraguay: 'https://api.iconify.design/twemoji/flag-paraguay.svg',
          Mexico: 'https://api.iconify.design/twemoji/flag-mexico.svg',
          'El Salvador': 'https://api.iconify.design/twemoji/flag-el-salvador.svg',
          Honduras: 'https://api.iconify.design/twemoji/flag-honduras.svg',
          Panama: 'https://api.iconify.design/twemoji/flag-panama.svg',
          Nicaragua: 'https://api.iconify.design/twemoji/flag-nicaragua.svg',
          Bolivia: 'https://api.iconify.design/twemoji/flag-bolivia.svg',
          Colombia: 'https://api.iconify.design/twemoji/flag-colombia.svg',
        },
      },
    },
  },
];
