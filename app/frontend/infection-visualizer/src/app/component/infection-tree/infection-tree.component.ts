import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { InfectionTreeService } from '../../service/infection-tree.service';

@Component({
  selector: 'app-infection-tree',
  imports: [],
  standalone: true,
  templateUrl: './infection-tree.component.html',
  styleUrl: './infection-tree.component.css'
})
export class InfectionTreeComponent implements AfterViewInit, OnInit {
  @ViewChild('treeContainer', { static: true }) treeContainer!: ElementRef;

  infectionTreeData: any;

  constructor(private treeService: InfectionTreeService) {}

  ngAfterViewInit() {
    this.createTree();
  }

  ngOnInit(): void {
    this.treeService.getInfectionTree(300).subscribe({
      next: (data) => {
        this.infectionTreeData = data;
        console.log('Tree data:', data);
      },
      error: (err) => {
        console.error('Error fetching infection tree:', err);
      }
    });
  }

  createTree() {
    const svg = d3.select(this.treeContainer.nativeElement)
      .append('svg')
      .attr('viewBox', [0, 0, 800, 600])
      .style('font', '10px sans-serif');

    const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

    const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");
  }

}
