import type { TreemapChartSchema } from '../types/treemap';
import type { ValidationResult } from './base';
import { BaseConverter } from './base';

/**
 * 矩阵树图转换器
 *
 * 将简化的 TreemapChartSchema 转换为 VChart Treemap Spec
 */
export class TreemapChartConverter extends BaseConverter<TreemapChartSchema> {
  readonly chartType = 'treemap';

  convert(schema: TreemapChartSchema): Record<string, unknown> {
    // 将扁平数据转换为层级结构
    const hierarchyData = this.buildHierarchy(schema);

    const spec: Record<string, unknown> = {
      type: 'treemap',
      data: {
        values: [hierarchyData],
      },
      categoryField: schema.categoryField,
      valueField: schema.valueField,
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

    // 节点样式
    if (schema.node) {
      if (schema.node.gap !== undefined) {
        spec.gapWidth = schema.node.gap;
      }
      if (schema.node.padding !== undefined) {
        spec.nodePadding = schema.node.padding;
      }
      if (schema.node.cornerRadius !== undefined) {
        spec.leaf = {
          style: {
            cornerRadius: schema.node.cornerRadius,
          },
        };
        spec.nonLeaf = {
          style: {
            cornerRadius: schema.node.cornerRadius,
          },
        };
      }
    }

    // 标签
    if (schema.label?.visible !== false) {
      const labelSpec: Record<string, unknown> = {
        visible: true,
      };
      if (schema.label?.format) {
        labelSpec.formatMethod = (datum: any) => {
          return this.formatLabel(schema.label!.format!, datum, schema.categoryField, schema.valueField);
        };
      }
      if (schema.label?.minVisible !== undefined) {
        labelSpec.minVisible = schema.label.minVisible;
      }
      spec.label = labelSpec;
    }

    // 图例
    spec.legends = this.processLegend(schema.legend ?? false);

    // Icon 配置（通过 extensionMark 实现）
    if (schema.icon?.field && schema.icon?.map) {
      spec.extensionMark = this.createIconMarks(schema);
    }

    // 背景图映射（通过 extensionMark 实现）
    if (schema.backgroundMap?.field && schema.backgroundMap?.map) {
      spec.extensionMark = [
        ...((spec.extensionMark as any[]) || []),
        ...this.createBackgroundMarks(schema),
      ];
    }

    return spec;
  }

  validate(schema: TreemapChartSchema): ValidationResult {
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

  getDefaults(): Partial<TreemapChartSchema> {
    return {
      node: {
        gap: 2,
        padding: 4,
        cornerRadius: 0,
      },
      label: {
        visible: true,
      },
      legend: false,
    };
  }

  /**
   * 将扁平数据构建为层级结构
   */
  private buildHierarchy(schema: TreemapChartSchema): Record<string, unknown> {
    return {
      name: 'root',
      children: schema.data.map(item => ({
        name: String(item[schema.categoryField]),
        value: Number(item[schema.valueField]) || 0,
        ...item,
      })),
    };
  }

  /**
   * 创建 Icon marks
   */
  private createIconMarks(schema: TreemapChartSchema): Record<string, unknown>[] {
    if (!schema.icon?.field || !schema.icon?.map) {
      return [];
    }

    const size = schema.icon.size ?? 24;
    const marks: Record<string, unknown>[] = [];

    schema.data.forEach((item) => {
      const iconKey = String(item[schema.icon!.field!]);
      const iconUrl = schema.icon!.map![iconKey];

      if (!iconUrl) return;

      marks.push({
        type: 'image',
        data: { values: [item] },
        style: {
          width: size,
          height: size,
          src: iconUrl,
        },
      });
    });

    return marks;
  }

  /**
   * 创建背景图 marks
   */
  private createBackgroundMarks(schema: TreemapChartSchema): Record<string, unknown>[] {
    if (!schema.backgroundMap?.field || !schema.backgroundMap?.map) {
      return [];
    }

    const opacity = schema.backgroundMap.opacity ?? 0.5;
    const marks: Record<string, unknown>[] = [];

    schema.data.forEach((item) => {
      const bgKey = String(item[schema.backgroundMap!.field!]);
      const bgUrl = schema.backgroundMap!.map![bgKey];

      if (!bgUrl) return;

      marks.push({
        type: 'image',
        data: { values: [item] },
        style: {
          width: '100%',
          height: '100%',
          src: bgUrl,
          opacity: opacity,
        },
      });
    });

    return marks;
  }

  /**
   * 格式化标签
   */
  private formatLabel(
    format: string,
    datum: Record<string, unknown>,
    categoryField: string,
    valueField: string
  ): string {
    return format
      .replace(/{name}/g, String(datum[categoryField] ?? ''))
      .replace(/{value}/g, String(datum[valueField] ?? ''));
  }
}
