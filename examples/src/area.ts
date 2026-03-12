import type { AreaChartSchema } from '@visactor/vinfo-graphics';

export const areaExamples: { name: string; schema: AreaChartSchema }[] = [
  {
    name: 'test',
    schema: {
      chartType: 'area',
      title: {
        text: '中国制造业PMI指数趋势',
        position: 'center',
        subtext: '2025年2月 - 2026年2月（经季节调整，单位：%）',
      },
      data: [
        {
          月份: '2025年2月',
          指数: 50.2,
          iconKey: '制造业',
        },
        {
          月份: '2025年3月',
          指数: 50.5,
          iconKey: '制造业',
        },
        {
          月份: '2025年4月',
          指数: 49,
          iconKey: '制造业',
        },
        {
          月份: '2025年5月',
          指数: 49.5,
          iconKey: '制造业',
        },
        {
          月份: '2025年6月',
          指数: 49.7,
          iconKey: '制造业',
        },
        {
          月份: '2025年7月',
          指数: 49.3,
          iconKey: '制造业',
        },
        {
          月份: '2025年8月',
          指数: 49.4,
          iconKey: '制造业',
        },
        {
          月份: '2025年9月',
          指数: 49.8,
          iconKey: '制造业',
        },
        {
          月份: '2025年10月',
          指数: 49,
          iconKey: '制造业',
        },
        {
          月份: '2025年11月',
          指数: 49.2,
          iconKey: '制造业',
        },
        {
          月份: '2025年12月',
          指数: 50.1,
          iconKey: '制造业',
        },
        {
          月份: '2026年1月',
          指数: 49.3,
          iconKey: '制造业',
        },
        {
          月份: '2026年2月',
          指数: 49,
          iconKey: '制造业',
        },
      ],
      categoryField: '月份',
      valueField: '指数',
      icon: {
        field: 'iconKey',
        map: {
          制造业: 'https://api.iconify.design/mdi/factory.svg',
        },
        visible: true,
        position: 'top',
        size: 20,
      },
      area: {
        smooth: true,
        opacity: 0.5,
        linearGradient: {
          direction: 'top-bottom',
          colors: ['#3370eb', 'rgba(51,112,235,0.12)'],
        },
      },
      line: {
        visible: true,
        width: 2,
      },
      point: {
        visible: true,
        size: 5,
      },
      annotationHorizontalLine: [
        {
          yValue: 50,
          text: '荣枯线 50',
          lineStyle: 'dashed',
          lineColor: '#f97316',
        },
      ],
      background: {
        image:
          'https://images.unsplash.com/photo-1611915075827-0d27e2668fb79140?w=1920&h=1080&fit=crop',
      },
      theme: 'dark',
      footnote: {
        text: '数据来源：图片所示来源（如 国家统计局 / 中国物流与采购联合会）',
        layout: 'left',
      },
    },
  },
  {
    name: '基础面积图',
    schema: {
      chartType: 'area',
      title: { text: '用户增长趋势' },
      data: [
        { month: '1月', users: 1000 },
        { month: '2月', users: 1200 },
        { month: '3月', users: 1500 },
        { month: '4月', users: 1800 },
        { month: '5月', users: 2200 },
        { month: '6月', users: 2600 },
      ],
      categoryField: 'month',
      valueField: 'users',
      theme: 'apparel',
    },
  },
  {
    name: '平滑曲线',
    schema: {
      chartType: 'area',
      title: { text: '用户增长趋势（平滑）' },
      data: [
        { month: '1月', users: 1000 },
        { month: '2月', users: 1200 },
        { month: '3月', users: 1500 },
        { month: '4月', users: 1800 },
        { month: '5月', users: 2200 },
        { month: '6月', users: 2600 },
      ],
      categoryField: 'month',
      valueField: 'users',
      area: {
        smooth: true,
        opacity: 0.6,
      },
    },
  },
  {
    name: '带数据点',
    schema: {
      chartType: 'area',
      title: { text: '用户增长趋势（带数据点）' },
      data: [
        { month: '1月', users: 1000 },
        { month: '2月', users: 1200 },
        { month: '3月', users: 1500 },
        { month: '4月', users: 1800 },
        { month: '5月', users: 2200 },
        { month: '6月', users: 2600 },
      ],
      categoryField: 'month',
      valueField: 'users',
      point: {
        visible: true,
        size: 6,
      },
    },
  },
  {
    name: '自定义透明度',
    schema: {
      chartType: 'area',
      title: { text: '用户增长趋势（高透明度）' },
      data: [
        { month: '1月', users: 1000 },
        { month: '2月', users: 1200 },
        { month: '3月', users: 1500 },
        { month: '4月', users: 1800 },
        { month: '5月', users: 2200 },
        { month: '6月', users: 2600 },
      ],
      categoryField: 'month',
      valueField: 'users',
      area: {
        opacity: 0.3,
      },
    },
  },
  {
    name: '渐变填充',
    schema: {
      chartType: 'area',
      title: { text: '用户增长趋势（渐变）' },
      data: [
        { month: '1月', users: 1000 },
        { month: '2月', users: 1200 },
        { month: '3月', users: 1500 },
        { month: '4月', users: 1800 },
        { month: '5月', users: 2200 },
        { month: '6月', users: 2600 },
      ],
      categoryField: 'month',
      valueField: 'users',
      area: {
        smooth: true,
        linearGradient: {
          direction: 'bottom-top',
          colors: ['#667eea', '#764ba2'],
        },
      },
    },
  },
  {
    name: '带图标',
    schema: {
      chartType: 'area',
      title: { text: 'APP下载量趋势' },
      data: [
        { month: '1月', downloads: 1000, icon: 'android' },
        { month: '2月', downloads: 1200, icon: 'android' },
        { month: '3月', downloads: 1500, icon: 'ios' },
        { month: '4月', downloads: 1800, icon: 'ios' },
        { month: '5月', downloads: 2200, icon: 'android' },
        { month: '6月', downloads: 2600, icon: 'ios' },
      ],
      categoryField: 'month',
      valueField: 'downloads',
      point: {
        visible: true,
        size: 6,
      },
      icon: {
        visible: true,
        field: 'icon',
        position: 'top',
        size: 20,
        map: {
          android: 'https://api.iconify.design/simple-icons/android.svg?color=%233DDC84',
          ios: 'https://api.iconify.design/simple-icons/apple.svg?color=%23000000',
        },
      },
    },
  },
  {
    name: '带装饰图片',
    schema: {
      chartType: 'area',
      title: { text: '季度销售趋势' },
      data: [
        { quarter: 'Q1', sales: 450 },
        { quarter: 'Q2', sales: 520 },
        { quarter: 'Q3', sales: 480 },
        { quarter: 'Q4', sales: 600 },
      ],
      categoryField: 'quarter',
      valueField: 'sales',
      area: {
        smooth: true,
        linearGradient: {
          direction: 'bottom-top',
          colors: ['#11998e', '#38ef7d'],
        },
      },
      point: {
        visible: true,
        size: 8,
      },
      brandImage: {
        visible: true,
        url: 'https://api.iconify.design/material-symbols/monitoring-rounded.svg?color=%234facfe',
        width: 60,
        height: 60,
        align: 'right',
        verticalAlign: 'top',
      },
    },
  },
  {
    name: '带标注点',
    schema: {
      chartType: 'area',
      title: { text: '月度销售额' },
      data: [
        { month: '1月', sales: 120 },
        { month: '2月', sales: 150 },
        { month: '3月', sales: 180 },
        { month: '4月', sales: 160 },
        { month: '5月', sales: 200 },
        { month: '6月', sales: 240 },
      ],
      categoryField: 'month',
      valueField: 'sales',
      area: {
        smooth: true,
        linearGradient: {
          direction: 'bottom-top',
          colors: ['#f093fb', '#f5576c'],
        },
      },
      point: {
        visible: true,
        size: 6,
      },
      annotationPoint: [
        {
          value: '3月',
          text: '180万',
          textColor: '#fff',
          textFontSize: 12,
          textBackgroundVisible: true,
          textBackgroundColor: '#f5576c',
          offsetY: -15,
        },
      ],
    },
  },
  {
    name: '带水平标注线',
    schema: {
      chartType: 'area',
      title: { text: '月度销售额（带均值线）' },
      data: [
        { month: '1月', sales: 120 },
        { month: '2月', sales: 150 },
        { month: '3月', sales: 180 },
        { month: '4月', sales: 160 },
        { month: '5月', sales: 200 },
        { month: '6月', sales: 240 },
      ],
      categoryField: 'month',
      valueField: 'sales',
      area: {
        smooth: true,
        linearGradient: {
          direction: 'bottom-top',
          colors: ['#4facfe', '#00f2fe'],
        },
      },
      point: {
        visible: true,
        size: 6,
      },
      annotationHorizontalLine: [
        {
          yValue: 175,
          text: '平均值',
          textColor: '#333',
          textFontSize: 11,
          textBackgroundVisible: true,
          textBackgroundColor: 'rgba(255,255,255,0.9)',
          lineColor: '#666',
          lineWidth: 1,
          lineStyle: 'dashed',
        },
      ],
    },
  },
  {
    name: '带标注区域',
    schema: {
      chartType: 'area',
      title: { text: '月度销售额（带高亮区域）' },
      data: [
        { month: '1月', sales: 120 },
        { month: '2月', sales: 150 },
        { month: '3月', sales: 180 },
        { month: '4月', sales: 160 },
        { month: '5月', sales: 200 },
        { month: '6月', sales: 240 },
      ],
      categoryField: 'month',
      valueField: 'sales',
      area: {
        smooth: true,
        linearGradient: {
          direction: 'bottom-top',
          colors: ['#a8edea', '#fed6e3'],
        },
      },
      point: {
        visible: true,
        size: 6,
      },
      annotationArea: [
        {
          startValue: '2月',
          endValue: '4月',
          text: '增长期',
          textColor: '#333',
          textFontSize: 12,
          areaColor: '#4facfe',
          areaColorOpacity: 0.2,
        },
      ],
    },
  },
  {
    name: '综合示例',
    schema: {
      chartType: 'area',
      title: { text: '网站流量趋势' },
      data: [
        { day: '周一', pv: 5000 },
        { day: '周二', pv: 6200 },
        { day: '周三', pv: 5800 },
        { day: '周四', pv: 7000 },
        { day: '周五', pv: 8500 },
        { day: '周六', pv: 9200 },
        { day: '周日', pv: 7800 },
      ],
      categoryField: 'day',
      valueField: 'pv',
      area: {
        smooth: true,
        linearGradient: {
          direction: 'bottom-top',
          colors: ['#4facfe', '#00f2fe'],
        },
      },
      point: {
        visible: true,
        size: 6,
      },
      colors: ['#4facfe'],
      legend: { visible: true },
      annotationPoint: [
        {
          value: '周六',
          text: '峰值!',
          textColor: '#fff',
          textFontSize: 11,
          textBackgroundVisible: true,
          textBackgroundColor: '#00f2fe',
          offsetY: -15,
        },
      ],
      annotationHorizontalLine: [
        {
          yValue: 6900,
          text: '平均',
          textColor: '#666',
          textFontSize: 10,
          textBackgroundVisible: true,
          textBackgroundColor: 'rgba(255,255,255,0.8)',
          lineColor: '#999',
          lineWidth: 1,
          lineStyle: 'dashed',
        },
      ],
    },
  },
  {
    name: '清新主题 (fresh)',
    schema: {
      chartType: 'area',
      title: { text: '用户增长趋势（清新主题）' },
      data: [
        { month: '1月', users: 1000 },
        { month: '2月', users: 1200 },
        { month: '3月', users: 1500 },
        { month: '4月', users: 1800 },
        { month: '5月', users: 2200 },
        { month: '6月', users: 2600 },
      ],
      categoryField: 'month',
      valueField: 'users',
      area: {
        smooth: true,
        linearGradient: {
          direction: 'bottom-top',
          colors: ['#36C9C6', '#6DD8D2'],
        },
      },
      point: {
        visible: true,
        size: 6,
      },
      theme: 'fresh',
    },
  },
  {
    name: '海洋主题 (ocean)',
    schema: {
      chartType: 'area',
      title: { text: '网站流量趋势（海洋主题）' },
      data: [
        { day: '周一', pv: 5000 },
        { day: '周二', pv: 6200 },
        { day: '周三', pv: 5800 },
        { day: '周四', pv: 7000 },
        { day: '周五', pv: 8500 },
        { day: '周六', pv: 9200 },
        { day: '周日', pv: 7800 },
      ],
      categoryField: 'day',
      valueField: 'pv',
      area: {
        smooth: true,
        linearGradient: {
          direction: 'bottom-top',
          colors: ['#2193B0', '#6DD5ED'],
        },
      },
      point: {
        visible: true,
        size: 6,
      },
      theme: 'ocean',
    },
  },
];
