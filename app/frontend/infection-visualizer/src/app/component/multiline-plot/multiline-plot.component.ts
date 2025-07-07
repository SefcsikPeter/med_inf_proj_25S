import {Component, OnInit, ElementRef, ViewChild, Input, AfterViewInit} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-multiline-plot',
  standalone: true,
  imports: [],
  templateUrl: './multiline-plot.component.html',
  styleUrls: ['./multiline-plot.component.css']
})
export class MultilinePlotComponent implements OnInit {
  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;
  @Input() plotData: [number, number][][] = [];
  @Input() xLabel: string = "days";
  @Input() yLabel: string = "people";

  ngOnInit(): void {
    this.drawChart()
  }



  private drawChart(): void {
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const containerEl = this.chartContainer.nativeElement as HTMLElement;
    const fullWidth = containerEl.offsetWidth || 460;
    const fullHeight = containerEl.offsetHeight || fullWidth;

    const width = fullWidth - margin.left - margin.right;
    const height = fullHeight - margin.top - margin.bottom;

    const allPoints = this.plotData.flat();

    const svg = d3.select(this.chartContainer.nativeElement)
      .append("svg")
      .attr("viewBox", `0 0 ${fullWidth} ${fullHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .classed("responsive-svg", true)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
    .domain(d3.extent(allPoints, d => d[0]) as [number, number])
    .range([0, width]);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    const y = d3.scaleLinear()
      .domain([0, d3.max(allPoints, d => d[1])!])
      .range([height, 0]);

    svg.append("g")
      .call(d3.axisLeft(y));

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .text(this.xLabel)
      .style("font-size", "12px");

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `rotate(-90)`)
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .text(this.yLabel)
      .style("font-size", "12px");

    this.plotData.forEach((lineData, i) => {
      svg.append("path")
        .datum(lineData)  // ✅ lineData is [ [x, y], [x, y], ... ]
        .attr("fill", "none")
        .attr("stroke", d3.schemeCategory10[i % 10])
        .attr("stroke-width", 1.5)
        .attr("d", d3.line<[number, number]>()
          .x(d => x(d[0]))
          .y(d => y(d[1]))
        );
    });
  }
}
