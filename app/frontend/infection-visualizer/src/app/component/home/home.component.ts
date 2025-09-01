import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoryService} from '../../service/story.service';
import {LessonGraphComponent} from '../lesson-graph/lesson-graph.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    LessonGraphComponent,
    MatProgressBarModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private storyService: StoryService) {
  }

  stories: any;
  progress: number = 0;

  ngOnInit(): void {
    this.storyService.getStories().subscribe({
      next: (data) => {
        this.stories = data["stories"];
        console.log(data);
        const passedCount = this.stories.filter((story: { passed: any; }) => story.passed).length;
        this.progress = passedCount / this.stories.length;
      },
      error: (err) => {
        console.error("Error loading stories", err);
      }
    })
  }
}
