import type { PieChartSchema } from '../../src/types/pie';

export const pieExamples: { name: string; schema: PieChartSchema }[] = [
  {
    name: '基础饼图',
    schema: {
      chartType: 'pie',
      title: '市场份额',
      data: [
        { name: '产品A', value: 30 },
        { name: '产品B', value: 25 },
        { name: '产品C', value: 20 },
        { name: '产品D', value: 15 },
        { name: '其他', value: 10 }
      ],
      categoryField: 'name',
      valueField: 'value'
    }
  },
  {
    name: '环形图',
    schema: {
      chartType: 'pie',
      title: '用户分布',
      data: [
        { name: '00后', value: 15 },
        { name: '90后', value: 35 },
        { name: '80后', value: 30 },
        { name: '70后', value: 15 },
        { name: '其他', value: 5 }
      ],
      categoryField: 'name',
      valueField: 'value',
      innerRadius: 0.5,
      outerRadius: 0.8
    }
  },
  {
    name: '带外标签',
    schema: {
      chartType: 'pie',
      title: '市场份额（带标签）',
      data: [
        { name: '产品A', value: 30 },
        { name: '产品B', value: 25 },
        { name: '产品C', value: 20 },
        { name: '产品D', value: 15 },
        { name: '其他', value: 10 }
      ],
      categoryField: 'name',
      valueField: 'value',
      label: {
        visible: true,
        position: 'outside'
      }
    }
  },
  {
    name: '带内标签',
    schema: {
      chartType: 'pie',
      title: '市场份额（内标签）',
      data: [
        { name: '产品A', value: 30 },
        { name: '产品B', value: 25 },
        { name: '产品C', value: 20 },
        { name: '产品D', value: 15 },
        { name: '其他', value: 10 }
      ],
      categoryField: 'name',
      valueField: 'value',
      innerRadius: 0.4,
      label: {
        visible: true,
        position: 'inside'
      }
    }
  },
  {
    name: '自定义颜色',
    schema: {
      chartType: 'pie',
      title: '自定义颜色',
      data: [
        { name: '产品A', value: 30 },
        { name: '产品B', value: 25 },
        { name: '产品C', value: 20 },
        { name: '产品D', value: 15 },
        { name: '其他', value: 10 }
      ],
      categoryField: 'name',
      valueField: 'value',
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
    }
  },
  {
    name: '标题在右侧',
    schema: {
      chartType: 'pie',
      title: {
        text: '市场份额',
        position: 'right'
      },
      data: [
        { name: '产品A', value: 30 },
        { name: '产品B', value: 25 },
        { name: '产品C', value: 20 },
        { name: '产品D', value: 15 },
        { name: '其他', value: 10 }
      ],
      categoryField: 'name',
      valueField: 'value'
    }
  }
];
