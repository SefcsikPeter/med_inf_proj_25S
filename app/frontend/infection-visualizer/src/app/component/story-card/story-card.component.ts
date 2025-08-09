import { Component, Input } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

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
  @Input() locked: boolean = false;
  @Input() quizPassed: boolean = false;

  private readonly BADGE_BASE = 'http://localhost:8000/static/badges';

  constructor(private router: Router) {}

  get badgeSrc(): string {
    return this.quizPassed
      ? `${this.BADGE_BASE}/${this.storyId}.png`
      : `${this.BADGE_BASE}/-1.png`;
  }

  useSilhouetteFallback(evt: Event) {
    const img = evt.target as HTMLImageElement;
    img.src = `${this.BADGE_BASE}/-1.png`;
  }

  get bgColor(): string {
    const startColor = { r: 255, g: 255, b: 255 };
    const endColor = { r: 208, g: 0, b: 111 };

    const mix = (start: number, end: number) =>
      Math.round(start + (end - start) * this.progress);

    const r = mix(startColor.r, endColor.r);
    const g = mix(startColor.g, endColor.g);
    const b = mix(startColor.b, endColor.b);

    return `rgb(${r}, ${g}, ${b})`;
  }

  get textColor(): string {
    const startColor = { r: 255, g: 255, b: 255 };
    const endColor = { r: 208, g: 0, b: 111 };

    const mix = (start: number, end: number) =>
      Math.round(start + (end - start) * this.progress);

    const r = mix(startColor.r, endColor.r);
    const g = mix(startColor.g, endColor.g);
    const b = mix(startColor.b, endColor.b);

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance < 140 ? '#ffffff' : '#000000';
  }

  navigateToStory(): void {
    if (!this.locked) {
      this.router.navigate(['/story', this.storyId], {
        queryParams: { page: this.page }
      });
    } 
  }

  skipToQuiz(event: MouseEvent): void {
    event.stopPropagation();
    this.router.navigate(['/quiz', this.storyId], {
      queryParams: { page: 0 }
    });
  }

  protected readonly parseInt = parseInt;
}
