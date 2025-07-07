import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {RadialTreeComponent} from '../radial-tree/radial-tree.component';
import {NgIf} from '@angular/common';
import {Visualization} from '../../model/visualization';
import {VisualizationTypeEnum} from '../../model/visualization-type.enum';
import {LinePlotComponent} from '../line-plot/line-plot.component';
import { MultilinePlotComponent } from '../multiline-plot/multiline-plot.component';

@Component({
  selector: 'app-visualization-wrapper',
  standalone: true,
  imports: [
    RadialTreeComponent,
    NgIf,
    LinePlotComponent,
    MultilinePlotComponent
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
  temps: boolean = false;
  onlyShowX: boolean = false;
  demoNum: boolean = false;
  drawLine: boolean = true;
  showDots: boolean = false;
  yLab: string = "";
  xLab: string = "";

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
      }
      if (this.vis.temps) {
        this.temps = this.vis.temps;
      }
      if (this.vis.only_show_x) {
        this.onlyShowX = this.vis.only_show_x;
      }
      if (this.vis.demo_num) {
        this.demoNum = this.vis.demo_num;
      }
      if (this.vis.draw_line !== undefined) {
        this.drawLine = this.vis.draw_line;
      }
      if (this.vis.show_dots !== undefined) {
        this.showDots = this.vis.show_dots;
      }
      if (this.vis.y_lab) {
        this.yLab = this.vis.y_lab;
      }
      if (this.vis.x_lab) {
        this.xLab = this.vis.x_lab;
      }
    }
  }


  protected readonly VisualizationTypeEnum = VisualizationTypeEnum;
}
