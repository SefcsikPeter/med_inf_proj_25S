import {Component, OnInit, ElementRef, ViewChild, Input, AfterViewInit, OnChanges, SimpleChanges} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-multiline-plot',
  standalone: true,
  imports: [],
  templateUrl: './multiline-plot.component.html',
  styleUrls: ['./multiline-plot.component.css']
})
export class MultilinePlotComponent implements OnInit, OnChanges {
  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;
  @Input() plotData: [number, number][][] = [];
  @Input() xLabel: string = "days";
  @Input() yLabel: string = "people";
  @Input() temps: boolean = false;
  @Input() showDots: boolean = false;

  temps1: [number, number][] = [
    [0, 12], [1, 11], [2, 11], [3, 10],
    [4, 10], [5, 9], [6, 9], [7, 10],
    [8, 12], [9, 14], [10, 16], [11, 18],
    [12, 20], [13, 21], [14, 22], [15, 22],
    [16, 21], [17, 20], [18, 18], [19, 17],
    [20, 15], [21, 14], [22, 13], [23, 12]
  ];

  temps2: [number, number][] = [
    [0, 11], [1, 11], [2, 10], [3, 10],
    [4, 9], [5, 9], [6, 8], [7, 10],
    [8, 13], [9, 15], [10, 17], [11, 19],
    [12, 21], [13, 21], [14, 23], [15, 22],
    [16, 20], [17, 19], [18, 17], [19, 16],
    [20, 14], [21, 13], [22, 12], [23, 11]
  ];

  tempsComb: [number, number][][] = [];

  ngOnInit(): void {
    d3.select(this.chartContainer.nativeElement).selectAll('*').remove();
    if (this.temps) {
      this.tempsComb.push(this.temps1)
      this.tempsComb.push(this.temps2)
      this.plotData = this.tempsComb
    }
    this.drawChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['plotData'] || changes['temps']) {
      this.redrawChart();
    }
  }

  private redrawChart(): void {
    d3.select(this.chartContainer.nativeElement).selectAll('*').remove();
    this.drawChart();
  }


  private drawChart(): void {
    if (this.plotData === undefined) {
      return;
    }
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

    const dashStyles = [
      "",
      "5,5",
      "1,5",
      "10,5,2,5"
    ];

    this.plotData.forEach((lineData, i) => {
      svg.append("path")
      .datum(lineData)
      .attr("fill", "none")
      .attr("stroke", d3.schemeCategory10[i % 10])
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", dashStyles[i % dashStyles.length])
      .attr("d", d3.line<[number, number]>()
        .x(d => x(d[0]))
        .y(d => y(d[1]))
      );
    });

    if (this.showDots) {
      this.plotData.forEach((lineData, i) => {
        svg.selectAll(`.data-point-${i}`)
          .data(lineData)
          .enter()
          .append("circle")
          .attr("class", `data-point data-point-${i}`)
          .attr("cx", d => x(d[0]))
          .attr("cy", d => y(d[1]))
          .attr("r", 5)
          .style("fill", d3.schemeCategory10[i % 10]);
      });
    }
  }
}
