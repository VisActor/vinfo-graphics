import { describe, it, expect } from 'vitest';
import { toVChartSpec, validate, getDefaults } from '../src/index';
import type { TreemapChartSchema } from '../src/types/treemap';

describe('TreemapChart Schema', () => {
  describe('toVChartSpec', () => {
    it('should convert basic treemap chart', () => {
      const schema: TreemapChartSchema = {
        chartType: 'treemap',
        title: '部门预算分布',
        data: [
          { dept: '技术部', budget: 250 },
          { dept: '市场部', budget: 180 },
          { dept: '运营部', budget: 150 }
        ],
        categoryField: 'dept',
        valueField: 'budget'
      };

      const spec = toVChartSpec(schema);

      expect(spec.type).toBe('treemap');
      expect(spec.data).toBeDefined();
    });

    it('should handle node configuration', () => {
      const schema: TreemapChartSchema = {
        chartType: 'treemap',
        title: '部门预算分布',
        data: [{ dept: '技术部', budget: 250 }],
        categoryField: 'dept',
        valueField: 'budget',
        node: {
          gap: 4,
          padding: 8,
          cornerRadius: 4
        }
      };

      const spec = toVChartSpec(schema);

      expect(spec.gapWidth).toBe(4);
      expect(spec.nodePadding).toBe(8);
      expect((spec.leaf as any)?.style?.cornerRadius).toBe(4);
    });

    it('should handle label configuration', () => {
      const schema: TreemapChartSchema = {
        chartType: 'treemap',
        title: '部门预算分布',
        data: [{ dept: '技术部', budget: 250 }],
        categoryField: 'dept',
        valueField: 'budget',
        label: {
          visible: true,
          format: '{name}\n{value}'
        }
      };

      const spec = toVChartSpec(schema);

      expect(spec.label).toBeDefined();
      expect((spec.label as any).visible).toBe(true);
    });

    it('should handle custom colors', () => {
      const schema: TreemapChartSchema = {
        chartType: 'treemap',
        title: '部门预算分布',
        data: [
          { dept: '技术部', budget: 250 },
          { dept: '市场部', budget: 180 }
        ],
        categoryField: 'dept',
        valueField: 'budget',
        colors: ['#5B8FF9', '#5AD8A6', '#F6BD16']
      };

      const spec = toVChartSpec(schema);

      expect(spec.color).toBeDefined();
    });
  });

  describe('validate', () => {
    it('should validate valid treemap chart', () => {
      const schema: TreemapChartSchema = {
        chartType: 'treemap',
        data: [{ dept: '技术部', budget: 250 }],
        categoryField: 'dept',
        valueField: 'budget'
      };

      const result = validate(schema);

      expect(result.valid).toBe(true);
    });

    it('should fail validation without categoryField', () => {
      const schema: TreemapChartSchema = {
        chartType: 'treemap',
        data: [{ dept: '技术部', budget: 250 }],
        valueField: 'budget'
      } as any;

      const result = validate(schema);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('categoryField is required');
    });
  });

  describe('getDefaults', () => {
    it('should return defaults for treemap chart', () => {
      const defaults = getDefaults('treemap');

      expect(defaults.node).toBeDefined();
      expect(defaults.node?.gap).toBe(2);
      expect(defaults.node?.padding).toBe(4);
    });
  });
});
