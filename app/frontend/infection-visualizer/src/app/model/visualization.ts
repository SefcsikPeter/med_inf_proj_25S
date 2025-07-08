import { VisualizationTypeEnum } from './visualization-type.enum';

export interface Visualization {
  type: VisualizationTypeEnum;
  depth?: number;
  step?: number;
  temps?: boolean;
  only_show_x?: boolean;
  demo_num?: boolean;
  draw_line?: boolean;
  show_dots?: boolean;
  y_lab?: string;
  x_lab?: string;
  show_id?: boolean;
}
