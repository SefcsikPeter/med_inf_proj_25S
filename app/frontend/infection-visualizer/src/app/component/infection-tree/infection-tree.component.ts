import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  Input,
  SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-infection-tree',
  imports: [],
  standalone: true,
  templateUrl: './infection-tree.component.html',
  styleUrl: './infection-tree.component.css'
})
export class InfectionTreeComponent implements OnInit {
  @ViewChild('treeContainer', { static: true }) treeContainer!: ElementRef;
  @Input() stepSize: number = 20;
  @Input() infectionTreeData: any;
  @Input() maxDepth: number = Infinity;
  @Input() showNodeIds: boolean = false;
  private resizeObserver!: ResizeObserver;

  constructor() {}

  ngOnInit(): void {
    this.observeResize();
    this.fetchTree();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['infectionTreeData'] && !changes['infectionTreeData'].firstChange) ||
      (changes['stepSize'] && !changes['stepSize'].firstChange) ||
      (changes['maxDepth'] && !changes['maxDepth'].firstChange)) {
      this.fetchTree();
    }
  }

  observeResize(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.fetchTree();
    });
    this.resizeObserver.observe(this.treeContainer.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  fetchTree(): void {
      d3.select(this.treeContainer.nativeElement).selectAll('*').remove();
      this.createTree();
    }



  createTree(): void {
    const containerWidth = this.treeContainer.nativeElement.offsetWidth;
    const containerHeight = Math.min(containerWidth, 700);

    const { nodes, links } = this.infectionTreeData;
    const nodeById = new Map(nodes.map((d: any) => [d.id, { ...d, children: [] }]));

    links.forEach(({ source, target }: any) => {
      let src: any;
      src = nodeById.get(source.id || source);
      const tgt = nodeById.get(target.id || target);
      if (src && tgt) src.children.push(tgt);
    });

    const targetIds = new Set(links.map((d: any) => d.target.id || d.target));
    const rootNode = nodes.find((d: any) => !targetIds.has(d.id));
    const root = d3.hierarchy(nodeById.get(rootNode.id));

    const treeLayout = d3.tree().nodeSize([this.stepSize, this.stepSize * 2]);
    treeLayout(root);

    const visibleNodes = root.descendants().filter((d: any) => d.depth <= this.maxDepth);
    const visibleLinks = root.links().filter((l: any) => l.source.depth < this.maxDepth && l.target.depth <= this.maxDepth);

    // 🔹 Compute extents
    const xExtent = d3.extent(visibleNodes, (d: any) => d.x) as [number, number];
    const yExtent = d3.extent(visibleNodes, (d: any) => d.y) as [number, number];
    const width = xExtent[1] - xExtent[0];
    const height = yExtent[1] - yExtent[0];

    // 🔹 Compute scale to fit
    const scale = Math.min(containerWidth / (width + 40), containerHeight / (height + 40));

    const svg = d3.select(this.treeContainer.nativeElement)
      .append("svg")
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("font", "10px sans-serif");

    const g = svg.append("g")
      .attr("transform", `translate(${containerWidth/2}, ${containerHeight/2}) scale(${scale}) translate(${- (xExtent[0] + xExtent[1]) / 2}, ${- (yExtent[0] + yExtent[1]) / 2})`);

    // 🔹 Draw links
    g.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(visibleLinks)
      .join("path")
      .attr("d", d3.linkVertical()
        .x((d: any) => d.x)
        .y((d: any) => d.y) as any);

    // 🔹 Draw nodes
    g.append("g")
      .selectAll("text.node-emoji")
      .data(visibleNodes)
      .join("text")
      .attr("class", "node-emoji")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .style("font-size", "20px")
      .attr("transform", (d: any) => `translate(${d.x},${d.y})`)
      .text((d: any) => {
        if (d.depth === 0) return "🧍";
        switch (d.data.status) {
          case "sev": return "🛏️";
          case "crit": return "🏥";
          case "dead": return "🪦";
          default: return "👤";
        }
      });

    if (this.showNodeIds) {
      g.append("g")
        .selectAll("text")
        .data(visibleNodes)
        .join("text")
        .attr("transform", (d: any) => `translate(${d.x},${d.y + 16})`)
        .attr("text-anchor", "middle")
        .attr("stroke", "white")
        .attr("paint-order", "stroke")
        .attr("fill", "currentColor")
        .text((d: any) => d.data.id);
    }
  }



}
