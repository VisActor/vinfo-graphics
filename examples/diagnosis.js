// 诊断页面 - 测试条形图各种配置
// 问题：
// 1. 带内标签 - 标签没有正常显示
// 2. 自定义颜色 - 颜色应该是每个柱子不同颜色，但现在是colors[0]
// 3. 带背景 - 背景色没有生效
// 4. 渐变填充 - 柱子消息了
// 5. 排名标签 - 没有正确显示
// 6. 背景图表 - 没有正确显示

// 测试1: 内标签 - position: inside
const test1 = {
  type: 'bar',
  direction: 'horizontal',
  data: { values: [
    { platform: '微信', users: 1200 },
    { platform: '抖音', users: 980 }
  ]},
  xField: 'users',
  yField: 'platform',
  label: {
    visible: true,
    position: 'inside', // 或 'center'
    style: { fill: '#fff' }
  }
};

// 测试2: 自定义颜色 - 每个柱子不同颜色
const test2 = {
  type: 'bar',
  direction: 'horizontal',
  data: { values: [
    { platform: '微信', users: 1200 },
    { platform: '抖音', users: 980 }
  ]},
  xField: 'users',
  yField: 'platform',
  color: {
    palette: ['#FF6B6B', '#4ECDC4', '#45B7D1']
  }
};

// 测试3: 背景色
const test3 = {
  type: 'bar',
  direction: 'horizontal',
  data: { values: [
    { platform: '微信', users: 1200 },
    { platform: '抖音', users: 980 }
  ]},
  xField: 'users',
  yField: 'platform',
  background: '#f0f5ff'
};

// 测试4: 渐变填充
const test4 = {
  type: 'bar',
  direction: 'horizontal',
  data: { values: [
    { platform: '微信', users: 1200 },
    { platform: '抖音', users: 980 }
  ]},
  xField: 'users',
  yField: 'platform',
  bar: {
    style: {
      fill: {
        type: 'linear',
        x: 1,
        y: 0,
        stops: [
          { offset: 0, color: '#FF6B6B' },
          { offset: 1, color: '#4ECDC4' }
        ]
      }
    }
  }
};

// 测试5: 排名标签
const test5 = {
  type: 'bar',
  direction: 'horizontal',
  data: { values: [
    { platform: '微信', users: 1200 },
    { platform: '抖音', users: 980 }
  ]},
  xField: 'users',
  yField: 'platform',
  label: {
    visible: true,
    position: 'start',  // 左侧
    format: (datum, index) => String(index + 1),
    style: { fill: '#fff' }
  }
};

// 测试6: 背景图 - 使用 barBackground
const test6 = {
  type: 'bar',
  direction: 'horizontal',
  data: { values: [
    { platform: '微信', users: 1200 },
    { platform: '抖音', users: 980 }
  ]},
  xField: 'users',
  yField: 'platform',
  barBackground: {
    visible: true,
    field: 'platform',
    style: {
      fill: '#f0f0f0'
    }
  }
};

console.log('Test specs created');
