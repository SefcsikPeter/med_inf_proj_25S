import {Component, OnInit, ElementRef, ViewChild, Input, OnChanges, SimpleChanges} from '@angular/core';
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
  @Input() tempsMagn: boolean = false;
  @Input() showDots: boolean = false;
  @Input() blackLines: boolean = true;
  @Input() lineLabels: string[] = [];
  @Input() vertLine: number | null = null;
  @Input() xMaxFixed: number | null = null;
  @Input() yMaxFixed: number | null = null;

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

  temps3: [number, number][] = [
    [0, 120], [1, 110], [2, 110], [3, 100],
    [4, 100], [5, 90], [6, 90], [7, 100],
    [8, 120], [9, 140], [10, 160], [11, 180],
    [12, 200], [13, 210], [14, 220], [15, 220],
    [16, 210], [17, 200], [18, 180], [19, 170],
    [20, 150], [21, 140], [22, 130], [23, 120]
  ];


  tempsComb: [number, number][][] = [];

  ngOnInit(): void {
    d3.select(this.chartContainer.nativeElement).selectAll('*').remove();
    if (this.temps) {
      this.tempsComb.push(this.temps1);
      this.tempsComb.push(this.temps2);
      this.plotData = this.tempsComb;
    }

    if (this.tempsMagn) {
      this.tempsComb.push(this.temps1);
      this.tempsComb.push(this.temps3);
      this.plotData = this.tempsComb;
    }
    this.drawChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['plotData'] || changes['temps'] || changes['tempsMagn'] || changes['vert_line'] || changes['blackLines']) {
      this.redrawChart();
    }
  }

  private redrawChart(): void {
    d3.select(this.chartContainer.nativeElement).selectAll('*').remove();
    this.drawChart();
  }

  private drawChart(): void {
    if (!this.plotData) return;

    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const containerEl = this.chartContainer.nativeElement as HTMLElement;
    const fullWidth = containerEl.offsetWidth || 460;
    const fullHeight = containerEl.offsetHeight || fullWidth;

    const width = fullWidth - margin.left - margin.right;
    const height = fullHeight - margin.top - margin.bottom;

    const allPoints = this.plotData.flat();
    if (allPoints.length === 0) return;

    const svg = d3.select(this.chartContainer.nativeElement)
      .append("svg")
      .attr("viewBox", `0 0 ${fullWidth} ${fullHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .classed("responsive-svg", true)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const makePrettyFormatter = (threshold = 1000) => {
      const fSmall = d3.format("~g");
      const fBig   = d3.format(".2s");
      return (d: d3.NumberValue) => Math.abs(+d) >= threshold ? fBig(+d) : fSmall(+d);
    };

    const fmt = makePrettyFormatter(1000);

    const dataXMax = d3.max(allPoints, d => d[0])!;
    const desiredXMax = this.xMaxFixed ?? dataXMax;

    const finalXMax = Math.max(desiredXMax, dataXMax);

    const x = d3.scaleLinear()
      .domain([0, finalXMax])
      .nice()
      .range([0, width]);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d => fmt(d)));


    const dataYMax = d3.max(allPoints, d => d[1])!;
    const desiredYMax = this.yMaxFixed ?? dataYMax;

    const finalYMax = Math.max(desiredYMax, dataYMax);

    const y = d3.scaleLinear()
      .domain([0, finalYMax])
      .nice()
      .range([height, 0]);
          
    svg.append("g")
      .call(d3.axisLeft(y).tickFormat(d => fmt(d)));

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

    const dashStyles = ["", "5,5", "1,5", "10,5,2,5"];

    this.plotData.forEach((lineData, i) => {
      svg.append("path")
        .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", this.blackLines ? "black" : d3.schemeCategory10[i % 10])
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", dashStyles[i % dashStyles.length])
        .attr("d", d3.line<[number, number]>()
          .x(d => x(d[0]))
          .y(d => y(d[1]))
        );
    });

    if (this.vertLine !== null && this.vertLine !== undefined) {
      const idx = this.plotData.length;
      const stroke = this.blackLines ? "black" : d3.schemeCategory10[idx % 10];
      const dash = dashStyles[idx % dashStyles.length];

      const [xMin, xMax] = x.domain() as [number, number];
      const xValue = Math.max(Math.min(this.vertLine, xMax), xMin);
      const xPos = x(xValue);

      svg.append("line")
        .attr("x1", xPos)
        .attr("x2", xPos)
        .attr("y1", 0)
        .attr("y2", height)
        .attr("stroke", stroke)
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", dash);
    }

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

    if (this.lineLabels && this.lineLabels.length > 0) {
      const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - 50}, ${-margin.top + 10})`);

      this.lineLabels.forEach((label, i) => {
        const legendRow = legend.append("g")
          .attr("transform", `translate(0, ${i * 20})`);

        legendRow.append("line")
          .attr("x1", 0)
          .attr("x2", 20)
          .attr("y1", 5)
          .attr("y2", 5)
          .attr("stroke", this.blackLines ? "black" : d3.schemeCategory10[i % 10])
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", dashStyles[i % dashStyles.length]);

        legendRow.append("text")
          .attr("x", 25)
          .attr("y", 9)
          .attr("font-size", "12px")
          .attr("alignment-baseline", "middle")
          .text(label);
      });
    }
  }
}
