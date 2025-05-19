import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {RadialTreeComponent} from '../radial-tree/radial-tree.component';
import {NgIf} from '@angular/common';
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
export class VisualizationWrapperComponent implements OnInit, OnChanges {
  @Input() vis: Visualization = {type: VisualizationTypeEnum.rad_tree};
  @Input() data: any;
  @Input() showVis: boolean = false;

  @Output() fetchData = new EventEmitter<void>();

  depth = 3;
  step = 50;

  ngOnInit() {
    this.updateData();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateData()
  }

  fetchClick() {
    this.fetchData.emit()
  }

  updateData() {
    if (this.vis) {
      if (this.vis.depth) {
        this.depth = this.vis.depth;
      } else if (this.vis.depth === 0) {
        this.depth = this.vis.depth;
      }
      if (this.vis.step) {
        this.step = this.vis.step;
        console.log('visdata', this.vis)
      }
    }
  }


  protected readonly VisualizationTypeEnum = VisualizationTypeEnum;
}
