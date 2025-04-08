import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryService } from '../../service/story.service';
import {MatProgressBar} from '@angular/material/progress-bar';
import {RadialTreeComponent} from '../radial-tree/radial-tree.component';
import {SliderComponent} from '../slider/slider.component';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

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
  popSize: number = 12;

  constructor(private storyService: StoryService) {}

  private sliderInput$ = new Subject<number>(); // 🔁 reactive value stream
  private subscription = this.sliderInput$.pipe(
    debounceTime(200)
  ).subscribe(value => {
    this.popSize = value;
    console.log('Debounced value:', value);
  });

  onSliderChange(value: number) {
    this.sliderInput$.next(value); // 👈 send value into Subject
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // 💡 always clean up
  }

  ngOnInit(): void {
    this.loadSlide(this.currentSlide);
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
