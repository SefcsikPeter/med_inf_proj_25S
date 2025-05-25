import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private baseUrl = 'http://localhost:8000/quiz';
  constructor(private http: HttpClient) {}
  getQuiz() {
    return of({
      title: 'Test Quiz',
      questions: [
        {
          text: 'What is the analogy used to explain disease spread?',
          options: ['Sharing lunch', 'Gossip in school', 'Tag', 'Wearing masks'],
          correctAnswer: 'Gossip in school',
          image: 'gossip.png'
        },
        {
          text: 'What tool do we use to simulate gossip spreading?',
          options: ['Coin', 'Dice', 'Compass', 'Map'],
          correctAnswer: 'Dice',
          image: 'dice.jpg'
        }
      ]
    });
  }

  getQuizData(storyId: number): Observable<any> {
    const url = `${this.baseUrl}/${storyId}/data`;
    console.log(url)
    return this.http.get<any>(url);
  }
}
