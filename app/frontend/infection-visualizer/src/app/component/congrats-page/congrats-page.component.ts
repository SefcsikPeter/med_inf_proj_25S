import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

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
  readonly COURSE_NAME = 'Epidemiology Course';
  pieces: ConfettiPiece[] = [];

  constructor() {
    this.pieces = this.generatePieces();
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

  /** Rebuild the confetti nodes so CSS keyframes restart */
  retriggerConfetti(): void {
    this.pieces = []; // destroy existing spans
    // next tick: rebuild with fresh random pieces
    requestAnimationFrame(() => {
      this.pieces = this.generatePieces(60);
    });
  }
}
