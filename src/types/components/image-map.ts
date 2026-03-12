/**
 * 图片映射配置（用于 treemap/circlePacking 的节点背景）
 */
export interface ImageMapConfig {
  /** 从 data 中读取的字段名 */
  field?: string;
  /** 分类值 -> image URL 映射表 */
  map?: Record<string, string>;
  /** 透明度 0-1 */
  opacity?: number;
}
