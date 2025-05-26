import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-mc-question',
  standalone: true,
  imports: [
    FormsModule,
    NgClass
  ],
  templateUrl: './mc-question.component.html',
  styleUrl: './mc-question.component.css'
})
export class McQuestionComponent implements OnInit, OnChanges {
  @Input() question: {
    text: string;
    options: string[];
    correctAnswer: string;
  } = {
    text: 'Question not loaded correctly',
    options: ['1', '2', '3', '4'],
    correctAnswer: '2'
  };
  @Input() imagePath: string = 'http://localhost:8000/static/images/gossip.png';

  shuffledOptions: string[] = [];

  selectedAnswer: string = '';
  answerSubmitted = false;
  isCorrect = false;

  ngOnInit(): void {
    this.shuffledOptions = this.shuffleArray(this.question.options);
  }

  submitAnswer() {
    this.answerSubmitted = true;
    this.isCorrect = this.selectedAnswer === this.question.correctAnswer;
  }

  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.shuffledOptions = this.shuffleArray(this.question.options);
  }
}
