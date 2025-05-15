import { VisualizationTypeEnum } from './visualization-type.enum';

export interface Visualization {
  type: VisualizationTypeEnum;
  depth?: number;
  step?: number;
}
