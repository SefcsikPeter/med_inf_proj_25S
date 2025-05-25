import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { QuizService } from '../../service/quiz.service';
import { McQuestionComponent } from '../mc-question/mc-question.component';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    RouterLink,
    McQuestionComponent
  ],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit {
  currentQuestionIndex: number = 0;
  totalQuestions: number = 0;
  questions: any[] = [];
  question: any = null;
  imagePath: string = '';
  title: string = '';

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.currentQuestionIndex = Number(params.get('page')) || 0;
    });

    this.loadQuiz();
  }

  loadQuiz(): void {
    this.quizService.getQuiz().subscribe({
      next: (data) => {
        this.title = data.title || 'Quiz';
        this.questions = data.questions;
        this.totalQuestions = this.questions.length;
        this.loadQuestion(this.currentQuestionIndex);
      },
      error: (err) => {
        console.error('Failed to load quiz:', err);
      }
    });
  }

  loadQuestion(index: number): void {
    if (index >= 0 && index < this.totalQuestions) {
      this.question = this.questions[index];
      this.imagePath = 'http://localhost:8000/static/images/';
      if (this.question.image) {
        this.imagePath += this.question.image;
      }
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.totalQuestions - 1) {
      this.currentQuestionIndex++;
      this.loadQuestion(this.currentQuestionIndex);

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: this.currentQuestionIndex },
        queryParamsHandling: 'merge' // optional: keeps other params
      });
    }
  }

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.loadQuestion(this.currentQuestionIndex);

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: this.currentQuestionIndex },
        queryParamsHandling: 'merge'
      });
    }
  }

}
