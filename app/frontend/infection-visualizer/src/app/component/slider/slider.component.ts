import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-slider',
  standalone: true,
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements AfterViewInit {
  @Input() min = 0;
  @Input() max = 100;
  @Input() currentValue = 0;
  @Output() valueChange = new EventEmitter<number>();

  ngAfterViewInit(): void {
    this.createSlider();
  }

  createSlider() {
    const container = document.getElementById('slider');
    let width = container?.clientWidth || 150;
    width = width - 1;
    console.log(container?.clientWidth)

    const height = 30;

    const svg = d3.select('#slider')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const x = d3.scaleLinear()
      .domain([this.min, this.max])
      .range([10, width - 10])
      .clamp(true);

    const slider = svg.append('g')
      .attr('class', 'slider')
      .attr('transform', 'translate(0,15)');

    slider.append('line')
      .attr('class', 'track')
      .attr('x1', x.range()[0])
      .attr('x2', x.range()[1])
      .attr('stroke', '#ccc')
      .attr('stroke-width', 6);

    const handle = slider.append('circle')
      .attr('class', 'handle')
      .attr('r', 9)
      .attr('fill', 'steelblue')
      .attr('cx', x(this.currentValue));

    slider.call(d3.drag<SVGGElement, unknown>()
      .on('start drag', (event) => {
        const value = Math.round(x.invert(event.x));
        handle.attr('cx', x(value));
        this.valueChange.emit(value);
      }));
  }
}
