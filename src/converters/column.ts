import type { ColumnChartSchema } from '../types/chart/column';
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
    const sortedData = this.processData(schema);
    const spec: Record<string, unknown> = {
      ...this.initSpec(schema),
      type: 'bar',
      direction: 'vertical',
      data: {
        values: sortedData,
      },
      xField: schema.categoryField,
      yField: schema.valueField,
    };

    // 标题
    if (schema.title) {
      spec.title = this.processTitle(schema.title);
    }

    // 背景
    spec.background = this.processBackground(schema.background);

    // 颜色
    this.processColors(schema, spec);

    // 柱子样式
    this.processColumnStyle(schema, spec);

    // 标签
    this.processLabel(schema, spec);

    // 坐标轴
    this.processAxes(schema, spec);

    // 装饰图片
    this.processBrandImage(schema, spec);

    // 图例
    spec.legends = this.processLegend(schema.legend ?? false);

    // 图标
    this.processIcon(schema, spec);

    // 脚注（支持图片和文字的多种布局）
    if (schema.footnote) {
      const res = this.createFootnoteMarks(schema.footnote);
      if (res && res.marks.length > 0) {
        // 调整底部 padding 为脚注留出空间
        spec.padding = {
          ...(spec.padding as object),
          bottom: (spec.padding as any).bottom + res.size,
        };
        if (!spec.customMark) {
          spec.customMark = [];
        }
        (spec.customMark as Record<string, unknown>[]).push(...res.marks);
      }
    }

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
      legend: {
        visible: false,
      },
    };
  }

  // ==================== 私有方法 ====================

  /**
   * 处理颜色配置
   */
  private processColors(schema: ColumnChartSchema, spec: Record<string, unknown>): void {
    // 颜色
    const colors = schema.colors ?? this.getThemeConfig().colors;

    if (colors) {
      spec.color = colors;
      spec.seriesField = schema.categoryField;
    }
  }

  /**
   * 处理柱子样式（圆角、渐变等）
   */
  private processColumnStyle(schema: ColumnChartSchema, spec: Record<string, unknown>): void {
    if (!schema.column) return;

    // 圆角
    if (schema.column.cornerRadius !== undefined) {
      spec.bar = spec.bar || {};
      (spec.bar as any).style = (spec.bar as any).style || {};
      (spec.bar as any).style.cornerRadius = schema.column.cornerRadius;
    }

    // 渐变填充
    if (schema.column.linearGradient) {
      spec.bar = {
        style: {
          fill: this.processLinearGradient(schema.column.linearGradient),
        },
      };
      // 渐变时也应用圆角
      if (schema.column.cornerRadius !== undefined) {
        (spec.bar as any).style.cornerRadius = schema.column.cornerRadius;
      }
    }

    // 宽度
    if (schema.column.width !== undefined) {
      spec.barWidth = schema.column.width;
    }

    // 间距
    if (schema.column.gap !== undefined) {
      spec.barGap = schema.column.gap;
    }
  }

  /**
   * 处理标签配置
   */
  private processLabel(schema: ColumnChartSchema, spec: Record<string, unknown>): void {
    if (schema.label?.visible === false) return;

    const labelPosition = schema.label?.position ?? 'top';

    const labelSpec: Record<string, unknown> = {
      visible: true,
      position: labelPosition,
      style: {},
    };

    if (this.getThemeConfig().secondaryTextColor) {
      (labelSpec.style as any).fill = this.getThemeConfig()!.secondaryTextColor;
    }

    // 内标签用白色文字
    if (labelPosition?.startsWith('inside')) {
      (labelSpec.style as any).fill = '#fff';
    }

    // 格式化
    if (schema.label?.format) {
      labelSpec.formatMethod = (label: string, datum: any) => {
        return this.formatLabel(schema.label!.format!, datum, schema.valueField);
      };
    }

    spec.label = labelSpec;
  }

  /**
   * 处理坐标轴
   */
  private processAxes(schema: ColumnChartSchema, spec: Record<string, unknown>): void {
    // X 轴（分类轴）
    spec.axes = spec.axes ?? [];

    (spec.axes as Record<string, unknown>[]).push({
      orient: 'bottom',
      visible: schema.xAxis?.visible !== false,
      domainLine: { visible: false },
      tick: { visible: false },
      title: { visible: false },
    });

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
  }

  /**
   * 处理装饰图片
   */
  private processBrandImage(schema: ColumnChartSchema, spec: Record<string, unknown>): void {
    if (!schema.brandImage || schema.brandImage?.visible === false || !schema.brandImage?.url) {
      return;
    }

    const {
      url,
      width = 24,
      height = 24,
      align = 'center',
      verticalAlign = 'top',
      asForeground,
    } = schema.brandImage!;

    // 使用 customMark 添加图片
    if (!spec.customMark) {
      spec.customMark = [];
    }

    (spec.customMark as Record<string, unknown>[]).push({
      type: 'image',
      zIndex: asForeground ? 1000 : 300,
      style: {
        image: url,
        width,
        height,
        x: (datum: any, ctx: any) => {
          const region = ctx.chart.getAllRegions()[0];

          if (align === 'left') {
            return region.getLayoutStartPoint().x;
          }

          if (align === 'center') {
            return region.getLayoutStartPoint().x + region.getLayoutRect().width / 2 - width / 2;
          }

          return region.getLayoutStartPoint().x + region.getLayoutRect().width - width;
        },
        y: (datum: any, ctx: any) => {
          const region = ctx.chart.getAllRegions()[0];

          if (verticalAlign === 'top') {
            return region.getLayoutStartPoint().y;
          }

          if (verticalAlign === 'bottom') {
            return region.getLayoutStartPoint().y + region.getLayoutRect().height - height;
          }

          return region.getLayoutStartPoint().y + region.getLayoutRect().height / 2 - height / 2;
        },
      },
    });
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
   * 创建 Icon marks
   */
  private processIcon(schema: ColumnChartSchema, spec: Record<string, unknown>) {
    if (!schema.icon || schema.icon.visible === false || !schema.icon?.field || !schema.icon?.map) {
      return spec;
    }

    const position = schema.icon.position ?? 'bottom';

    if (!spec.extensionMark) {
      spec.extensionMark = [];
    }

    const size = schema.icon.size ?? schema.column?.width;

    (spec.extensionMark as Record<string, unknown>[]).push({
      type: 'symbol',
      dataIndex: 0,
      style: {
        ...schema.icon.style,
        visible: (datum: any) => {
          const iconKey = String(datum[schema.icon!.field!]);
          return !!iconKey;
        },
        symbolType: 'circle',
        x: (datum: any, ctx: any) => {
          return ctx.valueToX(datum[schema.categoryField]) + ctx.xBandwidth() / 2;
        },
        y: (datum: any, ctx: any) => {
          return position === 'top'
            ? ctx.valueToY(datum[schema.valueField]) - ctx.xBandwidth() / 2
            : ctx.valueToY(datum[schema.valueField]) + ctx.xBandwidth() / 2;
        },
        size: (datum: any, ctx: any) =>
          typeof size === 'number' ? Math.min(size, ctx.xBandwidth()) : ctx.xBandwidth(),
      },
    });

    (spec.extensionMark as Record<string, unknown>[]).push({
      type: 'image',
      dataIndex: 0,
      style: {
        visible: (datum: any) => {
          const iconKey = String(datum[schema.icon!.field!]);
          return !!iconKey;
        },
        x: (datum: any, ctx: any) => {
          return ctx.valueToX(datum[schema.categoryField]) + ctx.xBandwidth() * 0.1;
        },
        y: (datum: any, ctx: any) => {
          return position === 'top'
            ? ctx.valueToY(datum[schema.valueField]) - ctx.xBandwidth() * 0.9
            : ctx.valueToY(datum[schema.valueField]) + ctx.xBandwidth() * 0.1;
        },
        width: (datum: any, ctx: any) => ctx.xBandwidth() * 0.8,
        height: (datum: any, ctx: any) => ctx.xBandwidth() * 0.8,
        image: (datum: any) => {
          const iconKey = String(datum[schema.icon!.field!]);
          return schema.icon!.map![iconKey];
        },
      },
    });

    // Icon 标签
    if (schema.icon.label && schema.icon.label.visible !== false) {
      const { style, offset = 10 } = schema.icon.label;
      (spec.extensionMark as any[]).push({
        type: 'text',
        dataIndex: 0,
        style: {
          fontSize: 12,
          fill: '#333',
          textBaseline: 'middle',
          ...style,
          visible: (datum: any) => {
            const iconKey = String(datum[schema.icon!.field!]);
            return !!iconKey;
          },
          text: (datum: any) => String(datum[schema.icon!.field!]),
          x: (datum: any, ctx: any) => {
            return ctx.valueToX(datum[schema.categoryField]) + ctx.xBandwidth() / 2;
          },
          y: (datum: any, ctx: any) => {
            const iconY =
              position === 'top'
                ? ctx.valueToY(datum[schema.valueField]) - ctx.xBandwidth() / 2
                : ctx.valueToY(datum[schema.valueField]) + ctx.xBandwidth() / 2;
            if (offset > 0) return iconY + offset + ctx.xBandwidth() / 2;
            if (offset < 0) return iconY - offset - ctx.xBandwidth() / 2;
            return iconY;
          },
          textAlign: () => {
            if (offset > 0) return position === 'top' ? 'center' : 'center';
            if (offset < 0) return position === 'top' ? 'center' : 'center';
            return 'center';
          },
        },
      });
    }

    return spec;
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
