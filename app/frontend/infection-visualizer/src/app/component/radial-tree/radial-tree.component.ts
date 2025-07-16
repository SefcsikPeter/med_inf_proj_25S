import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  Input,
  SimpleChanges
} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-radial-tree',
  standalone: true,
  templateUrl: './radial-tree.component.html',
  styleUrls: ['./radial-tree.component.css']
})
export class RadialTreeComponent implements OnInit {
  @ViewChild('treeContainer', { static: true }) treeContainer!: ElementRef;
  @Input() stepSize: number = 50;
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
    this.createRadialTree();
  }

  createRadialTree(): void {
    const containerWidth = this.treeContainer.nativeElement.offsetWidth;
    const containerHeight = this.treeContainer.nativeElement.offsetHeight || containerWidth;

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

    const tree = d3.tree()
      .size([2 * Math.PI, 1])
      .separation((a: any, b: any) => (a.parent === b.parent ? 1 : 2) / a.depth);
    tree(root);

    root.descendants().forEach((d: any) => {
      d.y = d.depth * this.stepSize;
    });

    const visibleNodes = root.descendants().filter((d: any) => d.depth <= this.maxDepth);
    const visibleLinks = root.links().filter((l: any) => l.source.depth < this.maxDepth && l.target.depth <= this.maxDepth);

    const visibleMaxDepth = d3.max(visibleNodes, (d: any) => d.depth) || 1;
    const outerRadius = visibleMaxDepth * this.stepSize + 10;

    const scaleFactor = (Math.min(containerWidth, containerHeight) / 2 - 20) / outerRadius;

    const svg = d3.select(this.treeContainer.nativeElement)
      .append("svg")
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr("viewBox", [-containerWidth / 2, -containerHeight / 2, containerWidth, containerHeight].join(' '))
      .style("font", "10px sans-serif");

    const container = svg.append("g")
      .attr("transform", `scale(${scaleFactor})`);

    const nodeDepths = Array.from(new Set(visibleNodes.map((d: any) => d.depth)))
      .filter(d => d > 0)
      .sort((a, b) => a - b);

    container.append("g")
      .attr("stroke", "#ccc")
      .attr("stroke-dasharray", "2,2")
      .attr("fill", "none")
      .selectAll("circle")
      .data(nodeDepths)
      .join("circle")
      .attr("r", (d: number) => d * this.stepSize);

    container.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(visibleLinks)
      .join("path")
      .attr("d", d3.linkRadial()
        .angle((d: any) => d.x)
        .radius((d: any) => d.y) as any);

    container.append("g")
      .selectAll("text.node-emoji")
      .data(visibleNodes)
      .join("text")
      .attr("class", "node-emoji")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .style("font-size", "20px")
      .attr("transform", (d: any) => `
        translate(${Math.cos(d.x - Math.PI / 2) * d.y},
                  ${Math.sin(d.x - Math.PI / 2) * d.y})
      `)
      .text((d: any) => {
        if (d.depth === 0) return "🧍";
        switch (d.data.status) {
          case "sev": return "🛏️";
          case "crit": return "🏥";
          case "dead": return "🪦";
          default: return "👤";
        }
      });

    container.append("g")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "hanging")
      .selectAll("text.node-label")
      .data(visibleNodes)
      .join("text")
      .attr("class", "node-label")
      .attr("transform", (d: any) => {
        const x = Math.cos(d.x - Math.PI / 2) * d.y;
        const y = Math.sin(d.x - Math.PI / 2) * d.y;
        return `translate(${x}, ${y + 18})`;
      })
      .style("font-size", "10px")
      .text((d: any) => this.showNodeIds ? d.data.id : '');
  }
}
