import { LabelConfig } from '../../components/label';

export type BarLabelConfig = LabelConfig & {
  /** 标签位置 */
  position?:
    | 'inside'
    | 'inside-left'
    | 'inside-right'
    | 'inside-top'
    | 'inside-bottom'
    | 'outside'
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'right'
    | 'left'
    | 'top'
    | 'bottom';
};
