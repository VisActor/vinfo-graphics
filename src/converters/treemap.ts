import { isNil } from '../utils/isNil';
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
      ...this.initSpec(schema),
      type: 'treemap',
      data: {
        values: hierarchyData,
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
    this.processColors(schema, spec);

    // 节点样式
    this.processNodeStyle(schema, spec);

    // 标签
    this.processLabel(schema, spec);

    // 图例
    spec.legends = this.processLegend(schema.legend ?? false);

    // Icon 配置（通过 extensionMark 实现）
    if (schema.icon?.field && schema.icon?.map) {
      this.processIcon(schema, spec);
    }

    // 节点背景图配置（通过 extensionMark 实现）
    if (schema.nodeBackground?.field && schema.nodeBackground?.map) {
      this.processNodeBackground(schema, spec);
    }

    // 排名标签（仅单层模式有效）
    if (!schema.groupField && schema.rank?.visible !== false) {
      this.processRank(schema, spec);
    }

    // 主题配置
    this.processTheme(schema.theme, spec);

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
        showPercent: true,
      },
      icon: {
        visible: true,
        position: 'top-left',
        offset: 8,
      },
      rank: {
        visible: true,
        position: 'top-left',
      },
      legend: false,
    };
  }

  // ==================== 私有方法 ====================

  /**
   * 处理颜色配置
   */
  private processColors(schema: TreemapChartSchema, spec: Record<string, unknown>): void {
    if (schema.colors) {
      spec.color = {
        range: schema.colors,
      };
    }
  }

  /**
   * 处理节点样式
   */
  private processNodeStyle(schema: TreemapChartSchema, spec: Record<string, unknown>): void {
    if (!isNil(schema.groupField)) {
      spec.nonLeaf = {
        visible: true,
        style: {},
      };
    }

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

        if (spec.nonLeaf) {
          (spec.nonLeaf as any).style.cornerRadius = schema.node.cornerRadius;
        }
      }
    }

    if (!isNil(schema.groupField)) {
      if (isNil(spec.nodePadding)) {
        spec.nodePadding = 5;
      }
    }
  }

  /**
   * 处理标签配置
   */
  private processLabel(schema: TreemapChartSchema, spec: Record<string, unknown>): void {
    if (schema.label?.visible === false) return;

    const labelSpec: Record<string, unknown> = {
      visible: true,
      style: {
        fill: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
      },
    };

    // 单层模式支持百分比显示
    if (!schema.groupField && schema.label?.showPercent !== false) {
      labelSpec.formatMethod = (text: string, datum: any, ctx: any) => {
        const originalDatum = datum.datum[datum.datum.length - 1];

        const name = originalDatum[schema.categoryField] ?? '';
        const value = originalDatum[schema.valueField] ?? 0;
        // 计算百分比
        const total = this.calculateTotal(schema.data, schema.valueField);

        const percent = total > 0 ? ((value / total) * 100).toFixed(0) : '0';

        if (schema.label?.format) {
          return schema.label.format
            .replace(/{name}/g, String(name))
            .replace(/{value}/g, String(value))
            .replace(/{percent}/g, `${percent}%`);
        }
        return `${name}\n${percent}%`;
      };
    } else if (schema.label?.format) {
      labelSpec.formatMethod = (text: string, datum: any) => {
        const originalDatum = datum.datum[datum.datum.length - 1];
        return schema
          .label!.format!.replace(/{name}/g, String(originalDatum[schema.categoryField] ?? ''))
          .replace(/{value}/g, String(originalDatum[schema.valueField] ?? ''));
      };
    }

    if (schema.groupField) {
      spec.nonLeafLabel = {
        visible: true,
        position: 'top',
        padding: 30,
      };
    }

    if (schema.label?.minVisible !== undefined) {
      labelSpec.minVisible = schema.label.minVisible;
    }

    spec.label = labelSpec;
  }

  /**
   * 计算数据总和
   */
  private calculateTotal(data: Record<string, unknown>[], valueField: string): number {
    return data.reduce((sum, item) => {
      const value = Number(item[valueField] ?? 0);
      return sum + (isNaN(value) ? 0 : value);
    }, 0);
  }

  /**
   * 将扁平数据构建为层级结构
   */
  private buildHierarchy(schema: TreemapChartSchema): Record<string, unknown>[] {
    const { categoryField, groupField, data } = schema;

    if (!groupField) {
      // 单层模式：直接构建叶子节点
      return data;
    }

    // 分组模式：按 groupField 分组
    const groups: Record<string, Record<string, unknown>[]> = {};

    data.forEach((item) => {
      const groupKey = String(item[groupField]);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    });

    // 构建层级结构
    const children = Object.entries(groups).map(([groupName, items]) => ({
      [categoryField]: groupName,
      children: items.map((item) => ({
        ...item,
      })),
    }));

    return children;
  }

  /**
   * 处理 Icon 配置（使用 extensionMark）
   */
  private processIcon(schema: TreemapChartSchema, spec: Record<string, unknown>): void {
    if (!schema.icon?.field || !schema.icon?.map) return;

    const iconSize = schema.icon.size ?? 24;
    const position = schema.icon.position ?? 'top-left';
    const offset = schema.icon.offset ?? 8;

    if (!spec.extensionMark) {
      spec.extensionMark = [];
    }

    (spec.extensionMark as Record<string, unknown>[]).push({
      type: 'symbol',
      dataIndex: 0,
      style: {
        ...schema.icon.style,
        symbolType: 'circle',
        size: iconSize,
        visible: (datum: any) => {
          // 分组模式下，只显示叶子节点的 icon
          if (datum.isLeaf === false) {
            return false;
          }
          const originalDatum = datum.datum[datum.datum.length - 1];
          const iconKey = String(originalDatum[schema.icon!.field!] ?? '');
          return !!iconKey && !!schema.icon!.map![iconKey];
        },
        x: (datum: any, ctx: any) => {
          const bounds = this.getNodeBounds(datum, ctx);
          if (!bounds) return 0;

          switch (position) {
            case 'top-left':
            case 'bottom-left':
              return bounds.x + offset + iconSize / 2;
            case 'top-right':
            case 'bottom-right':
              return bounds.x + bounds.width - offset - iconSize / 2;
            case 'center':
            default:
              return bounds.x + bounds.width / 2;
          }
        },
        y: (datum: any, ctx: any) => {
          const bounds = this.getNodeBounds(datum, ctx);
          if (!bounds) return 0;

          switch (position) {
            case 'top-left':
            case 'top-right':
              return bounds.y + offset + iconSize / 2;
            case 'bottom-left':
            case 'bottom-right':
              return bounds.y + bounds.height - offset - iconSize / 2;
            case 'center':
            default:
              return bounds.y + bounds.height / 2;
          }
        },
        background: (datum: any) => {
          const originalDatum = datum.datum[datum.datum.length - 1];

          const iconKey = String(originalDatum[schema.icon!.field!] ?? '');
          return schema.icon!.map![iconKey] ?? '';
        },
      },
    });
  }

  /**
   * 处理节点背景图配置（使用 extensionMark）
   */
  private processNodeBackground(schema: TreemapChartSchema, spec: Record<string, unknown>): void {
    if (!schema.nodeBackground?.field || !schema.nodeBackground?.map) return;

    const opacity = schema.nodeBackground.opacity ?? 0.3;

    if (!spec.extensionMark) {
      spec.extensionMark = [];
    }

    // 背景图需要在底层，使用 unshift 添加到数组开头
    (spec.extensionMark as Record<string, unknown>[]).unshift({
      type: 'image',
      dataIndex: 0,
      style: {
        visible: (datum: any) => {
          // 分组模式下，只显示叶子节点的背景
          if (datum.isLeaf === false) {
            return false;
          }
          const originalDatum = datum.datum[datum.datum.length - 1];
          const bgKey = String(originalDatum[schema.nodeBackground!.field!] ?? '');
          return !!bgKey && !!schema.nodeBackground!.map![bgKey];
        },
        x: (datum: any, ctx: any) => {
          const bounds = this.getNodeBounds(datum, ctx);
          return bounds ? bounds.x : 0;
        },
        y: (datum: any, ctx: any) => {
          const bounds = this.getNodeBounds(datum, ctx);
          return bounds ? bounds.y : 0;
        },
        width: (datum: any, ctx: any) => {
          const bounds = this.getNodeBounds(datum, ctx);
          return bounds ? bounds.width : 0;
        },
        height: (datum: any, ctx: any) => {
          const bounds = this.getNodeBounds(datum, ctx);
          return bounds ? bounds.height : 0;
        },
        image: (datum: any) => {
          const originalDatum = datum.datum[datum.datum.length - 1];
          const bgKey = String(originalDatum[schema.nodeBackground!.field!] ?? '');
          return schema.nodeBackground!.map![bgKey] ?? '';
        },
        cornerRadius: schema.node?.cornerRadius ?? 0,
        opacity,
      },
    });
  }

  /**
   * 处理排���标签（仅单层模式）
   */
  private processRank(schema: TreemapChartSchema, spec: Record<string, unknown>): void {
    if (schema.groupField) return;

    const rankStyle = schema.rank?.style ?? {};
    const fontSize = rankStyle.fontSize ?? 12;
    const position = schema.rank?.position ?? 'top-left';

    // 按值排序数据
    const sortedData = [...schema.data].sort((a, b) => {
      const aVal = Number(a[schema.valueField]) || 0;
      const bVal = Number(b[schema.valueField]) || 0;
      return bVal - aVal;
    });

    // 创建排名映射
    const rankMap = new Map<string, number>();
    sortedData.forEach((item, index) => {
      const key = String(item[schema.categoryField]);
      rankMap.set(key, index + 1);
    });

    if (!spec.extensionMark) {
      spec.extensionMark = [];
    }

    // 背景圆圈
    if (rankStyle.backgroundColor) {
      const symbolSize = Math.floor(fontSize * 1.8);
      (spec.extensionMark as Record<string, unknown>[]).push({
        type: 'symbol',
        dataIndex: 0,
        style: {
          symbolType: 'circle',
          size: symbolSize,
          visible: (datum: any) => {
            const originalDatum = datum.datum[datum.datum.length - 1];
            const name = String(originalDatum[schema.categoryField]);
            return rankMap.has(name);
          },
          x: (datum: any, ctx: any) => {
            const bounds = this.getNodeBounds(datum, ctx);
            if (!bounds) return 0;
            const offset = 8;
            switch (position) {
              case 'top-right':
              case 'bottom-right':
                return bounds.x + bounds.width - offset - symbolSize / 2;
              default:
                return bounds.x + offset + symbolSize / 2;
            }
          },
          y: (datum: any, ctx: any) => {
            const bounds = this.getNodeBounds(datum, ctx);
            if (!bounds) return 0;
            const offset = 8;
            switch (position) {
              case 'bottom-left':
              case 'bottom-right':
                return bounds.y + bounds.height - offset - symbolSize / 2;
              default:
                return bounds.y + offset + symbolSize / 2;
            }
          },
          fill: rankStyle.backgroundColor,
        },
      });
    }

    // 排名文字
    (spec.extensionMark as Record<string, unknown>[]).push({
      type: 'text',
      dataIndex: 0,
      style: {
        text: (datum: any) => {
          const originalDatum = datum.datum[datum.datum.length - 1];
          const name = String(originalDatum[schema.categoryField]);
          const rank = rankMap.get(name);
          return rank ? String(rank) : '';
        },
        visible: (datum: any) => {
          const originalDatum = datum.datum[datum.datum.length - 1];
          const name = String(originalDatum[schema.categoryField]);
          return rankMap.has(name);
        },
        x: (datum: any, ctx: any) => {
          const bounds = this.getNodeBounds(datum, ctx);
          if (!bounds) return 0;
          const offset = 8;
          const symbolSize = rankStyle.backgroundColor ? Math.floor(fontSize * 1.8) : 0;
          switch (position) {
            case 'top-right':
            case 'bottom-right':
              return bounds.x + bounds.width - offset - symbolSize / 2;
            default:
              return bounds.x + offset + symbolSize / 2;
          }
        },
        y: (datum: any, ctx: any) => {
          const bounds = this.getNodeBounds(datum, ctx);
          if (!bounds) return 0;
          const offset = 8;
          const symbolSize = rankStyle.backgroundColor ? Math.floor(fontSize * 1.8) : 0;
          switch (position) {
            case 'bottom-left':
            case 'bottom-right':
              return bounds.y + bounds.height - offset - symbolSize / 2;
            default:
              return bounds.y + offset + symbolSize / 2;
          }
        },
        fill: rankStyle.fill ?? '#fff',
        fontSize,
        fontWeight: rankStyle.fontWeight ?? 'bold',
        textAlign: 'center',
        textBaseline: 'middle',
      },
    });
  }

  /**
   * 获取节点边界（VChart treemap 在 datum 上存储位置信息）
   */
  private getNodeBounds(
    datum: any,
    ctx: any
  ): { x: number; y: number; width: number; height: number } | null {
    // VChart 在 datum 上存储了节点的位置信息
    const { x0, x1, y0, y1 } = datum;
    const width = Math.abs(x1 - x0);
    const height = Math.abs(y1 - y0);

    if (width <= 0 || height <= 0) {
      return null;
    }

    return { x: Math.min(x0, x1), y: Math.min(y0, y1), width, height };
  }
}
