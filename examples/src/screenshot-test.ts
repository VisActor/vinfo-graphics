import VChart from '@visactor/vchart';
import { toVChartSpec } from 'vinfo-graphics';

// 所有示例数据
const examples = {
  // 饼图
  pie: {
    basic: {
      chartType: 'pie',
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
    },
    donut: {
      chartType: 'pie',
      title: '产品销售分布（环形）',
      data: [
        { product: '手机', sales: 1200 },
        { product: '电脑', sales: 800 },
        { product: '平板', sales: 600 },
        { product: '手表', sales: 400 },
        { product: '耳机', sales: 300 }
      ],
      categoryField: 'product',
      valueField: 'sales',
      pie: {
        innerRadius: 0.5
      }
    }
  },

  // 条形图
  bar: {
    basic: {
      chartType: 'bar',
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
    },
    horizontal: {
      chartType: 'bar',
      title: '月度销售额（横向）',
      data: [
        { month: '1月', sales: 120 },
        { month: '2月', sales: 150 },
        { month: '3月', sales: 180 },
        { month: '4月', sales: 160 },
        { month: '5月', sales: 200 }
      ],
      categoryField: 'month',
      valueField: 'sales',
      bar: {
        orientation: 'horizontal'
      }
    }
  },

  // 柱图
  column: {
    basic: {
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
    },
    withLabel: {
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

  // 面积图
  area: {
    basic: {
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
    },
    smooth: {
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

  // 矩阵树图
  treemap: {
    basic: {
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
    },
    withGap: {
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

  // 圆形闭包图
  circlePacking: {
    basic: {
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
    },
    withPadding: {
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
  }
};

let currentChart: VChart | null = null;

// 全局 API，供 Playwright 调用
(window as any).renderChart = async function(type: string, variant: string) {
  const status = document.getElementById('status')!;
  const chartContainer = document.getElementById('chart')!;

  try {
    // 销毁旧图表
    if (currentChart) {
      currentChart.release();
      currentChart = null;
    }

    // 获取示例数据
    const schema = (examples as any)[type]?.[variant];
    if (!schema) {
      throw new Error(`Unknown type/variant: ${type}/${variant}`);
    }

    // 转换 schema 为 VChart spec
    const vchartSpec = toVChartSpec(schema);

    // 创建新图表
    currentChart = new VChart(vchartSpec, {
      dom: chartContainer
    });
    currentChart.renderSync();

    // 等待渲染完成
    await new Promise(resolve => setTimeout(resolve, 500));

    status.className = 'success';
    status.textContent = `Rendered: ${type}/${variant}`;

    return { success: true };
  } catch (error: any) {
    status.className = 'error';
    status.textContent = `Error: ${error.message}`;
    console.error(error);
    return { success: false, error: error.message };
  }
};

// 页面加载完成后自动渲染第一个示例
document.addEventListener('DOMContentLoaded', () => {
  (window as any).renderChart('pie', 'basic');
});
