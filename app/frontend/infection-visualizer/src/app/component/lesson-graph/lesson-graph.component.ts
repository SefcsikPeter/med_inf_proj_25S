import { Component, Input } from '@angular/core';
import { StoryCardComponent } from '../story-card/story-card.component';

@Component({
  selector: 'app-lesson-graph',
  standalone: true,
  imports: [StoryCardComponent],
  templateUrl: './lesson-graph.component.html',
  styleUrls: ['./lesson-graph.component.css']
})
export class LessonGraphComponent {
  @Input() lessons: any[] = [];
}
