import type { ColumnChartSchema } from '../types/column';
import type { ValidationResult } from './base';
import { BaseConverter } from './base';

/**
 * 柱图转换器
 *
 * 将简化的 ColumnChartSchema 转换为 VChart Bar Spec (vertical)
 */
export class ColumnChartConverter extends BaseConverter<ColumnChartSchema> {
  readonly chartType = 'column';

  convert(schema: ColumnChartSchema): Record<string, unknown> {
    const spec: Record<string, unknown> = {
      type: 'bar',
      direction: 'vertical',
      data: {
        values: this.processData(schema),
      },
      xField: schema.categoryField,
      yField: schema.valueField,
    };

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

    // 柱子样式
    if (schema.column) {
      if (schema.column.cornerRadius !== undefined) {
        spec.bar = {
          style: {
            cornerRadius: schema.column.cornerRadius,
          },
        };
      }
      if (schema.column.width !== undefined) {
        spec.barWidth = schema.column.width;
      }
      if (schema.column.gap !== undefined) {
        spec.barGap = schema.column.gap;
      }
    }

    // 标签
    if (schema.label?.visible !== false) {
      const labelSpec: Record<string, unknown> = {
        visible: true,
        position: schema.label?.position ?? 'top',
        style: {
          fill: '#333',
        },
      };
      if (schema.label?.format) {
        labelSpec.formatMethod = (datum: any) => {
          return this.formatLabel(schema.label!.format!, datum, schema.valueField);
        };
      }
      spec.label = labelSpec;
    }

    // X 轴（分类轴）
    if (schema.xAxis) {
      spec.axes = spec.axes ?? [];
      (spec.axes as Record<string, unknown>[]).push({
        orient: 'bottom',
        visible: schema.xAxis.visible !== false,
      });
    }

    // Y 轴（数值轴）
    if (schema.yAxis) {
      spec.axes = spec.axes ?? [];
      (spec.axes as Record<string, unknown>[]).push({
        orient: 'left',
        visible: schema.yAxis.visible !== false,
        label: schema.yAxis.format
          ? { formatMethod: (val: number) => this.formatValue(schema.yAxis!.format!, val) }
          : undefined,
      });
    }

    // 图例（柱图默认不显示图例）
    spec.legends = this.processLegend(schema.legend ?? false);

    return spec;
  }

  validate(schema: ColumnChartSchema): ValidationResult {
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
    if (schema.sort && !['asc', 'desc', 'none'].includes(schema.sort)) {
      errors.push('sort must be one of: asc, desc, none');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  getDefaults(): Partial<ColumnChartSchema> {
    return {
      column: {
        cornerRadius: 0,
        gap: 8,
      },
      label: {
        visible: true,
        position: 'top',
      },
      sort: 'none',
      legend: false,
    };
  }

  /**
   * 处理数据排序
   */
  private processData(schema: ColumnChartSchema): Record<string, unknown>[] {
    let data = [...schema.data];

    if (schema.sort === 'asc') {
      data.sort((a, b) => {
        const aVal = Number(a[schema.valueField]) || 0;
        const bVal = Number(b[schema.valueField]) || 0;
        return aVal - bVal;
      });
    } else if (schema.sort === 'desc') {
      data.sort((a, b) => {
        const aVal = Number(a[schema.valueField]) || 0;
        const bVal = Number(b[schema.valueField]) || 0;
        return bVal - aVal;
      });
    }

    return data;
  }

  /**
   * 格式化标签
   */
  private formatLabel(format: string, datum: Record<string, unknown>, valueField: string): string {
    return format
      .replace(/{value}/g, String(datum[valueField] ?? ''))
      .replace(/{name}/g, String(datum['name'] ?? ''))
      .replace(/{category}/g, String(datum['category'] ?? ''));
  }

  /**
   * 格式化数值
   */
  private formatValue(format: string, value: number): string {
    return format.replace(/{value}/g, String(value));
  }
}
