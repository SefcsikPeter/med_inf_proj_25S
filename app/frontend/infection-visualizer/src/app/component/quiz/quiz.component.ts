import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { QuizService } from '../../service/quiz.service';
import { McQuestionComponent } from '../mc-question/mc-question.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
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
  isAnswerCorrect = false;
  answers: string[] = [];

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.storyId = Number(params.get('story_id')) || 0;
      console.log(this.storyId)
    });

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
        this.answers = Array(this.totalQuestions).fill("");
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
        } else {
          this.imagePath = '';
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
        queryParamsHandling: 'merge'
      });
    }
    this.isAnswerCorrect = false;
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

  onAnswerStatusChanged(isCorrect: boolean): void {
    this.isAnswerCorrect = isCorrect;
  }

  recordAnswer(answer: string): void {
    this.answers[this.currentQuestionIndex] = answer;
    console.log(`Answer for question ${this.currentQuestionIndex}: ${answer}`);
  }

  submitAnswers() {
    this.quizService.submitAnswers(this.storyId, this.answers).subscribe({
      next: (data) => {
        console.log('submitted answers', data);
        this.showBadgeToast();
        this.quizService.allPassed().subscribe({
          next: (data) => {
            if (data.all_passed) {
              this.router.navigate(['/congrats']);
            } else {
              this.quizService.getProgress().subscribe({
                next: (celebration_data) => {
                  console.log(celebration_data)
                  if (celebration_data.celebrate === 0 || celebration_data.celebrate) {
                    this.router.navigate(['/congrats'], {
                      state: { course: celebration_data.chapter, progress: celebration_data.progress }
                    });
                  }
                }
              })
              this.router.navigate(['/']);
            }
          },
          error: (err) => {
            console.error('error checking whether all quizzes are passed: ', err)
          }
        });
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  showBadgeToast() {
    const url = `http://localhost:8000/static/badges/${this.storyId}.png`;

    this.toastr.success(
      `<img src="${url}"">`,
      'You earned a new badge!',
      { enableHtml: true }
    );
  }

}
