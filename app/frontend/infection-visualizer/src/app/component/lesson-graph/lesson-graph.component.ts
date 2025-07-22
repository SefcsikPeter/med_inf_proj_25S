import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { StoryCardComponent } from '../story-card/story-card.component';

@Component({
  selector: 'app-lesson-graph',
  standalone: true,
  imports: [StoryCardComponent],
  templateUrl: './lesson-graph.component.html',
  styleUrls: ['./lesson-graph.component.css']
})
export class LessonGraphComponent implements OnChanges {
  @Input() lessons: any[] = [];

  drawCards = false;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (this.lessons) {
      this.drawCards = true;
    }
  }
}
