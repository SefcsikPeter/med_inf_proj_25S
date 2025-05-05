import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-story-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './story-card.component.html',
  styleUrls: ['./story-card.component.css']
})
export class StoryCardComponent {
  @Input() title!: string;
  @Input() progress: number = 0;
  @Input() storyId!: number;
  @Input() page: number = 0;

  get bgColor(): string {
    if (this.progress === 1) return '#a4f5bc'; // green
    if (this.progress > 0) return '#f5bcbc';     // red-ish
    return '#e0e0e0';                            // gray
  }

  get borderColor(): string {
    return this.progress > 0 ? 'green' : '#ccc';
  }

  get progressWidth(): string {
    return `${this.progress * 100}%`;
  }

  protected readonly parseInt = parseInt;
}
