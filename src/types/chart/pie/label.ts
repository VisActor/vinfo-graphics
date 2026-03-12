import { LabelConfig } from '../../components/label';

export type PieLabelConfig = LabelConfig & {
  /** 标签位置 */
  position?: 'inside' | 'outside' | 'spider';
};
