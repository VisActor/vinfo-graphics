import VChart from '@visactor/vchart';
import { toVChartSpec } from '@visactor/vinfo-graphics';
import { pieExamples } from './pie';
import { barExamples } from './bar';
import { columnExamples } from './column';
import { areaExamples } from './area';
import { treemapExamples } from './treemap';
import { circlePackingExamples } from './circle-packing';

interface Example {
  id: string;
  name: string;
  category: string;
  schema: any;
}

// 所有示例，按分类组织
const exampleGroups = [
  { category: '饼图', items: pieExamples },
  { category: '条形图', items: barExamples },
  { category: '柱图', items: columnExamples },
  { category: '面积图', items: areaExamples },
  { category: '矩阵树图', items: treemapExamples },
  { category: '圆形闭包图', items: circlePackingExamples },
];

// 扁平化所有示例
const allExamples: Example[] = exampleGroups.flatMap((group) =>
  group.items.map((item, index) => ({
    ...item,
    id: `${group.category}-${index}`,
    category: group.category,
  }))
);

let currentChart: VChart | null = null;
const LAST_VISITED_EXAMPLE_ID_KEY = 'vinfo-graphics:lastVisitedExampleId';

function setLastVisitedExampleId(exampleId: string) {
  try {
    localStorage.setItem(LAST_VISITED_EXAMPLE_ID_KEY, exampleId);
  } catch {
    // 忽略 localStorage 不可用场景
  }
}

function getLastVisitedExampleId(): string | null {
  try {
    return localStorage.getItem(LAST_VISITED_EXAMPLE_ID_KEY);
  } catch {
    return null;
  }
}

// 渲染导航
function renderNav() {
  const nav = document.getElementById('nav')!;
  nav.innerHTML = '';

  exampleGroups.forEach((group) => {
    // 分类标题
    const categoryTitle = document.createElement('div');
    categoryTitle.className = 'nav-category-title';
    categoryTitle.textContent = group.category;
    nav.appendChild(categoryTitle);

    // 分类按钮组
    const groupDiv = document.createElement('div');
    groupDiv.className = 'nav-group';

    group.items.forEach((item, index) => {
      const example: Example = {
        ...item,
        id: `${group.category}-${index}`,
        category: group.category,
      };

      const btn = document.createElement('button');
      btn.className = 'nav-btn';
      btn.textContent = example.name;
      btn.dataset.exampleId = example.id;
      btn.onclick = () => {
        setLastVisitedExampleId(example.id);
        renderChart(example);
      };
      groupDiv.appendChild(btn);
    });

    nav.appendChild(groupDiv);
  });
}

// 渲染图表
function renderChart(example: Example) {
  // 更新按钮状态
  const buttons = document.querySelectorAll('.nav-btn');
  buttons.forEach((btn) => {
    if ((btn as HTMLButtonElement).dataset.exampleId === example.id) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // 更新分类标题状态
  const categoryTitles = document.querySelectorAll('.nav-category-title');
  categoryTitles.forEach((title) => {
    if (title.textContent === example.category) {
      title.classList.add('active');
    } else {
      title.classList.remove('active');
    }
  });

  // 转换 schema
  const vchartSpec = toVChartSpec(example.schema);
  console.log(`[${example.category} - ${example.name}] VChart Spec:`, vchartSpec);

  // 显示 schema
  const output = document.getElementById('schema-output')!;
  output.textContent = JSON.stringify(example.schema, null, 2);

  // 显示当前示例信息
  const info = document.getElementById('chart-info')!;
  info.textContent = `${example.category} / ${example.name}`;

  // 销毁旧图表
  if (currentChart) {
    currentChart.release();
    currentChart = null;
  }

  // 创建新图表
  currentChart = new VChart(vchartSpec as any, {
    dom: document.getElementById('chart')!,
  });
  currentChart.renderSync();

  (window as any).vchart = currentChart; // 暴露到全局，方便调试
}

// 初始化
function init() {
  renderNav();

  if (allExamples.length === 0) {
    return;
  }

  const fallbackExample = allExamples[0];
  const lastVisitedExampleId = getLastVisitedExampleId();
  const restoredExample = lastVisitedExampleId
    ? allExamples.find((example) => example.id === lastVisitedExampleId)
    : undefined;

  renderChart(restoredExample ?? fallbackExample);
}

init();
