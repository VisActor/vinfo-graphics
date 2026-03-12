import { LabelConfig } from '../../components/label';

export type CirclePackingLabelConfig = LabelConfig & {
  /** 是否显示百分比（仅单层模式有效） */
  showPercent?: boolean;
};
