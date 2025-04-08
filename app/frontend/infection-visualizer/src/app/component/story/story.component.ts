import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryService } from '../../service/story.service';

@Component({
  selector: 'app-story',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './story.component.html',
  styleUrl: './story.component.css'
})
export class StoryComponent implements OnInit {
  @Input() storyId: number = 0;

  currentSlide: number = 0;
  totalSlides: number = 0;
  title: string = '';
  slide: any = null;

  constructor(private storyService: StoryService) {}

  ngOnInit(): void {
    this.loadSlide(this.currentSlide);
  }

  loadSlide(index: number): void {
    this.storyService.getStorySlide(this.storyId, index).subscribe({
      next: (data) => {
        this.slide = data.slide;
        this.title = data.title;
        this.currentSlide = data.page;
        this.totalSlides = data.total_pages;
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
