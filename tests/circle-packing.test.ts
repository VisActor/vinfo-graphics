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
          { product: '平板', sales: 600 },
        ],
        categoryField: 'product',
        valueField: 'sales',
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
          strokeColor: '#fff',
        },
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
          position: 'center',
        },
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
          { product: '电脑', sales: 800 },
        ],
        categoryField: 'product',
        valueField: 'sales',
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
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
        valueField: 'sales',
      };

      const result = validate(schema);

      expect(result.valid).toBe(true);
    });

    it('should fail validation without categoryField', () => {
      const schema: CirclePackingChartSchema = {
        chartType: 'circlePacking',
        data: [{ product: '手机', sales: 1200 }],
        valueField: 'sales',
      } as any;

      const result = validate(schema);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('categoryField is required');
    });
  });

  describe('scenario: global commodity flows circle packing', () => {
    it('should produce spec with icon, nodeBackground, and label for commodity data', () => {
      const schema: CirclePackingChartSchema = {
        chartType: 'circlePacking',
        title: 'Share of Global Commodity Flows',
        data: [
          { Trade: 'Crude oil', value: 38, icon: 'oil', bg: 'oil' },
          { Trade: 'Liquefied petroleum gas', value: 29, icon: 'gas', bg: 'gas' },
          { Trade: 'Liquefied natural gas', value: 19, icon: 'lng', bg: 'lng' },
          { Trade: 'Refined oil products', value: 19, icon: 'refined', bg: 'refined' },
          {
            Trade: 'Chemicals, including fertilizers',
            value: 13,
            icon: 'chemical',
            bg: 'chemical',
          },
          { Trade: 'Container', value: 2.8, icon: 'container', bg: 'container' },
          { Trade: 'Dry bulk, including grains', value: 2.4, icon: 'grain', bg: 'grain' },
        ],
        categoryField: 'Trade',
        valueField: 'value',
        icon: {
          field: 'icon',
          map: {
            oil: 'https://example.com/icons/oil.png',
            gas: 'https://example.com/icons/gas.png',
            lng: 'https://example.com/icons/lng.png',
            refined: 'https://example.com/icons/refined.png',
            chemical: 'https://example.com/icons/chemical.png',
            container: 'https://example.com/icons/container.png',
            grain: 'https://example.com/icons/grain.png',
          },
          size: 32,
          visible: true,
          position: 'top-left',
        },
        circleBackground: {
          field: 'bg',
          map: {
            oil: 'https://example.com/bg/oil.jpg',
            gas: 'https://example.com/bg/gas.jpg',
            lng: 'https://example.com/bg/lng.jpg',
            refined: 'https://example.com/bg/refined.jpg',
            chemical: 'https://example.com/bg/chemical.jpg',
            container: 'https://example.com/bg/container.jpg',
            grain: 'https://example.com/bg/grain.jpg',
          },
          opacity: 0.3,
          visible: true,
        },
        label: {
          visible: true,
          showPercent: true,
        },
      };

      const spec = toVChartSpec(schema);

      // 1. Chart type should be circlePacking
      expect(spec.type).toBe('circlePacking');

      // 2. Label should be present and visible
      expect(spec.label).toBeDefined();
      expect((spec.label as any).visible).toBe(true);

      // 3. extensionMark should exist for icon and nodeBackground
      expect(spec.extensionMark).toBeDefined();
      expect(Array.isArray(spec.extensionMark)).toBe(true);

      const marks = spec.extensionMark as Record<string, unknown>[];
      // At least 2 extensionMarks: background (symbol) + icon (symbol) + rank marks
      expect(marks.length).toBeGreaterThanOrEqual(2);

      // nodeBackground mark (first, unshifted) should be a symbol with background style
      const bgMark = marks[0];
      expect(bgMark.type).toBe('symbol');
      expect((bgMark.style as any).background).toBeDefined();
      expect((bgMark.style as any).opacity).toBe(0.3);

      // icon mark should be a symbol with symbolType
      const iconMark = marks.find(
        (m) => m.type === 'symbol' && m !== bgMark && (m.style as any).symbolType === 'circle'
      );
      expect(iconMark).toBeDefined();

      // 4. Data should contain all 7 commodity items
      expect((spec.data as any).values).toHaveLength(7);
    });
  });

  describe('prominent-value layout', () => {
    it('should use extensionMark for prominent-value label layout', () => {
      const schema: CirclePackingChartSchema = {
        chartType: 'circlePacking',
        data: [
          { trade: 'Crude oil', share: 38 },
          { trade: 'LPG', share: 29 },
        ],
        categoryField: 'trade',
        valueField: 'share',
        label: {
          visible: true,
          layout: 'prominent-value',
          showPercent: true,
          valueStyle: { fill: '#ffffff', fontWeight: 'bold' },
          nameStyle: { fill: 'rgba(255,255,255,0.9)' },
        },
      };

      const spec = toVChartSpec(schema);

      // Default label should be hidden
      expect((spec.label as any).visible).toBe(false);

      // Should have extensionMark with at least 2 text marks (value + name) + rank marks
      expect(spec.extensionMark).toBeDefined();
      const marks = spec.extensionMark as Record<string, unknown>[];
      const textMarks = marks.filter((m) => m.type === 'text');
      // 2 prominent-value text marks + rank text mark = at least 2
      expect(textMarks.length).toBeGreaterThanOrEqual(2);
    });

    it('should apply fillOpacity to circle style', () => {
      const schema: CirclePackingChartSchema = {
        chartType: 'circlePacking',
        data: [{ trade: 'Crude oil', share: 38 }],
        categoryField: 'trade',
        valueField: 'share',
        circle: {
          padding: 5,
          strokeWidth: 2,
          strokeColor: 'rgba(255,255,255,0.3)',
          fillOpacity: 0.8,
        },
      };

      const spec = toVChartSpec(schema);

      expect(spec.circlePacking).toBeDefined();
      expect((spec.circlePacking as any).style.fillOpacity).toBe(0.8);
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
