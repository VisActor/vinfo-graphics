import { describe, it, expect } from 'vitest';
import { toVChartSpec, validate, getDefaults } from '../src/index';
import type { ColumnChartSchema } from '../src/types/column';

describe('ColumnChart Schema', () => {
  describe('toVChartSpec', () => {
    it('should convert basic column chart', () => {
      const schema: ColumnChartSchema = {
        chartType: 'column',
        title: '月度销售额',
        data: [
          { month: '1月', sales: 120 },
          { month: '2月', sales: 150 },
          { month: '3月', sales: 180 }
        ],
        categoryField: 'month',
        valueField: 'sales'
      };

      const spec = toVChartSpec(schema);

      expect(spec.type).toBe('bar');
      expect(spec.direction).toBe('vertical');
      expect(spec.xField).toBe('month');
      expect(spec.yField).toBe('sales');
      expect(spec.data).toBeDefined();
    });

    it('should sort data in descending order', () => {
      const schema: ColumnChartSchema = {
        chartType: 'column',
        title: '月度销售额',
        data: [
          { month: '1月', sales: 100 },
          { month: '2月', sales: 300 },
          { month: '3月', sales: 200 }
        ],
        categoryField: 'month',
        valueField: 'sales',
        sort: 'desc'
      };

      const spec = toVChartSpec(schema);

      const values = (spec.data as any).values;
      expect(values[0].sales).toBe(300);
      expect(values[1].sales).toBe(200);
      expect(values[2].sales).toBe(100);
    });

    it('should handle column styling', () => {
      const schema: ColumnChartSchema = {
        chartType: 'column',
        title: '月度销售额',
        data: [{ month: '1月', sales: 100 }],
        categoryField: 'month',
        valueField: 'sales',
        column: {
          cornerRadius: 4,
          width: 30,
          gap: 2
        }
      };

      const spec = toVChartSpec(schema);

      expect(spec.bar).toBeDefined();
      expect((spec.bar as any).style.cornerRadius).toBe(4);
      expect(spec.barWidth).toBe(30);
    });

    it('should handle label configuration', () => {
      const schema: ColumnChartSchema = {
        chartType: 'column',
        title: '月度销售额',
        data: [{ month: '1月', sales: 100 }],
        categoryField: 'month',
        valueField: 'sales',
        label: {
          visible: true,
          position: 'top',
          format: '{value}万'
        }
      };

      const spec = toVChartSpec(schema);

      expect(spec.label).toBeDefined();
      expect((spec.label as any).visible).toBe(true);
      expect((spec.label as any).position).toBe('top');
    });

    it('should handle custom colors', () => {
      const schema: ColumnChartSchema = {
        chartType: 'column',
        title: '月度销售额',
        data: [
          { month: '1月', sales: 100 },
          { month: '2月', sales: 200 }
        ],
        categoryField: 'month',
        valueField: 'sales',
        colors: ['#FF6B6B', '#4ECDC4']
      };

      const spec = toVChartSpec(schema);

      expect(spec.color).toBeDefined();
      expect((spec.color as any).range).toEqual(['#FF6B6B', '#4ECDC4']);
    });
  });

  describe('validate', () => {
    it('should validate valid column chart', () => {
      const schema: ColumnChartSchema = {
        chartType: 'column',
        data: [{ month: '1月', sales: 100 }],
        categoryField: 'month',
        valueField: 'sales'
      };

      const result = validate(schema);

      expect(result.valid).toBe(true);
    });

    it('should fail validation without categoryField', () => {
      const schema: ColumnChartSchema = {
        chartType: 'column',
        data: [{ month: '1月', sales: 100 }],
        valueField: 'sales'
      } as any;

      const result = validate(schema);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('categoryField is required');
    });
  });

  describe('getDefaults', () => {
    it('should return defaults for column chart', () => {
      const defaults = getDefaults('column');

      expect(defaults.column).toBeDefined();
      expect(defaults.column?.cornerRadius).toBe(0);
      expect(defaults.sort).toBe('none');
    });
  });
});
