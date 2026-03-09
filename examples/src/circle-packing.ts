import type { CirclePackingChartSchema } from '../../src/types/circle-packing';

export const circlePackingExamples: { name: string; schema: CirclePackingChartSchema }[] = [
  {
    name: '基础圆形闭包图',
    schema: {
      chartType: 'circlePacking',
      title: '产品销售分布',
      data: [
        { product: '手机', sales: 1200 },
        { product: '电脑', sales: 800 },
        { product: '平板', sales: 600 },
        { product: '手表', sales: 400 },
        { product: '耳机', sales: 300 }
      ],
      categoryField: 'product',
      valueField: 'sales'
    }
  },
  {
    name: '带间距',
    schema: {
      chartType: 'circlePacking',
      title: '产品销售分布（带间距）',
      data: [
        { product: '手机', sales: 1200 },
        { product: '电脑', sales: 800 },
        { product: '平板', sales: 600 },
        { product: '手表', sales: 400 },
        { product: '耳机', sales: 300 }
      ],
      categoryField: 'product',
      valueField: 'sales',
      circle: {
        padding: 10,
        strokeWidth: 2,
        strokeColor: '#fff'
      }
    }
  },
  {
    name: '自定义颜色',
    schema: {
      chartType: 'circlePacking',
      title: '产品销售分布（自定义颜色）',
      data: [
        { product: '手机', sales: 1200 },
        { product: '电脑', sales: 800 },
        { product: '平板', sales: 600 },
        { product: '手表', sales: 400 },
        { product: '耳机', sales: 300 }
      ],
      categoryField: 'product',
      valueField: 'sales',
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
    }
  }
];
