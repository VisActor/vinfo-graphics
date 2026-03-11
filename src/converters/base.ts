import type {
  BaseChartSchema,
  TitleConfig,
  FootnoteConfig,
  BackgroundConfig,
  LegendConfig,
  LinearGradientConfig,
  Theme,
  ThemeConfig,
} from '../types/base';
import { resolveTheme, isDarkTheme, vchartThemeMap } from '../themes';

/**
 * 转换结果
 */
export interface ConvertResult {
  /** 是否成功 */
  success: boolean;
  /** VChart Spec */
  spec?: Record<string, unknown>;
  /** 错误信息 */
  errors?: string[];
}

/**
 * 校验结果
 */
export interface ValidationResult {
  /** 是否有效 */
  valid: boolean;
  /** 错误信息 */
  errors: string[];
}

const defaultThemeConfig: ThemeConfig = {
  type: 'light',
  colors: [
    '#1664FF',
    '#1AC6FF',
    '#FF8A00',
    '#3CC780',
    '#7442D4',
    '#FFC400',
    '#304D77',
    '#B48DEB',
    '#009488',
    '#FF7DDA',
  ],
  backgroundColor: '#fff',
  textColor: '#21252c',
  secondaryTextColor: '#606773',
};

/**
 * 转换器基类
 */
export abstract class BaseConverter<T extends BaseChartSchema> {
  /** 图表类型 */
  abstract readonly chartType: string;

  /**
   * 将 Schema 转换为 VChart Spec
   */
  abstract convert(schema: T): Record<string, unknown>;

  /**
   * 校验 Schema
   */
  abstract validate(schema: T): ValidationResult;

  /**
   * 获取默认配置
   */
  abstract getDefaults(): Partial<T>;

  protected initSpec(schema: T): Record<string, unknown> {
    const spec = {
      padding: { top: 20, right: 20, bottom: 20, left: 20 },
    };
    // 主题配置
    this.processTheme(schema.theme, spec);

    return spec;
  }

  /**
   * 处理标题配置
   */
  protected processTitle(
    title: string | TitleConfig | undefined
  ): Record<string, unknown> | undefined {
    if (!title) return undefined;

    if (typeof title === 'string') {
      return { text: title };
    }

    const result: Record<string, unknown> = { text: title.text };
    if (title.subtext) {
      result.subtext = title.subtext;
    }
    if (title.position) {
      result.align = title.position;
    }
    return result;
  }

  /**
   * 创建脚注的 customMark 配置（支持图片和文字的多种布局）
   * 布局方式：
   * - 'left': 图片和文字都在左侧
   * - 'right': 图片和文字都在右侧
   * - 'image-left-text-right': 图片在左侧，文字在右侧
   * - 'image-right-text-left': 文字在左侧，图片在右侧
   * - 'center': 居中显示
   */
  protected createFootnoteMarks(
    footnote: FootnoteConfig | undefined
  ): { marks: Record<string, unknown>[]; size: number } | undefined {
    if (!footnote || (!footnote.text && !footnote.image)) {
      return undefined;
    }

    const marks: Record<string, unknown>[] = [];
    const layout = footnote.layout ?? 'left';
    const fontSize = footnote.fontSize ?? 12;
    const fill = footnote.fill ?? this.getThemeConfig().secondaryTextColor;
    const imageWidth = footnote.imageWidth ?? 16;
    const imageHeight = footnote.imageHeight ?? 16;
    const gap = footnote.gap ?? 8;
    const offset = footnote.offset ?? 10;

    // 计算位置的基础函数
    const getBaseX = (align: 'left' | 'center' | 'right') => {
      return (datum: any, ctx: any) => {
        const rect = ctx.chart.getLayoutRect();

        if (align === 'left') {
          return rect.x;
        }
        if (align === 'center') {
          return rect.x + rect.width / 2;
        }
        return rect.x + rect.width;
      };
    };

    const getBaseY = () => {
      return (datum: any, ctx: any) => {
        const rect = ctx.chart.getLayoutRect();

        return rect.y + rect.height + offset;
      };
    };

    // 根据布局确定图片和文字的位置
    let imageX: any;
    let textX: any;
    let textAlign: 'left' | 'center' | 'right';

    switch (layout) {
      case 'left':
        // 图片在左，文字在右（紧跟图片）
        imageX = getBaseX('left');
        textX = (datum: any, ctx: any) => imageX(datum, ctx) + imageWidth + gap;
        textAlign = 'left';
        break;
      case 'right':
        // 文字在左，图片在右（紧跟文字）
        textX = getBaseX('right');
        imageX = (datum: any, ctx: any) =>
          textX(datum, ctx) + this.getTextWidth(footnote.text || '') + gap;
        textAlign = 'right';
        break;
      case 'image-left-text-right':
        // 图片在左，文字在右（分散对齐）
        imageX = getBaseX('left');
        textX = getBaseX('right');
        textAlign = 'right';
        break;
      case 'image-right-text-left':
        // 文字在左，图片在右（分散对齐）
        textX = getBaseX('left');
        imageX = getBaseX('right');
        textAlign = 'left';
        break;
      case 'center':
        // 居中：图片在左，文字在右，整体居中
        const totalWidth =
          (footnote.image ? imageWidth + gap : 0) + this.getTextWidth(footnote.text || '');
        imageX = (datum: any, ctx: any) => {
          const region = ctx.chart.getAllRegions()[0];
          const centerX = region.getLayoutStartPoint().x + region.getLayoutRect().width / 2;
          return centerX - totalWidth / 2;
        };
        textX = (datum: any, ctx: any) =>
          imageX(datum, ctx) + (footnote.image ? imageWidth + gap : 0);
        textAlign = 'left';
        break;
      default:
        imageX = getBaseX('left');
        textX = (datum: any, ctx: any) => imageX(datum, ctx) + imageWidth + gap;
        textAlign = 'left';
    }

    // 添加图片标记
    if (footnote.image) {
      marks.push({
        type: 'image',
        zIndex: 300,
        style: {
          image: footnote.image,
          width: imageWidth,
          height: imageHeight,
          x: imageX,
          y: getBaseY(),
        },
      });
    }

    // 添加文字标记
    if (footnote.text) {
      marks.push({
        type: 'text',
        zIndex: 300,
        style: {
          text: footnote.text,
          fontSize,
          fill,
          x: textX,
          y: getBaseY(),
          textAlign,
          textBaseline: 'top',
        },
      });
    }

    return {
      marks,
      size: Math.max(imageHeight, fontSize) + offset, // 预留空间，避免与图表重叠
    };
  }

  /**
   * 估算文本宽度（用于布局计算）
   */
  private getTextWidth(text: string): number {
    // 粗略估算：每个字符约 6px，加上一些边距
    return text.length * 6 + 10;
  }

  /**
   * 处理背景配置
   */
  protected processBackground(
    background: BackgroundConfig | undefined
  ): Record<string, unknown> | string | undefined {
    if (!background) return this.getThemeConfig().backgroundColor;

    if (background.color) {
      return background.color;
    }

    const result: Record<string, unknown> = {};
    if (background.image) {
      result.image = background.image;
    } else if (background.linearGradient) {
      return this.processLinearGradient(background.linearGradient);
    }

    return Object.keys(result).length > 0 ? result : undefined;
  }

  /**
   * 处理图例配置
   */
  protected processLegend(
    legend: boolean | LegendConfig | undefined
  ): Record<string, unknown> | undefined {
    if (legend === undefined || legend === false) {
      return { visible: false };
    }

    if (legend === true) {
      return { visible: true };
    }

    const result: Record<string, unknown> = { visible: true };
    if (legend.position) {
      result.orient = legend.position;
    }
    return result;
  }

  /**
   * 处理线形渐变配置，转换为 VChart 渐变语法
   */
  protected processLinearGradient(
    gradient: LinearGradientConfig | undefined
  ): Record<string, unknown> | undefined {
    if (!gradient?.colors || gradient.colors.length === 0) {
      return undefined;
    }

    const direction = gradient.direction ?? 'left-right';
    const coords = { x0: 0, y0: 0, x1: 1, y1: 0 };

    if (direction === 'right-left') {
      coords.x0 = 1;
      coords.x1 = 0;
    } else if (direction === 'top-bottom') {
      coords.x1 = 0;
      coords.y1 = 1;
    } else if (direction === 'bottom-top') {
      coords.x1 = 0;
      coords.y0 = 1;
      coords.y1 = 0;
    }

    const stopCount = gradient.colors.length;

    return {
      gradient: 'linear',
      ...coords,
      stops: gradient.colors.map((color, index) => ({
        offset: stopCount === 1 ? 0 : index / (stopCount - 1),
        color,
      })),
    };
  }

  private _themeConfig: ThemeConfig = defaultThemeConfig;
  getThemeConfig(): ThemeConfig {
    return this._themeConfig;
  }

  /**
   * 处理主题配置
   * @param theme 主题配置
   * @param spec VChart spec 对象
   * @param forceBackground 是否强制应用背景色（用于暗色主题）
   */
  protected processTheme(theme: Theme | undefined, spec: Record<string, unknown>): void {
    this._themeConfig = defaultThemeConfig; // 重置主题配置

    if (!theme) return;

    const resolvedTheme = resolveTheme(theme);
    if (!resolvedTheme) return;

    // 应用 VChart 内置主题
    if (resolvedTheme.type && vchartThemeMap[resolvedTheme.type]) {
      spec.theme = vchartThemeMap[resolvedTheme.type];
    }

    if (resolvedTheme) {
      this._themeConfig = resolvedTheme;
    }
  }

  /**
   * 检查主题是否为暗色
   */
  protected isDarkTheme(theme: Theme | undefined): boolean {
    const resolved = resolveTheme(theme);
    return isDarkTheme(resolved);
  }
}
