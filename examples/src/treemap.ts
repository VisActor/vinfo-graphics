import type { TreemapChartSchema } from '../../src/types/treemap';

export const treemapExamples: { name: string; schema: TreemapChartSchema }[] = [
  {
    name: '基础矩阵树图',
    schema: {
      chartType: 'treemap',
      title: '部门预算分布',
      data: [
        { dept: '技术部', budget: 250 },
        { dept: '市场部', budget: 180 },
        { dept: '运营部', budget: 150 },
        { dept: '人力部', budget: 80 },
        { dept: '财务部', budget: 60 }
      ],
      categoryField: 'dept',
      valueField: 'budget'
    }
  },
  {
    name: '带间距',
    schema: {
      chartType: 'treemap',
      title: '部门预算分布（带间距）',
      data: [
        { dept: '技术部', budget: 250 },
        { dept: '市场部', budget: 180 },
        { dept: '运营部', budget: 150 },
        { dept: '人力部', budget: 80 },
        { dept: '财务部', budget: 60 }
      ],
      categoryField: 'dept',
      valueField: 'budget',
      node: {
        gap: 4,
        padding: 8,
        cornerRadius: 4
      }
    }
  },
  {
    name: '自定义颜色',
    schema: {
      chartType: 'treemap',
      title: '部门预算分布（自定义颜色）',
      data: [
        { dept: '技术部', budget: 250 },
        { dept: '市场部', budget: 180 },
        { dept: '运营部', budget: 150 },
        { dept: '人力部', budget: 80 },
        { dept: '财务部', budget: 60 }
      ],
      categoryField: 'dept',
      valueField: 'budget',
      colors: ['#5B8FF9', '#5AD8A6', '#F6BD16', '#E86452', '#6DC8EC']
    }
  }
];
