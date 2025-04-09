import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryService } from '../../service/story.service';
import {MatProgressBar} from '@angular/material/progress-bar';
import {RadialTreeComponent} from '../radial-tree/radial-tree.component';
import {SliderComponent} from '../slider/slider.component';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {InfectionTreeService} from '../../service/infection-tree.service';

@Component({
  selector: 'app-story',
  standalone: true,
  imports: [CommonModule, MatProgressBar, RadialTreeComponent, SliderComponent],
  templateUrl: './story.component.html',
  styleUrl: './story.component.css'
})
export class StoryComponent implements OnInit {
  @Input() storyId: number = 0;

  currentSlide: number = 0;
  totalSlides: number = 0;
  title: string = '';
  slide: any = null;
  imagePath: string = '';
  popSize: number = 200;
  infectionTreeData: any;
  maxDepth = 3;

  constructor(private storyService: StoryService,
              private treeService: InfectionTreeService) {}

  private sliderInput$ = new Subject<number>();
  private subscription = this.sliderInput$.pipe(
    debounceTime(200)
  ).subscribe(value => {
    this.maxDepth = value;
    console.log(this.infectionTreeData)
  });

  onSliderChange(value: number) {
    this.sliderInput$.next(value);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loadSlide(this.currentSlide);
    this.fetchTree();
  }

  fetchTree(): void {
    this.treeService.getDummyTree(5).subscribe({
      next: (data) => {
        this.infectionTreeData = data;
      },
      error: (err) => {
        console.error('Error fetching infection tree:', err);
      }
    });
  }

  loadSlide(index: number): void {
    this.storyService.getStorySlide(this.storyId, index).subscribe({
      next: (data) => {
        console.log(data)
        this.slide = data.slide;
        this.title = data.title;
        this.currentSlide = data.page;
        this.totalSlides = data.total_pages;
        this.imagePath = 'http://localhost:8000/static/images/' + data.image;
        console.log(this.imagePath)
      },
      error: (err) => {
        console.error('Failed to load story slide:', err);
      }
    });
  }

  nextSlide(): void {
    if (this.currentSlide < this.totalSlides - 1) {
      this.loadSlide(this.currentSlide + 1);
    }
  }

  prevSlide(): void {
    if (this.currentSlide > 0) {
      this.loadSlide(this.currentSlide - 1);
    }
  }
}
