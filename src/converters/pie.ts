import type { PieChartSchema } from '../types/chart/pie';
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
      ...this.initSpec(schema),
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
    this.processBackground(schema.background, spec);

    // 颜色
    const colors = schema.colors ?? this.getThemeConfig().colors;
    if (colors) {
      spec.color = colors;
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
        labelSpec.formatMethod = (label: string, datum: any) => {
          return schema
            .label!.format!.replace('{name}', datum[schema.categoryField])
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

    // Icon（扇区图标）
    this.processIcon(schema, spec);

    // 中心图片
    this.processCenterImage(schema, spec);

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
      legend: {
        visible: true,
      },
    };
  }

  // ==================== 私有方法 ====================

  /**
   * 处理扇区 Icon 配置
   * 使用 extensionMark 在每个扇区中心位置显示图标
   */
  private processIcon(schema: PieChartSchema, spec: Record<string, unknown>): void {
    if (!schema.icon || schema.icon.visible === false || !schema.icon.field || !schema.icon.map) {
      return;
    }

    const iconSize = schema.icon.size ?? 24;
    const innerRadius = schema.innerRadius ?? 0;
    const outerRadius = schema.outerRadius ?? 0.8;
    const offsetRadius = schema.icon.offsetRadius ?? 10;
    const position = schema.icon.position ?? 'inside';

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
        // 控制是否显示
        visible: (datum: any) => {
          const iconKey = String(datum[schema.icon!.field!]);
          return !!iconKey && !!schema.icon!.map![iconKey];
        },
        // 获取扇区中心的 x 坐标
        x: (datum: any, ctx: any) => {
          const angle = this.getDatumAngle(datum, ctx);
          const midRadius = this.getMidRadius(
            ctx,
            innerRadius,
            outerRadius,
            position,
            offsetRadius
          );
          const center = ctx.getCenter();
          return center.x() + midRadius * Math.cos(angle);
        },
        // 获取扇区中心的 y 坐标
        y: (datum: any, ctx: any) => {
          const angle = this.getDatumAngle(datum, ctx);
          const midRadius = this.getMidRadius(
            ctx,
            innerRadius,
            outerRadius,
            position,
            offsetRadius
          );
          const center = ctx.getCenter();
          return center.y() + midRadius * Math.sin(angle);
        },
      },
    });

    (spec.extensionMark as Record<string, unknown>[]).push({
      type: 'image',
      dataIndex: 0,
      style: {
        visible: (datum: any) => {
          const iconKey = String(datum[schema.icon!.field!]);
          return !!iconKey && !!schema.icon!.map![iconKey];
        },
        width: iconSize * 0.8,
        height: iconSize * 0.8,
        // 背景图片
        image: (datum: any) => {
          const iconKey = String(datum[schema.icon!.field!]);
          return schema.icon!.map![iconKey];
        },
        // 获取扇区中心的 x 坐标（图片左上角 = 中心 - 40%）
        x: (datum: any, ctx: any) => {
          const angle = this.getDatumAngle(datum, ctx);
          const midRadius = this.getMidRadius(
            ctx,
            innerRadius,
            outerRadius,
            position,
            offsetRadius
          );
          const center = ctx.getCenter();
          return center.x() + midRadius * Math.cos(angle) - iconSize * 0.4;
        },
        // 获取扇区中心的 y 坐标（图片左上角 = 中心 - 40%）
        y: (datum: any, ctx: any) => {
          const angle = this.getDatumAngle(datum, ctx);
          const midRadius = this.getMidRadius(
            ctx,
            innerRadius,
            outerRadius,
            position,
            offsetRadius
          );
          const center = ctx.getCenter();
          return center.y() + midRadius * Math.sin(angle) - iconSize * 0.4;
        },
      },
    });
  }

  /**
   * 处理中心图片配置
   * 使用 customMark 在饼图中心添加图片（仅环形图有效）
   */
  private processCenterImage(schema: PieChartSchema, spec: Record<string, unknown>): void {
    if (!schema.centerImage || schema.centerImage.visible === false || !schema.centerImage.url) {
      return;
    }

    // 只有环形图才显示中心图片
    const innerRadius = schema.innerRadius ?? 0;
    if (innerRadius <= 0) {
      return;
    }

    const { url, width = 60, height = 60 } = schema.centerImage;

    if (!spec.customMark) {
      spec.customMark = [];
    }

    (spec.customMark as Record<string, unknown>[]).push({
      type: 'image',
      style: {
        image: url,
        width,
        height,
        // 定位到饼图中心
        x: (datum: any, ctx: any) => {
          const center = this.getChartCenter(ctx);
          return center.x - width / 2;
        },
        y: (datum: any, ctx: any) => {
          const center = this.getChartCenter(ctx);
          return center.y - height / 2;
        },
      },
    });
  }

  /**
   * 获取图表中心点坐标
   */
  private getChartCenter(ctx: any): { x: number; y: number } {
    const region = ctx.chart.getAllRegions()[0];
    const layoutRect = region.getLayoutRect();
    const layoutStartPoint = region.getLayoutStartPoint();

    return {
      x: layoutStartPoint.x + layoutRect.width / 2,
      y: layoutStartPoint.y + layoutRect.height / 2,
    };
  }

  /**
   * 获取数据点对应的角度（弧度）
   */
  private getDatumAngle(datum: any, ctx: any): number {
    // VChart 在 datum 上存储了角度信息
    // __VCHART_START_ANGLE 和 __VCHART_END_ANGLE 是起始和结束角度（弧度）
    const startAngle = datum.__VCHART_ARC_START_ANGLE ?? 0;
    const endAngle = datum.__VCHART_ARC_END_ANGLE ?? 0;

    // 返回中间角度
    return (startAngle + endAngle) / 2;
  }

  /**
   * 获取中间半径（像素值）
   */
  private getMidRadius(
    ctx: any,
    innerRadius: number,
    outerRadius: number,
    position: 'inside-inner' | 'inside-outer' | 'outside' | 'inside',
    offsetRadius: number
  ): number {
    // 取宽高中的较小值作为参考
    const layoutRadius = ctx.getLayoutRadius();

    if (position === 'inside-inner') {
      return innerRadius * layoutRadius + offsetRadius;
    } else if (position === 'inside-outer') {
      return outerRadius * layoutRadius - offsetRadius;
    } else if (position === 'outside') {
      return outerRadius * layoutRadius + offsetRadius;
    }
    // 计算实际半径范围
    const innerPx = innerRadius * layoutRadius;
    const outerPx = outerRadius * layoutRadius;

    // 返回中间半径
    return (innerPx + outerPx) / 2;
  }
}
