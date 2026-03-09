import { describe, it, expect } from 'vitest';
import { toVChartSpec, validate, getDefaults } from '../src/index';
import type { PieChartSchema } from '../src/types/pie';

describe('PieChart Schema', () => {
  describe('toVChartSpec', () => {
    it('should convert basic pie chart', () => {
      const schema: PieChartSchema = {
        chartType: 'pie',
        title: '市场份额',
        data: [
          { name: '产品A', value: 30 },
          { name: '产品B', value: 25 },
          { name: '产品C', value: 20 }
        ],
        categoryField: 'name',
        valueField: 'value'
      };

      const spec = toVChartSpec(schema);

      expect(spec.type).toBe('pie');
      expect(spec.categoryField).toBe('name');
      expect(spec.valueField).toBe('value');
      expect(spec.data).toBeDefined();
      expect(spec.data.values).toHaveLength(3);
    });

    it('should convert donut chart with innerRadius', () => {
      const schema: PieChartSchema = {
        chartType: 'pie',
        title: '用户分布',
        data: [
          { name: '00后', value: 15 },
          { name: '90后', value: 35 }
        ],
        categoryField: 'name',
        valueField: 'value',
        innerRadius: 0.5
      };

      const spec = toVChartSpec(schema);

      expect(spec.innerRadius).toBe(0.5);
      expect(spec.outerRadius).toBe(0.8); // default
    });

    it('should handle title as object with position', () => {
      const schema: PieChartSchema = {
        chartType: 'pie',
        title: {
          text: '市场份额',
          position: 'right'
        },
        data: [{ name: 'A', value: 30 }],
        categoryField: 'name',
        valueField: 'value'
      };

      const spec = toVChartSpec(schema);

      expect(spec.title).toBeDefined();
      expect((spec.title as any).text).toBe('市场份额');
      expect((spec.title as any).align).toBe('right');
    });

    it('should apply custom colors', () => {
      const schema: PieChartSchema = {
        chartType: 'pie',
        title: 'Custom Colors',
        data: [
          { name: 'A', value: 30 },
          { name: 'B', value: 25 }
        ],
        categoryField: 'name',
        valueField: 'value',
        colors: ['#FF0000', '#00FF00', '#0000FF']
      };

      const spec = toVChartSpec(schema);

      expect(spec.color).toBeDefined();
      expect((spec.color as any).range).toEqual(['#FF0000', '#00FF00', '#0000FF']);
    });

    it('should handle label configuration', () => {
      const schema: PieChartSchema = {
        chartType: 'pie',
        title: 'With Labels',
        data: [{ name: 'A', value: 30 }],
        categoryField: 'name',
        valueField: 'value',
        label: {
          visible: true,
          position: 'inside'
        }
      };

      const spec = toVChartSpec(schema);

      expect(spec.label).toBeDefined();
      expect((spec.label as any).visible).toBe(true);
      expect((spec.label as any).position).toBe('inside');
    });
  });

  describe('validate', () => {
    it('should validate valid pie chart', () => {
      const schema: PieChartSchema = {
        chartType: 'pie',
        data: [{ name: 'A', value: 30 }],
        categoryField: 'name',
        valueField: 'value'
      };

      const result = validate(schema);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation without categoryField', () => {
      const schema: PieChartSchema = {
        chartType: 'pie',
        data: [{ name: 'A', value: 30 }],
        valueField: 'value'
      } as any;

      const result = validate(schema);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('categoryField is required');
    });

    it('should fail validation without valueField', () => {
      const schema: PieChartSchema = {
        chartType: 'pie',
        data: [{ name: 'A', value: 30 }],
        categoryField: 'name'
      } as any;

      const result = validate(schema);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('valueField is required');
    });

    it('should fail validation with empty data', () => {
      const schema: PieChartSchema = {
        chartType: 'pie',
        data: [],
        categoryField: 'name',
        valueField: 'value'
      };

      const result = validate(schema);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('data must be a non-empty array');
    });

    it('should fail validation with invalid innerRadius', () => {
      const schema: PieChartSchema = {
        chartType: 'pie',
        data: [{ name: 'A', value: 30 }],
        categoryField: 'name',
        valueField: 'value',
        innerRadius: 1.5
      };

      const result = validate(schema);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('innerRadius'))).toBe(true);
    });
  });

  describe('getDefaults', () => {
    it('should return defaults for pie chart', () => {
      const defaults = getDefaults('pie');

      expect(defaults.innerRadius).toBe(0);
      expect(defaults.outerRadius).toBe(0.8);
      expect(defaults.label).toBeDefined();
    });
  });
});
