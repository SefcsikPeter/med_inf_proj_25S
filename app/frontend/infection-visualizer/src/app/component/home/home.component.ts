import {Component, OnInit} from '@angular/core';
import { InfectionTreeComponent } from '../infection-tree/infection-tree.component';
import { SliderComponent } from '../slider/slider.component';
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
export class HomeComponent implements OnInit {
  constructor(private storyService: StoryService) {
  }

  stories: any;

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
