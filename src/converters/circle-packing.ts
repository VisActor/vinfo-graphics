import { isNil } from '../utils/isNil';
import type { CirclePackingChartSchema } from '../types/chart/circle-packing';
import type { ValidationResult } from './base';
import { BaseConverter } from './base';

/**
 * 圆形闭包图转换器
 *
 * 将简化的 CirclePackingChartSchema 转换为 VChart CirclePacking Spec
 */
export class CirclePackingChartConverter extends BaseConverter<CirclePackingChartSchema> {
  readonly chartType = 'circlePacking';

  convert(schema: CirclePackingChartSchema): Record<string, unknown> {
    // 将扁平数据转换为层级结构
    const hierarchyData = this.buildHierarchy(schema);

    const spec: Record<string, unknown> = {
      ...this.initSpec(schema),
      type: 'circlePacking',
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
    this.processBackground(schema.background, spec);

    // 颜色
    this.processColors(schema, spec);

    // 圆形样式
    this.processCircleStyle(schema, spec);

    // 标签
    this.processLabel(schema, spec);

    // 图例
    spec.legends = this.processLegend(schema.legend ?? false);

    // Icon 配置（通过 extensionMark 实现）
    if (schema.icon?.field && schema.icon?.map) {
      this.processIcon(schema, spec);
    }

    // 圆形背景图配置（通过 extensionMark 实现）
    if (schema.circleBackground?.field && schema.circleBackground?.map) {
      this.processCircleBackground(schema, spec);
    }

    // 排名标签（仅单层模式有效）
    if (!schema.groupField && schema.rank?.visible !== false) {
      this.processRank(schema, spec);
    }

    return spec;
  }

  validate(schema: CirclePackingChartSchema): ValidationResult {
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

  getDefaults(): Partial<CirclePackingChartSchema> {
    return {
      circle: {
        padding: 5,
        strokeWidth: 1,
        strokeColor: '#fff',
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
      legend: {
        visible: false,
      },
    };
  }

  // ==================== 私有方法 ====================

  /**
   * 处理颜色配置
   */
  private processColors(schema: CirclePackingChartSchema, spec: Record<string, unknown>): void {
    // 颜色
    const colors = schema.colors ?? this.getThemeConfig().colors;

    if (colors) {
      spec.color = colors;
    }
  }

  /**
   * 处理圆形样式
   */
  private processCircleStyle(
    schema: CirclePackingChartSchema,
    spec: Record<string, unknown>
  ): void {
    if (schema.circle?.padding !== undefined) {
      spec.layoutPadding = schema.circle.padding;
    }
    if (schema.circle?.strokeWidth !== undefined || schema.circle?.strokeColor !== undefined) {
      spec.circlePacking = {
        style: {
          lineWidth: schema.circle.strokeWidth ?? 1,
          stroke: schema.circle.strokeColor ?? '#fff',
        },
      };
    }

    // fillOpacity 支持
    if (schema.circle?.fillOpacity !== undefined) {
      if (!spec.circlePacking) {
        spec.circlePacking = {};
      }
      const circlePacking = spec.circlePacking as Record<string, unknown>;
      if (!circlePacking.style) {
        circlePacking.style = {};
      }
      (circlePacking.style as Record<string, unknown>).fillOpacity = schema.circle.fillOpacity;
    }

    if (!isNil(schema.groupField)) {
      if (!spec.circlePacking) {
        spec.circlePacking = {};
      }
      const circlePacking = spec.circlePacking as Record<string, unknown>;
      if (!circlePacking.style) {
        circlePacking.style = {};
      }

      const style = circlePacking.style as Record<string, unknown>;
      style.fillOpacity = (d: any) => (d.isLeaf ? 0.75 : 0.25);
    }
  }

  /**
   * 处理标签配置
   */
  private processLabel(schema: CirclePackingChartSchema, spec: Record<string, unknown>): void {
    if (schema.label?.visible === false) return;

    // prominent-value 布局：使用 extensionMark 实现大数值+小名称的双行标签
    if (schema.label?.layout === 'prominent-value') {
      spec.label = { visible: false };
      this.processProminentValueLabel(schema, spec);
      return;
    }

    const labelSpec: Record<string, unknown> = {
      visible: true,
      style: {},
    };

    // 单层模式支持百分比显示
    if (isNil(schema.groupField) && schema.label?.showPercent) {
      (labelSpec.style as any).text = (datum: any) => {
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
      (labelSpec.style as any).text = (datum: any) => {
        const originalDatum = datum.datum[datum.datum.length - 1];
        return schema
          .label!.format!.replace(/{name}/g, String(originalDatum[schema.categoryField] ?? ''))
          .replace(/{value}/g, String(originalDatum[schema.valueField] ?? ''));
      };
    }

    if (!isNil(schema.groupField)) {
      (labelSpec.style as any).dy = (datum: any) => {
        if (datum.isLeaf) {
          return 0;
        }

        return -datum.radius + 16;
      };
    }

    spec.label = labelSpec;
  }

  /**
   * 处理 prominent-value 布局标签
   * 使用 extensionMark 实现：大数值文字 + 小名称文字的双行显示
   */
  private processProminentValueLabel(
    schema: CirclePackingChartSchema,
    spec: Record<string, unknown>
  ): void {
    if (!spec.extensionMark) {
      spec.extensionMark = [];
    }

    const valueStyle = schema.label?.valueStyle ?? {};
    const nameStyle = schema.label?.nameStyle ?? {};
    const showPercent = schema.label?.showPercent !== false;
    const total = this.calculateTotal(schema.data, schema.valueField);

    const defaultValueFill = valueStyle.fill ?? '#fff';
    const defaultNameFill = nameStyle.fill ?? '#fff';
    const defaultValueFontWeight = valueStyle.fontWeight ?? 'bold';
    const defaultNameFontWeight = nameStyle.fontWeight ?? 'normal';

    // 获取数值文本
    const getValueText = (datum: any): string => {
      const originalDatum = datum.datum[datum.datum.length - 1];
      const value = originalDatum[schema.valueField] ?? 0;

      if (showPercent && total > 0) {
        const numValue = Number(value);
        if (!isNaN(numValue)) {
          const percent = ((numValue / total) * 100).toFixed(0);
          return `${percent}%`;
        }
      }

      if (schema.label?.format) {
        // 从 format 中提取 value 部分
        const formatted = schema.label.format
          .replace(/{name}/g, '')
          .replace(/{value}/g, String(value))
          .replace(
            /{percent}/g,
            total > 0 ? `${((Number(value) / total) * 100).toFixed(0)}%` : '0%'
          )
          .trim();
        return formatted;
      }

      return String(value);
    };

    // 获取名称文本
    const getNameText = (datum: any): string => {
      const originalDatum = datum.datum[datum.datum.length - 1];
      return String(originalDatum[schema.categoryField] ?? '');
    };

    // 数值文字（大号，居中偏上）
    (spec.extensionMark as Record<string, unknown>[]).push({
      type: 'text',
      dataIndex: 0,
      style: {
        text: (datum: any) => {
          if (datum.isLeaf === false) return '';
          return getValueText(datum);
        },
        visible: (datum: any) => datum.isLeaf !== false,
        x: (datum: any) => {
          const { cx } = this.getCircleCenter(datum);
          return cx;
        },
        y: (datum: any) => {
          const { cy, r } = this.getCircleCenter(datum);
          // 数值偏上，名称偏下
          return cy - r * 0.08;
        },
        fontSize: valueStyle.fontSize
          ? valueStyle.fontSize
          : (datum: any) => {
              const { r } = this.getCircleCenter(datum);
              // 按圆半径自适应缩放，最小12px
              return Math.max(12, Math.floor(r * 0.55));
            },
        fontWeight: defaultValueFontWeight,
        fill: defaultValueFill,
        textAlign: 'center',
        textBaseline: 'middle',
      },
    });

    // 名称文字（小号，居中偏下）
    (spec.extensionMark as Record<string, unknown>[]).push({
      type: 'text',
      dataIndex: 0,
      style: {
        text: (datum: any) => {
          if (datum.isLeaf === false) return '';
          return getNameText(datum);
        },
        visible: (datum: any) => datum.isLeaf !== false,
        x: (datum: any) => {
          const { cx } = this.getCircleCenter(datum);
          return cx;
        },
        y: (datum: any) => {
          const { cy, r } = this.getCircleCenter(datum);
          // 名称在数值下方
          return cy + r * 0.4;
        },
        fontSize: nameStyle.fontSize
          ? nameStyle.fontSize
          : (datum: any) => {
              const { r } = this.getCircleCenter(datum);
              return Math.max(8, Math.floor(r * 0.22));
            },
        // 名称文字位于 cy + r*0.35，该处弦长约为 2r*0.937，留 10% 余量
        maxLineWidth: (datum: any) => {
          const { r } = this.getCircleCenter(datum);
          return r * 1.6;
        },
        ellipsis: '...',
        lineClamp: 2,
        wrap: true,
        wordBreak: 'break-word',
        fontWeight: defaultNameFontWeight,
        fill: defaultNameFill,
        textAlign: 'center',
        textBaseline: 'middle',
      },
    });
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
  private buildHierarchy(schema: CirclePackingChartSchema): Record<string, unknown>[] {
    const { categoryField, valueField, groupField, data } = schema;

    if (!groupField) {
      // 单层模式：直接构建叶子节点
      return data.map((entry) => {
        return {
          ...entry,
          value: entry[valueField], // TODO, vchart bug
        };
      });
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
        value: item[valueField], // TODO, vchart bug
      })),
    }));

    return children;
  }

  /**
   * 处理 Icon 配置（使用 extensionMark）
   */
  private processIcon(schema: CirclePackingChartSchema, spec: Record<string, unknown>): void {
    if (!schema.icon?.field || !schema.icon?.map) return;

    const iconSize = schema.icon.size ?? 24;
    const position = schema.icon.position ?? 'top-left';
    const offset = schema.icon.offset ?? 8;

    if (!spec.extensionMark) {
      spec.extensionMark = [];
    }

    const getIconVisible = (datum: any) => {
      if (datum.isLeaf === false) return false;
      const originalDatum = datum.datum[datum.datum.length - 1];
      const iconKey = String(originalDatum[schema.icon!.field!] ?? '');
      return !!iconKey && !!schema.icon!.map![iconKey];
    };

    const getIconImage = (datum: any) => {
      const originalDatum = datum.datum[datum.datum.length - 1];
      const iconKey = String(originalDatum[schema.icon!.field!] ?? '');
      return schema.icon!.map![iconKey] ?? '';
    };

    (spec.extensionMark as Record<string, unknown>[]).push({
      type: 'symbol',
      dataIndex: 0,
      style: {
        ...schema.icon.style,
        symbolType: 'circle',
        size: iconSize,
        visible: getIconVisible,
        x: (datum: any, ctx: any) => {
          const { cx, cy } = this.getCircleCenter(datum);
          if (!cx || !cy) return 0;

          switch (position) {
            case 'top-left':
              return cx - offset - iconSize / 2;
            case 'top-right':
              return cx + offset + iconSize / 2;
            case 'center':
            default:
              return cx;
          }
        },
        y: (datum: any, ctx: any) => {
          const { cx, cy, r } = this.getCircleCenter(datum);
          if (!cx || !cy || !r) return 0;

          switch (position) {
            case 'top-left':
            case 'top-right':
              return cy - r + offset + iconSize / 2;
            case 'center':
            default:
              return cy;
          }
        },
      },
    });

    (spec.extensionMark as Record<string, unknown>[]).push({
      type: 'image',
      dataIndex: 0,
      style: {
        visible: getIconVisible,
        width: iconSize * 0.8,
        height: iconSize * 0.8,
        image: getIconImage,
        x: (datum: any, ctx: any) => {
          const { cx, cy } = this.getCircleCenter(datum);
          if (!cx || !cy) return 0;

          switch (position) {
            case 'top-left':
              return cx - offset - iconSize * 0.9;
            case 'top-right':
              return cx + offset + iconSize * 0.1;
            case 'center':
            default:
              return cx - iconSize * 0.4;
          }
        },
        y: (datum: any, ctx: any) => {
          const { cx, cy, r } = this.getCircleCenter(datum);
          if (!cx || !cy || !r) return 0;

          switch (position) {
            case 'top-left':
            case 'top-right':
              return cy - r + offset + iconSize * 0.1;
            case 'center':
            default:
              return cy - iconSize * 0.4;
          }
        },
      },
    });
  }

  /**
   * 处理圆形背景图配置（使用 extensionMark）
   */
  private processCircleBackground(
    schema: CirclePackingChartSchema,
    spec: Record<string, unknown>
  ): void {
    if (!schema.circleBackground?.field || !schema.circleBackground?.map) return;

    const opacity = schema.circleBackground.opacity ?? 0.3;

    if (!spec.extensionMark) {
      spec.extensionMark = [];
    }

    // 背景图需要在底层，使用 unshift 添加到数组开头
    (spec.extensionMark as Record<string, unknown>[]).unshift({
      type: 'symbol',
      dataIndex: 0,
      style: {
        symbolType: 'circle',
        visible: (datum: any) => {
          // 分组模式下，只显示叶子节点的背景
          if (datum.isLeaf === false) {
            return false;
          }
          const originalDatum = datum.datum[datum.datum.length - 1];
          const bgKey = String(originalDatum[schema.circleBackground!.field!] ?? '');

          return !!bgKey && !!schema.circleBackground!.map![bgKey];
        },
        x: (datum: any) => {
          const { cx } = this.getCircleCenter(datum);
          return cx;
        },
        y: (datum: any) => {
          const { cy } = this.getCircleCenter(datum);
          return cy;
        },
        size: (datum: any) => {
          const { r } = this.getCircleCenter(datum);
          return r * 2;
        },

        background: (datum: any) => {
          const originalDatum = datum.datum[datum.datum.length - 1];
          const bgKey = String(originalDatum[schema.circleBackground!.field!] ?? '');
          return schema.circleBackground!.map![bgKey] ?? '';
        },
        opacity,
      },
    });
  }

  /**
   * 处理排名标签（仅单层模式）
   */
  private processRank(schema: CirclePackingChartSchema, spec: Record<string, unknown>): void {
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
          x: (datum: any) => {
            const { cx } = this.getCircleCenter(datum);
            const offset = 8;
            return cx
              ? position === 'top-right'
                ? cx + offset + symbolSize / 2
                : cx - offset - symbolSize / 2
              : 0;
          },
          y: (datum: any) => {
            const { cy, r } = this.getCircleCenter(datum);
            const offset = 8;
            return cy && r ? cy - r + offset + symbolSize / 2 : 0;
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
        x: (datum: any) => {
          const { cx } = this.getCircleCenter(datum);
          const offset = 8;
          const symbolSize = rankStyle.backgroundColor ? Math.floor(fontSize * 1.8) : 0;
          return cx
            ? position === 'top-right'
              ? cx + offset + symbolSize / 2
              : cx - offset - symbolSize / 2
            : 0;
        },
        y: (datum: any) => {
          const { cy, r } = this.getCircleCenter(datum);
          const offset = 8;
          const symbolSize = rankStyle.backgroundColor ? Math.floor(fontSize * 1.8) : 0;
          return cy && r ? cy - r + offset + symbolSize / 2 : 0;
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
   * 获取圆心坐标和半径（VChart circlePacking 在 datum 上存储位置信息）
   */
  private getCircleCenter(datum: any): { cx: number; cy: number; r: number } {
    // VChart 在 datum 上存储了圆的位置信息
    // cx, cy 是圆心坐标，r 是半径
    const cx = datum.x ?? 0;
    const cy = datum.y ?? 0;
    const r = datum.radius ?? 0;

    return { cx, cy, r };
  }
}
