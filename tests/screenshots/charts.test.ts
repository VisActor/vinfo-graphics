import { test, expect } from '@playwright/test';

const CHART_TYPES = [
  { type: 'pie', variant: 'basic', name: 'pie-basic' },
  { type: 'pie', variant: 'donut', name: 'pie-donut' },
  { type: 'bar', variant: 'basic', name: 'bar-basic' },
  { type: 'bar', variant: 'horizontal', name: 'bar-horizontal' },
  { type: 'column', variant: 'basic', name: 'column-basic' },
  { type: 'column', variant: 'withLabel', name: 'column-withLabel' },
  { type: 'area', variant: 'basic', name: 'area-basic' },
  { type: 'area', variant: 'smooth', name: 'area-smooth' },
  { type: 'treemap', variant: 'basic', name: 'treemap-basic' },
  { type: 'treemap', variant: 'withGap', name: 'treemap-withGap' },
  { type: 'circlePacking', variant: 'basic', name: 'circlePacking-basic' },
  { type: 'circlePacking', variant: 'withPadding', name: 'circlePacking-withPadding' },
];

for (const chart of CHART_TYPES) {
  test(`screenshot: ${chart.name}`, async ({ page }) => {
    await page.goto('/screenshot.html');

    // 等待页面加载
    await page.waitForLoadState('networkidle');

    // 等待 renderChart 函数可用
    await page.waitForFunction(() => typeof (window as any).renderChart === 'function', {
      timeout: 10000,
    });

    // 调用渲染 API
    const result = await page.evaluate(
      ({ type, variant }: { type: string; variant: string }) => {
        return (window as any).renderChart(type, variant);
      },
      { type: chart.type, variant: chart.variant }
    );

    // 验证渲染成功
    expect(result.success).toBe(true);

    // 等待图表渲染
    await page.waitForTimeout(1000);

    // 截图对比
    const chartElement = page.locator('#chart');
    await expect(chartElement).toHaveScreenshot(`${chart.name}.png`, {
      maxDiffPixelRatio: 0.1,
    });
  });
}
