import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

type ConfettiPiece = {
  left: number; size: number; delay: number; duration: number; rotate: number; hue: number;
};

@Component({
  selector: 'app-congrats-page',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './congrats-page.component.html',
  styleUrls: ['./congrats-page.component.css'],
  host: { class: 'd-block w-100' }
})
export class CongratsPageComponent {
  title = '';
  progress = 0;
  pieces: ConfettiPiece[] = [];
  showSandbox = false;
  mainText = 'Course Completed!';

  constructor(private router: Router) {
    this.pieces = this.generatePieces();

    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { course?: string; progress?: number };
    if (state?.course) {
      console.log(state.course);
      this.title = `${state.course} ${'Chapter'}`;
      this.mainText = 'Chapter Completed';
    } else {
      this.title = 'Epidemiology Course';
    }
    if (state?.progress) {
      console.log(state.progress);
      this.progress = state.progress;
    } else {
      this.progress = 1;
      this.showSandbox = true;
    }
  }

  private generatePieces(n = 120): ConfettiPiece[] {
    const out: ConfettiPiece[] = [];
    for (let i = 0; i < n; i++) {
      out.push({
        left: Math.random() * 100,
        size: 6 + Math.random() * 8,
        delay: Math.random() * 1.2,
        duration: 2.8 + Math.random() * 2.2,
        rotate: Math.random() * 360,
        hue: Math.floor(Math.random() * 360)
      });
    }
    return out;
  }

  retriggerConfetti(): void {
    this.pieces = [];
    requestAnimationFrame(() => {
      this.pieces = this.generatePieces(60);
    });
  }
}
