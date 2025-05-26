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
  storyId: number = 0;
  currentQuestionIndex: number = 0;
  totalQuestions: number = 0;
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

    this.loadData();
    this.loadQuestion(this.currentQuestionIndex);
  }

  loadData(): void {
    this.quizService.getQuizData(this.storyId).subscribe({
      next: (data) => {
        this.title = data.title;
        this.totalQuestions = data.total_pages;
        console.log('loaded title and size', data);
      },
      error: (err) => {
        console.log('Error fetching title and size', err);
      }
    });
  }

async loadQuestion(index: number): Promise<void> {
    this.quizService.getQuizQuestion(this.storyId, index).subscribe({
      next: async (data) => {
        console.log(data)
        this.question = data.slide;
        this.currentQuestionIndex = data.page;
        this.imagePath = 'http://localhost:8000/static/images/';
        if (data.image != null) {
          this.imagePath += data.image;
        }

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { page: this.currentQuestionIndex },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      },
      error: (err) => {
        console.error('Failed to load question:', err);
      }
    });
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
