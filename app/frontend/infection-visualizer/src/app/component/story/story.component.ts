import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryService } from '../../service/story.service';
import {MatProgressBar} from '@angular/material/progress-bar';
import {RadialTreeComponent} from '../radial-tree/radial-tree.component';
import {SliderComponent} from '../slider/slider.component';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {InfectionTreeService} from '../../service/infection-tree.service';
import {LinePlotComponent} from '../line-plot/line-plot.component';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-story',
  standalone: true,
  imports: [CommonModule, MatProgressBar, RadialTreeComponent, SliderComponent, LinePlotComponent],
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
  maxDepth = 0;
  dataType: number = NaN;

  constructor(private storyService: StoryService,
              private treeService: InfectionTreeService,
              private route: ActivatedRoute,
              private router: Router) {}

  private sliderInput$ = new Subject<number>();
  private subscription = this.sliderInput$.pipe(
    debounceTime(50)
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
    this.route.paramMap.subscribe(params => {
      this.storyId = Number(params.get('story_id')) || 0;
    });

    this.route.queryParamMap.subscribe(params => {
      this.currentSlide = Number(params.get('page')) || 0;
    });
    this.loadData();
    this.loadSlide(this.currentSlide);
  }

  loadData(): void {
    this.storyService.getStoryData(this.storyId).subscribe({
      next: (data) => {
        this.title = data.title;
        this.totalSlides = data.total_pages;
        this.dataType = data.data[0].type;

        if (this.dataType === 0) {
          this.fetchDummyTree();
        }
        console.log('loaded data', data);
      },
      error: (err) => {
        console.log('Error fetching story data', err);
      }
    })
  }
  fetchDummyTree(): void {
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
        this.currentSlide = data.page;
        this.imagePath = 'http://localhost:8000/static/images/';
        if (data.image != null) {
          this.imagePath = this.imagePath + data.image;
        }

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { page: this.currentSlide },
          queryParamsHandling: 'merge', // keeps other query params if any
          replaceUrl: true // optional: prevents adding a new browser history entry
        });
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
