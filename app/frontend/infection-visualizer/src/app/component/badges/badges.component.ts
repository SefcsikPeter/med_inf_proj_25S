import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoryService } from '../../service/story.service';

type Story = { id: number; title: string; passed: boolean; page?: number };

@Component({
  selector: 'app-badges',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './badges.component.html',
  styleUrl: './badges.component.css'
})
export class BadgesComponent implements OnInit {
  stories: Story[] = [];
  loading = true;
  error = '';

  private readonly BADGE_BASE = 'http://localhost:8000/static/badges';

  constructor(private storyService: StoryService) {}

  ngOnInit(): void {
    this.storyService.getStories().subscribe({
      next: (data) => {
        this.stories = data['stories'] ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading stories', err);
        this.error = 'Could not load badges.';
        this.loading = false;
      }
    });
  }

  badgeSrcFor(story: Story): string {
    return story.passed
      ? `${this.BADGE_BASE}/${story.id}.png`
      : `${this.BADGE_BASE}/-1.png`;
  }

  useSilhouetteFallback(evt: Event) {
    (evt.target as HTMLImageElement).src = `${this.BADGE_BASE}/-1.png`;
  }
}
