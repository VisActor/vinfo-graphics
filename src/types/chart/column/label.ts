import { LabelConfig } from '../../components/label';

export type ColumnLabelConfig = LabelConfig & {
  /** 标签位置 */
  position?: 'middle' | 'inside-top' | 'inside-bottom' | 'top' | 'bottom';
};
