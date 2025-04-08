import { Component, AfterViewInit, ElementRef, ViewChild, OnInit, Input, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { InfectionTreeService } from '../../service/infection-tree.service';

@Component({
  selector: 'app-infection-tree',
  imports: [],
  standalone: true,
  templateUrl: './infection-tree.component.html',
  styleUrl: './infection-tree.component.css'
})
export class InfectionTreeComponent implements OnInit {
  @ViewChild('treeContainer', { static: true }) treeContainer!: ElementRef;
  @Input() popSize: number = 25;

  infectionTreeData: any;

  constructor(private treeService: InfectionTreeService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['popSize'] && !changes['popSize'].firstChange) {
      this.fetchTree(); // Re-fetch if slider changes
    } else {
      this.fetchTree();
    }
  }


  fetchTree(): void {
    d3.select(this.treeContainer.nativeElement).selectAll('*').remove(); // clear old SVG
    this.treeService.getInfectionTree(this.popSize).subscribe({
      next: (data) => {
        this.infectionTreeData = data;
        console.log(this.infectionTreeData)
        this.createTree();
      },
      error: (err) => {
        console.error('Error fetching infection tree:', err);
      }
    });
  }

  ngOnInit(): void {
    /*
    this.treeService.getInfectionTree(this.popSize).subscribe({
      next: (data) => {
        this.infectionTreeData = data;
        this.createTree();
        console.log('Tree data:', data);
      },
      error: (err) => {
        console.error('Error fetching infection tree:', err);
      }
    });
     */
  }

  createTree() {
    d3.select(this.treeContainer.nativeElement).selectAll('*').remove();
    const nodes = this.infectionTreeData.nodes;
    const links = this.infectionTreeData.links;
    const nodeById = new Map(nodes.map((d: { id: any; }) => [d.id, { ...d, children: [] }]));
    const add_labels = false;

    links.forEach((link: any) => {
      let sourceNode: any;
      sourceNode = nodeById.get(link.source);
      const targetNode = nodeById.get(link.target);
      if (sourceNode && targetNode) {
        sourceNode.children.push(targetNode)
      }
    });

    const targetIds = new Set(links.map((d: { target: { id: any; }; }) => d.target.id || d.target));
    const rootNode = nodes.find((d: { id: unknown; }) => !targetIds.has(d.id));
    let root: any;
    root = d3.hierarchy(nodeById.get(rootNode.id));

    const dx = 10;
    const width = 1000;
    let margin: any;
    margin = { top: 10, right: 120, bottom: 10, left: 40 };
    const dy = width / (1 + root.height);
    const tree = d3.tree().nodeSize([dx, dy]);
    const diagonal = d3.linkHorizontal().x((d: any) => d.y).y((d: any) => d.x);

    const svg = d3.select(this.treeContainer.nativeElement)
      .append('svg')
      .attr("viewBox", [-margin.left, -margin.top, width, dx])
      .style("font", "10px sans-serif")
      .style("user-select", "none");

    const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

    const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

    root.x0 = 0;
    root.y0 = 0;

    root.descendants().forEach((d: { id: any; _children: any; children: any; }, i: any) => {
      d.id = i;
      d._children = d.children;
    });

    const update = (source: any) => {
      const duration = 250;
      const nodes = root.descendants().reverse();
      const links = root.links();

      tree(root);

      let left = root;
      let right = root;
      root.eachBefore((node: any) => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
      });

      const height = right.x - left.x + margin.top + margin.bottom;
      svg.transition().duration(duration)
        .attr("viewBox", `${-margin.left} ${left.x - margin.top} ${width} ${height}`);

      const node = gNode.selectAll<SVGGElement, any>("g")
        .data(nodes, (d: any) => d.id);

      const nodeEnter = node.enter().append("g")
        .attr("transform", (d: any) => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (event: any, d: any) => {
          d.children = d.children ? null : d._children;
          update(d);
        });

      nodeEnter.append("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .text((d: any) => {
          if (d === root) return "🧍";
          switch (d.data.status) {
            case "sev": return "🛏️";
            case "crit": return "🏥";
            case "dead": return "🪦";
            default: return "👤";
          }
        });

      node.merge(nodeEnter).transition().duration(duration) //maybe change
        .attr("transform", (d: any) => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

      node.exit().transition().duration(duration).remove()
        .attr("transform", (d: any) => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

      const link = gLink.selectAll<SVGPathElement, any>("path")
        .data(links, (d: any) => d.target.id);

      const linkEnter = link.enter().append("path")
        .attr("d", (d: any) => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o } as any);
        });

      link.merge(linkEnter).transition().duration(duration)
        .attr("d", diagonal as any);

      link.exit().transition().duration(duration).remove()
        .attr("d", (d: any) => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o } as any);
        });


      root.eachBefore((d: any) => {
          d.x0 = d.x;
          d.y0 = d.y;
        });
    }

    update(root);
  }

}
