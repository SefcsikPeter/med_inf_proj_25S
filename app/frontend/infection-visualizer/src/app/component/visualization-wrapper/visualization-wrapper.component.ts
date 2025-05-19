import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RadialTreeComponent} from '../radial-tree/radial-tree.component';
import {NgIf} from '@angular/common';
import {VisData} from '../../model/vis-data';
import {Visualization} from '../../model/visualization';
import {VisualizationTypeEnum} from '../../model/visualization-type.enum';
import {LinePlotComponent} from '../line-plot/line-plot.component';

@Component({
  selector: 'app-visualization-wrapper',
  standalone: true,
  imports: [
    RadialTreeComponent,
    NgIf,
    LinePlotComponent
  ],
  templateUrl: './visualization-wrapper.component.html',
  styleUrl: './visualization-wrapper.component.css'
})
export class VisualizationWrapperComponent implements OnInit {
  //contains visualization parameters
  @Input() vis: Visualization = {type: VisualizationTypeEnum.rad_tree};
  //contains the actual data to be visualized, not the parameters for fetching it
  @Input() data: any;
  @Input() showVis: boolean = false;

  @Output() fetchData = new EventEmitter<void>();

  radDepth = 3;
  radStep = 50;

  ngOnInit() {
    console.log('vis in wrapper', this.vis)
    if (this.vis) {
      if (this.vis.depth) {
        this.radDepth = this.vis.depth;
      }
      if (this.vis.step) {
        this.radStep = this.vis.step;
        console.log('visdata', this.vis)
      }
    }
  }

  fetchClick() {
    this.fetchData.emit()
  }


  protected readonly VisualizationTypeEnum = VisualizationTypeEnum;
}
