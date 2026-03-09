import { describe, it, expect } from 'vitest';
import { toVChartSpec, validate, getDefaults } from '../src/index';
import type { CirclePackingChartSchema } from '../src/types/circle-packing';

describe('CirclePackingChart Schema', () => {
  describe('toVChartSpec', () => {
    it('should convert basic circle packing chart', () => {
      const schema: CirclePackingChartSchema = {
        chartType: 'circlePacking',
        title: '产品销售分布',
        data: [
          { product: '手机', sales: 1200 },
          { product: '电脑', sales: 800 },
          { product: '平板', sales: 600 }
        ],
        categoryField: 'product',
        valueField: 'sales'
      };

      const spec = toVChartSpec(schema);

      expect(spec.type).toBe('circlePacking');
      expect(spec.data).toBeDefined();
    });

    it('should handle circle configuration', () => {
      const schema: CirclePackingChartSchema = {
        chartType: 'circlePacking',
        title: '产品销售分布',
        data: [{ product: '手机', sales: 1200 }],
        categoryField: 'product',
        valueField: 'sales',
        circle: {
          padding: 10,
          strokeWidth: 2,
          strokeColor: '#fff'
        }
      };

      const spec = toVChartSpec(schema);

      expect(spec.layoutPadding).toBe(10);
      expect(spec.circlePacking).toBeDefined();
    });

    it('should handle label configuration', () => {
      const schema: CirclePackingChartSchema = {
        chartType: 'circlePacking',
        title: '产品销售分布',
        data: [{ product: '手机', sales: 1200 }],
        categoryField: 'product',
        valueField: 'sales',
        label: {
          visible: true,
          position: 'center'
        }
      };

      const spec = toVChartSpec(schema);

      expect(spec.label).toBeDefined();
      expect((spec.label as any).visible).toBe(true);
    });

    it('should handle custom colors', () => {
      const schema: CirclePackingChartSchema = {
        chartType: 'circlePacking',
        title: '产品销售分布',
        data: [
          { product: '手机', sales: 1200 },
          { product: '电脑', sales: 800 }
        ],
        categoryField: 'product',
        valueField: 'sales',
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1']
      };

      const spec = toVChartSpec(schema);

      expect(spec.color).toBeDefined();
    });
  });

  describe('validate', () => {
    it('should validate valid circle packing chart', () => {
      const schema: CirclePackingChartSchema = {
        chartType: 'circlePacking',
        data: [{ product: '手机', sales: 1200 }],
        categoryField: 'product',
        valueField: 'sales'
      };

      const result = validate(schema);

      expect(result.valid).toBe(true);
    });

    it('should fail validation without categoryField', () => {
      const schema: CirclePackingChartSchema = {
        chartType: 'circlePacking',
        data: [{ product: '手机', sales: 1200 }],
        valueField: 'sales'
      } as any;

      const result = validate(schema);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('categoryField is required');
    });
  });

  describe('getDefaults', () => {
    it('should return defaults for circle packing chart', () => {
      const defaults = getDefaults('circlePacking');

      expect(defaults.circle).toBeDefined();
      expect(defaults.circle?.padding).toBe(5);
    });
  });
});
