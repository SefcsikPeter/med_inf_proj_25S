import {Component, OnDestroy, OnInit} from '@angular/core';
import { InfectionTreeComponent } from '../infection-tree/infection-tree.component';
import { SliderComponent } from '../slider/slider.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {StoryCardComponent} from '../story-card/story-card.component';
import {CommonModule} from '@angular/common';
import {StoryService} from '../../service/story.service';
import {LessonGraphComponent} from '../lesson-graph/lesson-graph.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SliderComponent, InfectionTreeComponent, StoryCardComponent, CommonModule, LessonGraphComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnDestroy, OnInit {
  constructor(private storyService: StoryService) {
  }
  popSize: number = 25;

  stories: any;

  private sliderInput$ = new Subject<number>();
  private subscription = this.sliderInput$.pipe(
    debounceTime(200)
  ).subscribe(value => {
    this.popSize = value;
    console.log('Debounced value:', value);
  });

  onSliderChange(value: number) {
    this.sliderInput$.next(value);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.storyService.getStories().subscribe({
      next: (data) => {
        this.stories = data["stories"];
        console.log(data);
      },
      error: (err) => {
        console.error("Error loading stories", err);
      }
    })
  }
}
