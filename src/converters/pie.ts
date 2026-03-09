import type { PieChartSchema } from '../types/pie';
import type { ValidationResult } from './base';
import { BaseConverter } from './base';

/**
 * 饼图转换器
 *
 * 将简化的 PieChartSchema 转换为 VChart Pie Spec
 */
export class PieChartConverter extends BaseConverter<PieChartSchema> {
  readonly chartType = 'pie';

  convert(schema: PieChartSchema): Record<string, unknown> {
    const spec: Record<string, unknown> = {
      type: 'pie',
      data: {
        values: schema.data,
      },
      categoryField: schema.categoryField,
      valueField: schema.valueField,
    };

    // 外半径
    if (schema.outerRadius !== undefined) {
      spec.outerRadius = schema.outerRadius;
    } else {
      spec.outerRadius = 0.8; // 默认值
    }

    // 内半径（0 = 饼图，>0 = 环形图）
    if (schema.innerRadius !== undefined) {
      spec.innerRadius = schema.innerRadius;
    }

    // 标题
    if (schema.title) {
      spec.title = this.processTitle(schema.title);
    }

    // 背景
    if (schema.background) {
      spec.background = this.processBackground(schema.background);
    }

    // 颜色
    if (schema.colors) {
      spec.color = {
        range: schema.colors,
      };
    }

    // 图例
    if (schema.legend !== undefined) {
      spec.legends = this.processLegend(schema.legend);
    } else {
      // 默认显示图例
      spec.legends = { visible: true };
    }

    // 标签
    if (schema.label) {
      const labelSpec: Record<string, unknown> = {
        visible: schema.label.visible !== false,
        position: schema.label.position ?? 'outside',
      };
      if (schema.label.format) {
        labelSpec.formatMethod = (datum: any) => {
          return schema.label!.format!
            .replace('{name}', datum[schema.categoryField])
            .replace('{value}', datum[schema.valueField])
            .replace('{percent}', (datum['percent'] * 100).toFixed(1) + '%');
        };
      }
      if (schema.label.minVisible !== undefined) {
        labelSpec.minVisible = schema.label.minVisible;
      }
      spec.label = labelSpec;
    } else {
      // 默认显示标签
      spec.label = {
        visible: true,
        position: 'outside',
      };
    }

    return spec;
  }

  validate(schema: PieChartSchema): ValidationResult {
    const errors: string[] = [];

    if (!schema.categoryField) {
      errors.push('categoryField is required');
    }
    if (!schema.valueField) {
      errors.push('valueField is required');
    }
    if (!Array.isArray(schema.data) || schema.data.length === 0) {
      errors.push('data must be a non-empty array');
    }
    if (schema.innerRadius !== undefined && (schema.innerRadius < 0 || schema.innerRadius >= 1)) {
      errors.push('innerRadius must be between 0 and 1 (exclusive of 1)');
    }
    if (schema.outerRadius !== undefined && (schema.outerRadius <= 0 || schema.outerRadius > 1)) {
      errors.push('outerRadius must be between 0 and 1');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  getDefaults(): Partial<PieChartSchema> {
    return {
      innerRadius: 0,
      outerRadius: 0.8,
      label: {
        visible: true,
        position: 'outside',
      },
      legend: true,
    };
  }
}
