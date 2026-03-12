import { LabelConfig } from '../../components/label';

export type TreemapLabelConfig = LabelConfig & {
  /** 是否显示百分比（仅单层模式有效） */
  showPercent?: boolean;
};
