import {Component, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-mc-question',
  imports: [
    FormsModule,
    NgClass
  ],
  standalone: true,
  templateUrl: './mc-question.component.html',
  styleUrl: './mc-question.component.css'
})
export class McQuestionComponent {
  @Input() question: {
    text: string;
    options: string[];
    correctAnswer: string;
  } = {text: 'Question not loaded correctly', options: ['1', '2', '3', '4'], correctAnswer: '2'};

  selectedAnswer: string = '';
  answerSubmitted = false;
  isCorrect = false;

  submitAnswer() {
    this.answerSubmitted = true;
    this.isCorrect = this.selectedAnswer === this.question.correctAnswer;
  }
}
