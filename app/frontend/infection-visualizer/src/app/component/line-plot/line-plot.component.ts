import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
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

  ngOnInit(): void {
    if (this.plotData.length > 0) {
      if (Array.isArray(this.plotData[0])) {
        this.plotData = (this.plotData as any[]).map(([x, y]) => ({ x, y }));
      }

      this.drawChart();
    }
  }



  private drawChart(): void {
    const xLabel = 'days';
    const yLabel = 'people';
    const margin = { top: 10, right: 30, bottom: 30, left: 60 };
    const width = 460 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const xMax = d3.max(this.plotData, d => d.x)!;

    const svg = d3.select(this.chartContainer.nativeElement)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain(d3.extent(this.plotData, d => d.x) as [number, number])
      .range([0, width]);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    const y = d3.scaleLinear()
      .domain([0, d3.max(this.plotData, d => d.y)!])
      .range([height, 0]);

    svg.append("g")
      .call(d3.axisLeft(y));

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

    console.log('pldata', this.plotData)
    svg.append("path")
      .datum(this.plotData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line<{ x: number, y: number }>()
        .x((d) => x(d.x))
        .y((d) => y(d.y))
      );

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
            .text(`${xLabel}: ${selectedData.x} - ${yLabel}: ${selectedData.y}`)
            .attr("x", x(selectedData.x) + textOffset)
            .attr("y", y(selectedData.y))
            .attr("text-anchor", "start")
          ;
        }
      })
      .on("mouseout", () => {
        focus.style("opacity", 0);
        focusText.style("opacity", 0);
      });
  }
}
