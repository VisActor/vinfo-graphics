import type { AreaChartSchema } from '../../src/types/area';

export const areaExamples: { name: string; schema: AreaChartSchema }[] = [
  {
    name: '基础面积图',
    schema: {
      chartType: 'area',
      title: '用户增长趋势',
      data: [
        { month: '1月', users: 1000 },
        { month: '2月', users: 1200 },
        { month: '3月', users: 1500 },
        { month: '4月', users: 1800 },
        { month: '5月', users: 2200 },
        { month: '6月', users: 2600 }
      ],
      categoryField: 'month',
      valueField: 'users'
    }
  },
  {
    name: '平滑曲线',
    schema: {
      chartType: 'area',
      title: '用户增长趋势（平滑）',
      data: [
        { month: '1月', users: 1000 },
        { month: '2月', users: 1200 },
        { month: '3月', users: 1500 },
        { month: '4月', users: 1800 },
        { month: '5月', users: 2200 },
        { month: '6月', users: 2600 }
      ],
      categoryField: 'month',
      valueField: 'users',
      area: {
        smooth: true,
        opacity: 0.6
      }
    }
  },
  {
    name: '带数据点',
    schema: {
      chartType: 'area',
      title: '用户增长趋势（带数据点）',
      data: [
        { month: '1月', users: 1000 },
        { month: '2月', users: 1200 },
        { month: '3月', users: 1500 },
        { month: '4月', users: 1800 },
        { month: '5月', users: 2200 },
        { month: '6月', users: 2600 }
      ],
      categoryField: 'month',
      valueField: 'users',
      point: {
        visible: true,
        size: 6
      }
    }
  },
  {
    name: '自定义透明度',
    schema: {
      chartType: 'area',
      title: '用户增长趋势（高透明度）',
      data: [
        { month: '1月', users: 1000 },
        { month: '2月', users: 1200 },
        { month: '3月', users: 1500 },
        { month: '4月', users: 1800 },
        { month: '5月', users: 2200 },
        { month: '6月', users: 2600 }
      ],
      categoryField: 'month',
      valueField: 'users',
      area: {
        opacity: 0.3
      }
    }
  }
];
