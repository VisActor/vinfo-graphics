import type { BarChartSchema } from '../types/chart/bar';
import type { ValidationResult } from './base';
import { BaseConverter } from './base';

/**
 * 条形图转换器
 *
 * 将简化的 BarChartSchema 转换为 VChart Bar Spec
 */
export class BarChartConverter extends BaseConverter<BarChartSchema> {
  readonly chartType = 'bar';

  convert(schema: BarChartSchema): Record<string, unknown> {
    const sortedData = this.processData(schema);
    const spec: Record<string, unknown> = {
      ...this.initSpec(schema),
      type: 'bar',
      direction: 'horizontal',
      data: {
        values: sortedData,
      },
      xField: schema.valueField,
      yField: schema.categoryField,
    };

    // 标题
    if (schema.title) {
      spec.title = this.processTitle(schema.title);
    }

    // 背景

    this.processBackground(schema.background, spec);

    // 颜色
    this.processColors(schema, spec);

    // 条形样式
    this.processBarStyle(schema, spec);

    // 标签
    this.processLabel(schema, spec);

    // 排名标签
    if (schema.rank && schema.rank.visible !== false) {
      this.processRank(schema, sortedData, spec);
    }

    // 坐标轴
    this.processAxes(schema, spec);

    // 右侧固定图片
    this.processBrandImage(schema, spec);

    // 图例
    spec.legends = this.processLegend(
      (spec.color as unknown as string[]).length > 1 ? (schema.legend ?? false) : false
    );

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

  validate(schema: BarChartSchema): ValidationResult {
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

  getDefaults(): Partial<BarChartSchema> {
    return {
      bar: {
        cornerRadius: 0,
        gap: 8,
      },
      label: {
        visible: true,
        position: 'outside',
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
  private processColors(schema: BarChartSchema, spec: Record<string, unknown>): void {
    const colors = schema.colors ?? this.getThemeConfig().colors;

    if (colors && colors.length > 0 && colors.length >= schema.data.length) {
      spec.color = colors;
      spec.seriesField = schema.categoryField;
    } else {
      spec.color = [colors[0]];
      spec.seriesField = schema.categoryField;
    }
  }

  /**
   * 处理条形样式（圆角、渐变等）
   */
  private processBarStyle(schema: BarChartSchema, spec: Record<string, unknown>): void {
    if (!schema.bar) return;

    // 圆角
    if (schema.bar.cornerRadius !== undefined) {
      spec.bar = spec.bar || {};
      (spec.bar as any).style = (spec.bar as any).style || {};
      (spec.bar as any).style.cornerRadius = schema.bar.cornerRadius;
    }

    // 渐变填充
    if (schema.bar.linearGradient) {
      spec.bar = {
        style: {
          fill: this.processLinearGradient(schema.bar.linearGradient),
        },
      };
      // 渐变时也应用圆角
      if (schema.bar.cornerRadius !== undefined) {
        (spec.bar as any).style.cornerRadius = schema.bar.cornerRadius;
      }
    }

    // 宽度
    if (schema.bar.width !== undefined) {
      spec.barWidth = schema.bar.width;
    }

    // 间距
    if (schema.bar.gap !== undefined) {
      spec.barGap = schema.bar.gap;
    }
  }

  /**
   * 处理标签配置
   */
  private processLabel(schema: BarChartSchema, spec: Record<string, unknown>): void {
    if (schema.label?.visible === false) return;

    const labelPosition = schema.label?.position ?? 'outside';

    const labelSpec: Record<string, unknown> = {
      visible: true,
      position: labelPosition,
      style: {},
    };

    if (this.getThemeConfig().secondaryTextColor) {
      (labelSpec.style as any).fill = this.getThemeConfig()!.secondaryTextColor;
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
   * 处理排名标签
   */
  private processRank(
    schema: BarChartSchema,
    sortedData: Record<string, unknown>[],
    spec: Record<string, unknown>
  ): void {
    const rankPosition = schema.rank?.position ?? 'start';
    const rankStyle = schema.rank?.style ?? {};
    const dataWithRank = sortedData.map((item, index) => ({
      ...item,
      _rank: index + 1,
    }));

    spec.data = { values: dataWithRank };
    const fontSize = rankStyle.fontSize ?? 12;

    if (schema.rank!.position === 'yAxis') {
      this.processRankOnYAxis(schema, rankStyle, fontSize, spec);
    } else {
      this.processRankOnBar(schema, rankPosition, rankStyle, fontSize, spec);
    }
  }

  /**
   * 处理 Y 轴位置的排名标签
   */
  private processRankOnYAxis(
    schema: BarChartSchema,
    rankStyle: Record<string, any>,
    fontSize: number,
    spec: Record<string, unknown>
  ): void {
    if (!spec.customMark) {
      spec.customMark = [];
    }
    const symbolSize = Math.floor(fontSize * 1.8);
    const offset = 8;

    // 背景圆圈
    const bgMark: Record<string, unknown> = {
      type: 'symbol',
      dataIndex: 0,
      style: {
        symbolType: 'circle',
        size: symbolSize,
        x: (datum: any, ctx: any) => {
          return ctx.chart.padding.left - symbolSize / 2 - offset;
        },
        y: (datum: any, ctx: any) => {
          const series = ctx.chart.getAllSeries()[0];
          const seriesCtx = series._markAttributeContext;
          const region = ctx.chart.getAllRegions()[0];
          return (
            seriesCtx.valueToY(datum[schema.categoryField]) +
            seriesCtx.yBandwidth() / 2 +
            region.getLayoutStartPoint().y
          );
        },
        fill: (datum: any, ctx: any) => {
          return rankStyle.backgroundColor ?? ctx.globalScale('color', datum[schema.categoryField]);
        },
      },
    };
    (spec.customMark as Record<string, unknown>[]).push(bgMark);

    // 排名文字
    const rankMark: Record<string, unknown> = {
      type: 'text',
      dataIndex: 0,
      style: {
        text: (datum: any) => String(datum._rank),
        x: (datum: any, ctx: any) => {
          return ctx.chart.padding.left - symbolSize / 2 - offset;
        },
        y: (datum: any, ctx: any) => {
          const series = ctx.chart.getAllSeries()[0];
          const seriesCtx = series._markAttributeContext;
          const region = ctx.chart.getAllRegions()[0];
          return (
            seriesCtx.valueToY(datum[schema.categoryField]) +
            seriesCtx.yBandwidth() / 2 +
            region.getLayoutStartPoint().y
          );
        },
        fill: rankStyle.fill ?? '#fff',
        fontSize,
        fontWeight: rankStyle.fontWeight ?? 'bold',
        textAlign: 'center',
        textBaseline: 'middle',
      },
    };
    (spec.customMark as Record<string, unknown>[]).push(rankMark);
    (spec.padding as { left: number }).left += symbolSize + offset;
  }

  /**
   * 处理条形上的排名标签
   */
  private processRankOnBar(
    schema: BarChartSchema,
    rankPosition: string,
    rankStyle: Record<string, any>,
    fontSize: number,
    spec: Record<string, unknown>
  ): void {
    if (!spec.extensionMark) {
      spec.extensionMark = [];
    }

    // 背景圆圈
    const bgMark: Record<string, unknown> = {
      type: 'symbol',
      dataIndex: 0,
      style: {
        symbolType: 'circle',
        size: Math.floor(fontSize * 1.8),
        x: (datum: any, ctx: any) => {
          return rankPosition === 'end'
            ? ctx.valueToX(datum[schema.valueField]) - ctx.yBandwidth() / 2
            : ctx.yBandwidth() / 2;
        },
        y: (datum: any, ctx: any) => {
          return ctx.valueToY(datum[schema.categoryField]) + ctx.yBandwidth() / 2;
        },
        fill: rankStyle.backgroundColor ?? this.getThemeConfig().backgroundColor,
      },
    };
    (spec.extensionMark as Record<string, unknown>[]).push(bgMark);

    // 排名文字
    const rankMark: Record<string, unknown> = {
      type: 'text',
      dataIndex: 0,
      style: {
        text: (datum: any) => String(datum._rank),
        x: (datum: any, ctx: any) => {
          return rankPosition === 'end'
            ? ctx.valueToX(datum[schema.valueField]) - ctx.yBandwidth() / 2
            : ctx.yBandwidth() / 2;
        },
        y: (datum: any, ctx: any) => {
          return ctx.valueToY(datum[schema.categoryField]) + ctx.yBandwidth() / 2;
        },
        fill: rankStyle.fill ?? this.getThemeConfig().secondaryTextColor,
        fontSize,
        fontWeight: rankStyle.fontWeight ?? 'bold',
        textAlign: 'center',
        textBaseline: 'middle',
      },
    };
    (spec.extensionMark as Record<string, unknown>[]).push(rankMark);
  }

  /**
   * 处理坐标轴
   */
  private processAxes(schema: BarChartSchema, spec: Record<string, unknown>): void {
    // X 轴（数值轴）
    spec.axes = spec.axes ?? [];
    (spec.axes as Record<string, unknown>[]).push({
      orient: 'bottom',
      visible: schema.xAxis?.visible !== false,
      label: schema.xAxis?.format
        ? { formatMethod: (val: number) => this.formatValue(schema.xAxis!.format!, val) }
        : undefined,
      grid: { visible: false },
    });

    // Y 轴（分类轴）
    if (schema.yAxis) {
      spec.axes = spec.axes ?? [];
      (spec.axes as Record<string, unknown>[]).push({
        orient: 'left',
        visible: schema.yAxis.visible !== false,
        domainLine: { visible: false },
        tick: { visible: false },
        title: { visible: false },
      });
    } else {
      spec.axes = spec.axes ?? [];
      (spec.axes as Record<string, unknown>[]).push({
        orient: 'left',
        visible: false,
      });
    }
  }

  /**
   * 处理右侧固定图片（显示在Y轴旁边）
   */
  private processBrandImage(schema: BarChartSchema, spec: Record<string, unknown>): void {
    if (!schema.brandImage || schema.brandImage?.visible === false || !schema.brandImage?.url) {
      return;
    }

    const {
      url,
      width = 24,
      height = 24,
      align = 'right',
      verticalAlign = 'middle',
      asForeground,
    } = schema.brandImage!;

    // 使用 customMark 在右侧添加图片
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
          // 获取图表右侧位置
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
  private processData(schema: BarChartSchema): Record<string, unknown>[] {
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
  private processIcon(schema: BarChartSchema, spec: Record<string, unknown>) {
    if (!schema.icon || schema.icon.visible === false || !schema.icon?.field || !schema.icon?.map) {
      return spec;
    }

    const position = schema.icon.position ?? 'start';

    if (!spec.extensionMark) {
      spec.extensionMark = [];
    }

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
          return position === 'end'
            ? ctx.valueToX(datum[schema.valueField]) - ctx.yBandwidth() / 2
            : ctx.yBandwidth() / 2;
        },
        y: (datum: any, ctx: any) => {
          return ctx.valueToY(datum[schema.categoryField]) + ctx.yBandwidth() / 2;
        },
        size: (datum: any, ctx: any) => ctx.yBandwidth(),
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
        symbolType: 'circle',
        x: (datum: any, ctx: any) => {
          return position === 'end'
            ? ctx.valueToX(datum[schema.valueField]) - 0.9 * ctx.yBandwidth()
            : ctx.yBandwidth() * 0.1;
        },
        y: (datum: any, ctx: any) => {
          return ctx.valueToY(datum[schema.categoryField]) + ctx.yBandwidth() * 0.1;
        },
        width: (datum: any, ctx: any) => ctx.yBandwidth() * 0.8,
        height: (datum: any, ctx: any) => ctx.yBandwidth() * 0.8,
        image: (datum: any, ctx: any) => {
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
          fill: this.getThemeConfig().secondaryTextColor,
          textBaseline: 'middle',
          ...style,
          visible: (datum: any) => {
            const iconKey = String(datum[schema.icon!.field!]);
            return !!iconKey;
          },
          text: (datum: any) => String(datum[schema.icon!.field!]),
          x: (datum: any, ctx: any) => {
            const iconX =
              position === 'end'
                ? ctx.valueToX(datum[schema.valueField]) - ctx.yBandwidth() / 2
                : ctx.yBandwidth() / 2;
            if (offset > 0) return iconX + offset + ctx.yBandwidth() / 2;
            if (offset < 0) return iconX - offset - ctx.yBandwidth() / 2;
            return iconX;
          },
          y: (datum: any, ctx: any) => {
            return ctx.valueToY(datum[schema.categoryField]) + ctx.yBandwidth() / 2;
          },
          textAlign: () => {
            if (offset > 0) return position === 'end' ? 'right' : 'left';
            if (offset < 0) return position === 'end' ? 'left' : 'right';
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
  private formatLabel(
    format: string,
    datum: Record<string, unknown>,
    valueField: string
  ): string[] {
    return format
      .replace(/{value}/g, String(datum[valueField] ?? ''))
      .replace(/{name}/g, String(datum['name'] ?? ''))
      .replace(/{category}/g, String(datum['category'] ?? ''))
      .split('\n');
  }

  /**
   * 格式化数值
   */
  private formatValue(format: string, value: number): string {
    return format.replace(/{value}/g, String(value));
  }
}
