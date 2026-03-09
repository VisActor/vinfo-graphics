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
        { month: '5月', sales: 200 }
      ],
      categoryField: 'month',
      valueField: 'sales'
    }
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
        { month: '5月', sales: 200 }
      ],
      categoryField: 'month',
      valueField: 'sales',
      sort: 'desc'
    }
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
        { month: '5月', sales: 200 }
      ],
      categoryField: 'month',
      valueField: 'sales',
      label: {
        visible: true,
        position: 'top',
        format: '{value}万'
      }
    }
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
        { month: '5月', sales: 200 }
      ],
      categoryField: 'month',
      valueField: 'sales',
      column: {
        cornerRadius: 4
      }
    }
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
        { month: '5月', sales: 200 }
      ],
      categoryField: 'month',
      valueField: 'sales',
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
    }
  }
];
