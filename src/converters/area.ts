import type { AreaChartSchema } from '../types/area';
import type { ValidationResult } from './base';
import { BaseConverter } from './base';

/**
 * 面积图转换器
 *
 * 将简化的 AreaChartSchema 转换为 VChart Area Spec
 */
export class AreaChartConverter extends BaseConverter<AreaChartSchema> {
  readonly chartType = 'area';

  convert(schema: AreaChartSchema): Record<string, unknown> {
    const spec: Record<string, unknown> = {
      type: 'area',
      data: {
        values: schema.data,
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

    // 面积样式
    if (schema.area) {
      if (schema.area.smooth !== undefined) {
        spec.area = {
          style: {
            fillOpacity: schema.area.opacity ?? 0.6,
          },
        };
        spec.smooth = schema.area.smooth;
      }
      if (schema.area.opacity !== undefined) {
        spec.area = spec.area || {};
        (spec.area as any).style = (spec.area as any).style || {};
        (spec.area as any).style.fillOpacity = schema.area.opacity;
      }
    }

    // 线条样式
    if (schema.line) {
      spec.line = {
        visible: schema.line.visible !== false,
        style: {
          lineWidth: schema.line.width ?? 2,
        },
      };
    }

    // 数据点
    if (schema.point) {
      spec.point = {
        visible: schema.point.visible !== false,
        style: {
          size: schema.point.size ?? 4,
        },
      };
    }

    // 标签
    if (schema.label?.visible !== false) {
      const labelSpec: Record<string, unknown> = {
        visible: true,
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

    // 图例
    spec.legends = this.processLegend(schema.legend ?? true);

    return spec;
  }

  validate(schema: AreaChartSchema): ValidationResult {
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

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  getDefaults(): Partial<AreaChartSchema> {
    return {
      area: {
        smooth: false,
        opacity: 0.6,
      },
      line: {
        visible: true,
        width: 2,
      },
      point: {
        visible: false,
        size: 4,
      },
      label: {
        visible: false,
      },
      legend: true,
    };
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
