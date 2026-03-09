import { describe, it, expect } from 'vitest';
import { toVChartSpec, validate, getDefaults } from '../src/index';
import type { AreaChartSchema } from '../src/types/area';

describe('AreaChart Schema', () => {
  describe('toVChartSpec', () => {
    it('should convert basic area chart', () => {
      const schema: AreaChartSchema = {
        chartType: 'area',
        title: '用户增长趋势',
        data: [
          { month: '1月', users: 1000 },
          { month: '2月', users: 1200 },
          { month: '3月', users: 1500 }
        ],
        categoryField: 'month',
        valueField: 'users'
      };

      const spec = toVChartSpec(schema);

      expect(spec.type).toBe('area');
      expect(spec.xField).toBe('month');
      expect(spec.yField).toBe('users');
      expect(spec.data).toBeDefined();
    });

    it('should handle smooth area', () => {
      const schema: AreaChartSchema = {
        chartType: 'area',
        title: '用户增长趋势',
        data: [{ month: '1月', users: 1000 }],
        categoryField: 'month',
        valueField: 'users',
        area: {
          smooth: true,
          opacity: 0.6
        }
      };

      const spec = toVChartSpec(schema);

      expect(spec.smooth).toBe(true);
      expect(spec.area).toBeDefined();
      expect((spec.area as any).style.fillOpacity).toBe(0.6);
    });

    it('should handle point configuration', () => {
      const schema: AreaChartSchema = {
        chartType: 'area',
        title: '用户增长趋势',
        data: [{ month: '1月', users: 1000 }],
        categoryField: 'month',
        valueField: 'users',
        point: {
          visible: true,
          size: 6,
          style: {
            fill: '#FF0000'
          }
        }
      };

      const spec = toVChartSpec(schema);

      expect(spec.point).toBeDefined();
      expect((spec.point as any).visible).toBe(true);
      expect((spec.point as any).style).toBeDefined();
    });

    it('should handle line configuration', () => {
      const schema: AreaChartSchema = {
        chartType: 'area',
        title: '用户增长趋势',
        data: [{ month: '1月', users: 1000 }],
        categoryField: 'month',
        valueField: 'users',
        line: {
          visible: true,
          size: 2,
          style: {
            stroke: '#5B8FF9'
          }
        }
      };

      const spec = toVChartSpec(schema);

      expect(spec.line).toBeDefined();
      expect((spec.line as any).visible).toBe(true);
    });

    it('should handle custom colors', () => {
      const schema: AreaChartSchema = {
        chartType: 'area',
        title: '用户增长趋势',
        data: [{ month: '1月', users: 1000 }],
        categoryField: 'month',
        valueField: 'users',
        colors: ['#FF6B6B', '#4ECDC4']
      };

      const spec = toVChartSpec(schema);

      expect(spec.color).toBeDefined();
    });
  });

  describe('validate', () => {
    it('should validate valid area chart', () => {
      const schema: AreaChartSchema = {
        chartType: 'area',
        data: [{ month: '1月', users: 1000 }],
        categoryField: 'month',
        valueField: 'users'
      };

      const result = validate(schema);

      expect(result.valid).toBe(true);
    });

    it('should fail validation without categoryField', () => {
      const schema: AreaChartSchema = {
        chartType: 'area',
        data: [{ month: '1月', users: 1000 }],
        valueField: 'users'
      } as any;

      const result = validate(schema);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('categoryField is required');
    });
  });

  describe('getDefaults', () => {
    it('should return defaults for area chart', () => {
      const defaults = getDefaults('area');

      expect(defaults.area).toBeDefined();
      expect(defaults.area?.smooth).toBe(false);
      expect(defaults.area?.opacity).toBe(0.6);
    });
  });
});
