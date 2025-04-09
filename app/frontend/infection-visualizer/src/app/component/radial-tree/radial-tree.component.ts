import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  Input,
  SimpleChanges
} from '@angular/core';
import * as d3 from 'd3';
import { InfectionTreeService } from '../../service/infection-tree.service';

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

  constructor(private treeService: InfectionTreeService) {}

  ngOnInit(): void {
    this.fetchTree();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['infectionTreeData'] && !changes['infectionTreeData'].firstChange) ||
      (changes['stepSize'] && !changes['stepSize'].firstChange)) {
      this.fetchTree();
    }
  }


  fetchTree(): void {
    d3.select(this.treeContainer.nativeElement).selectAll('*').remove();
    this.createRadialTree();
  }

  createRadialTree(): void {
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

    const stepSize = this.stepSize;
    root.descendants().forEach((d: any) => d.y = d.depth * stepSize);

    const maxDepth = d3.max(root.descendants(), (d: any) => d.depth) || 1;
    const outerRadius = maxDepth * stepSize + 10;
    const diameter = outerRadius * 2;

    const svg = d3.select(this.treeContainer.nativeElement)
      .append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
      .attr("viewBox", [-outerRadius, -outerRadius, diameter, diameter])
      .style("font", "10px sans-serif");

    svg.append("g")
      .attr("stroke", "#ccc")
      .attr("stroke-dasharray", "2,2")
      .attr("fill", "none")
      .selectAll("circle")
      .data(d3.range(1, maxDepth + 1))
      .join("circle")
      .attr("r", (d: number) => d * stepSize);

    svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(root.links())
      .join("path")
      .attr("d", d3.linkRadial()
        .angle((d: any) => d.x)
        .radius((d: any) => d.y) as any);

    svg.append("g")
      .selectAll("text.node-emoji")
      .data(root.descendants())
      .join("text")
      .attr("class", "node-emoji")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("transform", (d: any) => `
      rotate(${d.x * 180 / Math.PI - 90})
      translate(${d.y},0)
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

    svg.append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .selectAll("text")
      .data(root.descendants())
      .join("text")
      .attr("transform", (d: any) => `
        rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0)
        rotate(${d.x >= Math.PI ? 180 : 0})
      `)
      .attr("dy", "0.31em")
      .attr("x", (d: any) => d.x < Math.PI === !d.children ? 6 : -6)
      .attr("text-anchor", (d: any) => d.x < Math.PI === !d.children ? "start" : "end")
      .attr("paint-order", "stroke")
      .attr("stroke", "white")
      .attr("fill", "currentColor")
      .text((d: any) => d.data.id);
  }
}
