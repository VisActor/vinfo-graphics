import { describe, it, expect } from 'vitest';
import { toVChartSpec, validate, getDefaults } from '../src/index';
import type { BarChartSchema } from '../src/types/bar';

describe('BarChart Schema', () => {
  describe('toVChartSpec', () => {
    it('should convert basic bar chart', () => {
      const schema: BarChartSchema = {
        chartType: 'bar',
        title: '用户分布',
        data: [
          { platform: '微信', users: 1200 },
          { platform: '抖音', users: 980 },
          { platform: '微博', users: 650 },
        ],
        categoryField: 'platform',
        valueField: 'users',
      };

      const spec = toVChartSpec(schema);

      expect(spec.type).toBe('bar');
      expect(spec.direction).toBe('horizontal');
      expect(spec.xField).toBe('users');
      expect(spec.yField).toBe('platform');
      expect(spec.data).toBeDefined();
    });

    it('should sort data in descending order', () => {
      const schema: BarChartSchema = {
        chartType: 'bar',
        title: '用户分布',
        data: [
          { platform: 'A', users: 100 },
          { platform: 'B', users: 300 },
          { platform: 'C', users: 200 },
        ],
        categoryField: 'platform',
        valueField: 'users',
        sort: 'desc',
      };

      const spec = toVChartSpec(schema);

      expect(spec.data).toBeDefined();
      const values = (spec.data as any).values;
      expect(values[0].users).toBe(300);
      expect(values[1].users).toBe(200);
      expect(values[2].users).toBe(100);
    });

    it('should sort data in ascending order', () => {
      const schema: BarChartSchema = {
        chartType: 'bar',
        title: '用户分布',
        data: [
          { platform: 'A', users: 100 },
          { platform: 'B', users: 300 },
          { platform: 'C', users: 200 },
        ],
        categoryField: 'platform',
        valueField: 'users',
        sort: 'asc',
      };

      const spec = toVChartSpec(schema);

      const values = (spec.data as any).values;
      expect(values[0].users).toBe(100);
      expect(values[1].users).toBe(200);
      expect(values[2].users).toBe(300);
    });

    it('should handle bar styling', () => {
      const schema: BarChartSchema = {
        chartType: 'bar',
        title: '用户分布',
        data: [{ platform: 'A', users: 100 }],
        categoryField: 'platform',
        valueField: 'users',
        bar: {
          cornerRadius: 8,
          width: 20,
          gap: 4,
        },
      };

      const spec = toVChartSpec(schema);

      expect(spec.bar).toBeDefined();
      expect((spec.bar as any).style.cornerRadius).toBe(8);
      expect(spec.barWidth).toBe(20);
      expect(spec.barGap).toBe(4);
    });

    it('should handle label configuration', () => {
      const schema: BarChartSchema = {
        chartType: 'bar',
        title: '用户分布',
        data: [{ platform: 'A', users: 100 }],
        categoryField: 'platform',
        valueField: 'users',
        label: {
          visible: true,
          position: 'outside',
          format: '{value}万',
        },
      };

      const spec = toVChartSpec(schema);

      expect(spec.label).toBeDefined();
      expect((spec.label as any).visible).toBe(true);
      expect((spec.label as any).position).toBe('outside');
    });

    it('should handle icon configuration', () => {
      const schema: BarChartSchema = {
        chartType: 'bar',
        title: '用户分布',
        data: [
          { platform: '微信', users: 1200, icon: 'wechat' },
          { platform: '抖音', users: 980, icon: 'douyin' },
        ],
        categoryField: 'platform',
        valueField: 'users',
        icon: {
          field: 'icon',
          map: {
            wechat: '/icons/wechat.png',
            douyin: '/icons/douyin.png',
          },
          size: 24,
          position: 'start',
        },
      };

      const spec = toVChartSpec(schema);

      expect(spec.extensionMark).toBeDefined();
      expect(Array.isArray(spec.extensionMark)).toBe(true);
    });

    it('should handle axis configuration', () => {
      const schema: BarChartSchema = {
        chartType: 'bar',
        title: '用户分布',
        data: [{ platform: 'A', users: 100 }],
        categoryField: 'platform',
        valueField: 'users',
        xAxis: {
          visible: true,
          format: '{value}万',
        },
      };

      const spec = toVChartSpec(schema);

      expect(spec.axes).toBeDefined();
      expect(Array.isArray(spec.axes)).toBe(true);
    });

    it('should handle title with position', () => {
      const schema: BarChartSchema = {
        chartType: 'bar',
        title: {
          text: '用户分布',
          position: 'right',
        },
        data: [{ platform: 'A', users: 100 }],
        categoryField: 'platform',
        valueField: 'users',
      };

      const spec = toVChartSpec(schema);

      expect(spec.title).toBeDefined();
      expect((spec.title as any).text).toBe('用户分布');
      expect((spec.title as any).align).toBe('right');
    });

    it('should handle background configuration', () => {
      const schema: BarChartSchema = {
        chartType: 'bar',
        title: '用户分布',
        data: [{ platform: 'A', users: 100 }],
        categoryField: 'platform',
        valueField: 'users',
        background: {
          image: '/bg.png',
          color: '#f0f5ff',
          opacity: 0.3,
        },
      };

      const spec = toVChartSpec(schema);

      expect(spec.background).toBeDefined();
    });

    it('should handle custom colors', () => {
      const schema: BarChartSchema = {
        chartType: 'bar',
        title: '用户分布',
        data: [{ platform: 'A', users: 100 }],
        categoryField: 'platform',
        valueField: 'users',
        colors: ['#FF0000', '#00FF00', '#0000FF'],
      };

      const spec = toVChartSpec(schema);

      expect(spec.color).toBeDefined();
      expect(spec.color).toEqual(['#FF0000', '#00FF00', '#0000FF']);
    });

    it('should handle linearGradient configuration', () => {
      const schema: BarChartSchema = {
        chartType: 'bar',
        title: '用户分布',
        data: [{ platform: 'A', users: 100 }],
        categoryField: 'platform',
        valueField: 'users',
        bar: {
          linearGradient: {
            direction: 'left-right',
            colors: ['#FF6B6B', '#4ECDC4'],
          },
        },
      };

      const spec = toVChartSpec(schema);

      expect(spec.bar).toBeDefined();
      expect((spec.bar as any).style).toBeDefined();
      expect((spec.bar as any).style.fill).toBeDefined();
    });

    it('should handle rank configuration', () => {
      const schema: BarChartSchema = {
        chartType: 'bar',
        title: '用户分布',
        data: [
          { platform: 'A', users: 100 },
          { platform: 'B', users: 200 },
        ],
        categoryField: 'platform',
        valueField: 'users',
        sort: 'desc',
        rank: {
          visible: true,
          position: 'start',
          style: {
            fontSize: 12,
            fill: '#fff',
            fontWeight: 'bold',
            backgroundColor: '#5B8FF9',
            cornerRadius: 4,
            padding: 4,
          },
        },
      };

      const spec = toVChartSpec(schema);

      // 排名通过 extensionMark 实现
      expect(spec.extensionMark).toBeDefined();
      expect(Array.isArray(spec.extensionMark)).toBe(true);
    });

    it('should handle backgroundImage configuration', () => {
      const schema: BarChartSchema = {
        chartType: 'bar',
        title: '用户分布',
        data: [
          { platform: 'A', users: 100, bgIcon: 'icon1' },
          { platform: 'B', users: 200, bgIcon: 'icon2' },
        ],
        categoryField: 'platform',
        valueField: 'users',
        icon: {
          field: 'bgIcon',
          map: {
            icon1: '/image1.png',
            icon2: '/image2.png',
          },
          size: 40,
        },
      };

      const spec = toVChartSpec(schema);

      expect(spec.extensionMark).toBeDefined();
      expect(Array.isArray(spec.extensionMark)).toBe(true);
    });
  });

  describe('validate', () => {
    it('should validate valid bar chart', () => {
      const schema: BarChartSchema = {
        chartType: 'bar',
        data: [{ platform: 'A', users: 100 }],
        categoryField: 'platform',
        valueField: 'users',
      };

      const result = validate(schema);

      expect(result.valid).toBe(true);
    });

    it('should fail validation without categoryField', () => {
      const schema: BarChartSchema = {
        chartType: 'bar',
        data: [{ platform: 'A', users: 100 }],
        valueField: 'users',
      } as any;

      const result = validate(schema);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('categoryField is required');
    });

    it('should fail validation without valueField', () => {
      const schema: BarChartSchema = {
        chartType: 'bar',
        data: [{ platform: 'A', users: 100 }],
        categoryField: 'platform',
      } as any;

      const result = validate(schema);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('valueField is required');
    });

    it('should fail validation with empty data', () => {
      const schema: BarChartSchema = {
        chartType: 'bar',
        data: [],
        categoryField: 'platform',
        valueField: 'users',
      };

      const result = validate(schema);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('data must be a non-empty array');
    });

    it('should fail validation with invalid sort value', () => {
      const schema: BarChartSchema = {
        chartType: 'bar',
        data: [{ platform: 'A', users: 100 }],
        categoryField: 'platform',
        valueField: 'users',
        sort: 'invalid' as any,
      };

      const result = validate(schema);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('sort'))).toBe(true);
    });
  });

  describe('getDefaults', () => {
    it('should return defaults for bar chart', () => {
      const defaults = getDefaults('bar');

      expect(defaults.bar).toBeDefined();
      expect(defaults.bar?.cornerRadius).toBe(0);
      expect(defaults.bar?.gap).toBe(8);
      expect(defaults.label).toBeDefined();
      expect(defaults.sort).toBe('none');
    });
  });
});
