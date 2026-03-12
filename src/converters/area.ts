import type { AreaChartSchema } from '../types/chart/area';
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
      ...this.initSpec(schema),
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
    spec.background = this.processBackground(schema.background);

    // 颜色
    const colors = schema.colors ?? this.getThemeConfig().colors;

    if (colors) {
      spec.color = colors;
    }

    // 面积样式
    this.processAreaStyle(schema, spec);

    // 线条样式
    if (schema.line) {
      spec.line = {
        visible: schema.line.visible !== false,
        style: {
          lineWidth: schema.line.width ?? 2,
        },
      };
      if (schema.line.color) {
        (spec.line as any).style.stroke = schema.line.color;
      }
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
    if (schema.label && schema.label?.visible !== false) {
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

    // 图例
    spec.legends = this.processLegend(schema.legend ?? true);

    // 装饰图片
    this.processBrandImage(schema, spec);

    // Icon
    this.processIcon(schema, spec);

    // 标注点
    this.processAnnotationPoint(schema, spec);

    // 垂直标注线
    this.processAnnotationVerticalLine(schema, spec);

    // 水平标注线
    this.processAnnotationHorizontalLine(schema, spec);

    // 标注区域
    this.processAnnotationArea(schema, spec);

    // X 轴（分类轴）
    spec.axes = spec.axes ?? [];
    (spec.axes as Record<string, unknown>[]).push({
      orient: 'bottom',
      trimPadding: true,
      visible: schema.xAxis?.visible !== false,
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

    // 脚注
    if (schema.footnote) {
      const res = this.createFootnoteMarks(schema.footnote);
      if (res && res.marks.length > 0) {
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
      legend: {
        visible: true,
      },
    };
  }

  // ==================== 私有方法 ====================

  /**
   * 处理面积样式
   */
  private processAreaStyle(schema: AreaChartSchema, spec: Record<string, unknown>): void {
    if (!schema.area) return;

    // 渐变填充
    if (schema.area.linearGradient) {
      spec.area = {
        style: {
          fill: this.processLinearGradient(schema.area.linearGradient),
        },
      };
      // 渐变时也应用透明度
      if (schema.area.opacity !== undefined) {
        (spec.area as any).style.fillOpacity = schema.area.opacity;
      }
    } else if (schema.area.opacity !== undefined) {
      spec.area = {
        style: {
          fillOpacity: schema.area.opacity,
        },
      };
    }

    // 平滑曲线
    if (schema.area.smooth !== undefined) {
      spec.smooth = schema.area.smooth;
    }
  }

  /**
   * 处理装饰图片
   */
  private processBrandImage(schema: AreaChartSchema, spec: Record<string, unknown>): void {
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
   * 处理 Icon 配置（使用 extensionMark）
   */
  private processIcon(schema: AreaChartSchema, spec: Record<string, unknown>): void {
    if (!schema.icon || schema.icon.visible === false || !schema.icon?.field || !schema.icon?.map) {
      return;
    }

    const iconSize = schema.icon.size ?? 24;
    const position = schema.icon.position ?? 'top';

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
          return !!iconKey && !!schema.icon!.map![iconKey];
        },
        symbolType: 'circle',
        x: (datum: any, ctx: any) => {
          return ctx.valueToX(datum[schema.categoryField]);
        },
        y: (datum: any, ctx: any) => {
          return position === 'top'
            ? ctx.valueToY(datum[schema.valueField]) - iconSize
            : ctx.valueToY(datum[schema.valueField]) + iconSize;
        },
        size: iconSize,
        background: (datum: any) => {
          const iconKey = String(datum[schema.icon!.field!]);
          return schema.icon!.map![iconKey];
        },
      },
    });
  }

  /**
   * 处理标注点（使用 markPoint）
   */
  private processAnnotationPoint(schema: AreaChartSchema, spec: Record<string, unknown>): void {
    if (!schema.annotationPoint || schema.annotationPoint.length === 0) {
      return;
    }

    // 使用 VChart 的 markPoint
    if (!spec.markPoint) {
      spec.markPoint = [];
    }

    schema.annotationPoint.forEach((point) => {
      // 找到对应的数据
      const targetData = schema.data.find((item) => {
        return item[schema.categoryField] === point.value;
      });

      if (!targetData) return;

      (spec.markPoint as Record<string, unknown>[]).push({
        coordinate: targetData,
        itemLine: {
          visible: false,
        },
        itemContent: {
          type: 'text',
          text: {
            text: point.text ?? String(targetData[schema.valueField]),
            style: {
              fill: point.textColor ?? '#333',
              fontSize: point.textFontSize ?? 12,
              fontWeight: point.textFontWeight ?? 'normal',
            },
            labelBackground: point.textBackgroundColor
              ? {
                  visible: true,
                  style: {
                    fill: point.textBackgroundColor ?? 'rgba(255,255,255,0.9)',
                    cornerRadius: 4,
                  },
                }
              : undefined,
          },
          position: 'bottom',
          offsetY: point.offsetY ?? -10,
          offsetX: point.offsetX ?? 0,
        },
      });
    });
  }

  /**
   * 处理垂直标注线（使用 markLine）
   */
  private processAnnotationVerticalLine(
    schema: AreaChartSchema,
    spec: Record<string, unknown>
  ): void {
    if (!schema.annotationVerticalLine || schema.annotationVerticalLine.length === 0) {
      return;
    }

    if (!spec.markLine) {
      spec.markLine = [];
    }
    const themeConfig = this.getThemeConfig();

    schema.annotationVerticalLine.forEach((line) => {
      (spec.markLine as Record<string, unknown>[]).push({
        x: line.xValue,
        label: {
          visible: true,
          text: line.text,
          textStyle: {
            fill: line.textColor ?? themeConfig.secondaryTextColor,
            fontSize: line.textFontSize ?? 12,
          },
          position: 'outsideEnd',
          labelBackground: line.textBackgroundVisible
            ? {
                visible: true,
                style: {
                  fill: line.textBackgroundColor ?? 'rgba(255,255,255,0.9)',
                  cornerRadius: 4,
                },
              }
            : undefined,
        },
        line: {
          visible: line.lineVisible !== false,
          style: {
            stroke: line.lineColor ?? '#666',
            lineWidth: line.lineWidth ?? 1,
            lineDash:
              line.lineStyle === 'dashed'
                ? [5, 5]
                : line.lineStyle === 'dotted'
                  ? [2, 2]
                  : undefined,
          },
        },
      });
    });
  }

  /**
   * 处理水平标注线（使用 markLine）
   */
  private processAnnotationHorizontalLine(
    schema: AreaChartSchema,
    spec: Record<string, unknown>
  ): void {
    if (!schema.annotationHorizontalLine || schema.annotationHorizontalLine.length === 0) {
      return;
    }

    if (!spec.markLine) {
      spec.markLine = [];
    }

    const themeConfig = this.getThemeConfig();

    schema.annotationHorizontalLine.forEach((line) => {
      (spec.markLine as Record<string, unknown>[]).push({
        y: line.yValue,
        label: {
          visible: true,
          text: line.text,
          style: {
            fill: line.textColor ?? themeConfig.secondaryTextColor,
            fontSize: line.textFontSize ?? 12,
          },
          position: 'insideEndTop',
          labelBackground: line.textBackgroundVisible
            ? {
                visible: true,
                style: {
                  fill: line.textBackgroundColor ?? 'rgba(255,255,255,0.9)',
                  cornerRadius: 4,
                },
              }
            : undefined,
        },
        line: {
          visible: line.lineVisible !== false,
          style: {
            stroke: line.lineColor ?? '#666',
            lineWidth: line.lineWidth ?? 1,
            lineDash:
              line.lineStyle === 'dashed'
                ? [5, 5]
                : line.lineStyle === 'dotted'
                  ? [2, 2]
                  : undefined,
          },
        },
      });
    });
  }

  /**
   * 处理标注区域（使用 markArea）
   */
  private processAnnotationArea(schema: AreaChartSchema, spec: Record<string, unknown>): void {
    if (!schema.annotationArea || schema.annotationArea.length === 0) {
      return;
    }

    if (!spec.markArea) {
      spec.markArea = [];
    }

    schema.annotationArea.forEach((area) => {
      (spec.markArea as Record<string, unknown>[]).push({
        x: area.startValue,
        x1: area.endValue,
        label: {
          visible: true,
          text: area.text,
          textStyle: {
            fill: area.textColor ?? '#333',
            fontSize: area.textFontSize ?? 12,
          },
          position: 'top',
        },
        area: {
          style: {
            fill: area.areaColor ?? 'rgba(255,255,255,0.3)',
            fillOpacity: area.areaColorOpacity ?? 0.3,
          },
        },
      });
    });
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
