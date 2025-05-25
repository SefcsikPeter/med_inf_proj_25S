import {Component, OnInit, ElementRef, ViewChild, Input, AfterViewInit} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-line-plot',
  standalone: true,
  imports: [],
  templateUrl: './line-plot.component.html',
  styleUrls: ['./line-plot.component.css']
})
export class LinePlotComponent implements OnInit {
  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;
  @Input() plotData: { x: number, y: number }[] = [];
  @Input() onlyShowX: boolean = false;
  @Input() onlyShowY: boolean = false;
  @Input() showDots: boolean = false;
  @Input() drawLine: boolean = false;
  @Input() xLabel: string = "days";
  @Input() yLabel: string = "people";
  @Input() temps: boolean = false;
  @Input() demoNum: boolean = false;
  dailyTemp: { x: number, y: number }[] = [
  { x: 0, y: 12 }, { x: 1, y: 11 }, { x: 2, y: 11 }, { x: 3, y: 10 },
  { x: 4, y: 10 }, { x: 5, y: 9 }, { x: 6, y: 9 }, { x: 7, y: 10 },
  { x: 8, y: 12 }, { x: 9, y: 14 }, { x: 10, y: 16 }, { x: 11, y: 18 },
  { x: 12, y: 20 }, { x: 13, y: 21 }, { x: 14, y: 22 }, { x: 15, y: 22 },
  { x: 16, y: 21 }, { x: 17, y: 20 }, { x: 18, y: 18 }, { x: 19, y: 17 },
  { x: 20, y: 15 }, { x: 21, y: 14 }, { x: 22, y: 13 }, { x: 23, y: 12 }
];
  nums: { x: number, y: number }[] = [
  { x: 0, y: 12 }, { x: 5, y: 12 }, { x: 12, y: 12 }, { x: 23, y: 12 }
];


  ngOnInit(): void {
    if (this.temps) {
      this.plotData = this.dailyTemp;
    }
    if (this.demoNum) {
      this.plotData = this.nums;
    }
    if (this.plotData.length > 0) {
      if (Array.isArray(this.plotData[0])) {
        this.plotData = (this.plotData as any[]).map(([x, y]) => ({ x, y }));
      }

      this.drawChart();
    }
  }



  private drawChart(): void {
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const containerEl = this.chartContainer.nativeElement as HTMLElement;
    const fullWidth = containerEl.offsetWidth || 460;
    const fullHeight = containerEl.offsetHeight || fullWidth;

    const width = fullWidth - margin.left - margin.right;
    const height = fullHeight - margin.top - margin.bottom;

    const xMax = d3.max(this.plotData, d => d.x)!;

    const svg = d3.select(this.chartContainer.nativeElement)
      .append("svg")
      .attr("viewBox", `0 0 ${fullWidth} ${fullHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .classed("responsive-svg", true)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain(d3.extent(this.plotData, d => d.x) as [number, number])
      .range([0, width]);

    if (!this.onlyShowY) {
      svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));
    }

    const y = d3.scaleLinear()
      .domain([0, d3.max(this.plotData, d => d.y)!])
      .range([height, 0]);

    if (!this.onlyShowX) {
      svg.append("g")
        .call(d3.axisLeft(y));
    }

    const bisect = d3.bisector((d: any) => d.x).left;

    const focus = svg
      .append("g")
      .append("circle")
      .style("fill", "none")
      .attr("stroke", "black")
      .attr("r", 8.5)
      .style("opacity", 0);

    const focusText = svg
      .append("g")
      .append("text")
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle");

    const focusLineX = svg.append("line")
      .attr("stroke", "gray")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4")
      .style("opacity", 0);

    const focusLineY = svg.append("line")
      .attr("stroke", "gray")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4")
      .style("opacity", 0);

    if (!this.onlyShowX && !this.onlyShowY && this.drawLine) {
      svg.append("path")
      .datum(this.plotData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line<{ x: number, y: number }>()
        .x((d) => x(d.x))
        .y((d) => y(d.y))
      );
    }

    svg.append("rect")
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", () => {
        focus.style("opacity", 1);
        focusText.style("opacity", 1);
      })
      .on("mousemove", (event: MouseEvent) => {
        const [mouseX] = d3.pointer(event);
        const x0 = x.invert(mouseX);
        let i = bisect(this.plotData, x0, 1);

        if (i >= this.plotData.length) i = this.plotData.length - 1;
        if (i < 1) i = 1;

        const d0 = this.plotData[i - 1];
        const d1 = this.plotData[i];
        const selectedData = x0 - d0.x < d1.x - x0 ? d0 : d1;
        const pointX = x(selectedData.x);
        const pointY = y(selectedData.y);

        if (selectedData) {
          focus
            .attr("cx", x(selectedData.x))
            .attr("cy", y(selectedData.y));

          let textOffset = 15
          if (selectedData.x > xMax/2) {
            //TODO: change so that it is dynamic
            textOffset = -150;
          }

          focusText
            .text(`${this.xLabel}: ${selectedData.x} - ${this.yLabel}: ${selectedData.y}`)
            .attr("x", x(selectedData.x) + textOffset)
            .attr("y", y(selectedData.y))
            .attr("text-anchor", "start")
          ;

          focusLineX
            .attr("x1", 0)
            .attr("x2", pointX)
            .attr("y1", pointY)
            .attr("y2", pointY)
            .style("opacity", 1);

          focusLineY
            .attr("x1", pointX)
            .attr("x2", pointX)
            .attr("y1", pointY)
            .attr("y2", height)
            .style("opacity", 1);
        }
      })
      .on("mouseout", () => {
        focus.style("opacity", 0);
        focusText.style("opacity", 0);
        focusLineX.style("opacity", 0);
        focusLineY.style("opacity", 0);
      });

    if (!this.onlyShowY) {
      svg.append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .text(this.xLabel)
      .style("font-size", "12px");
    }

    if (!this.onlyShowX) {
      svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `rotate(-90)`)
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .text(this.yLabel)
      .style("font-size", "12px");
    }

    if (this.showDots) {
      svg.selectAll(".data-point")
        .data(this.plotData)
        .enter()
        .append("circle")
        .attr("class", "data-point")
        .attr("cx", d => this.onlyShowY ? x(0) : x(d.x))
        .attr("cy", d => this.onlyShowX ? y(0) : y(d.y))
        .attr("r", 5)
        .style("fill", "green");
    }
  }
}
