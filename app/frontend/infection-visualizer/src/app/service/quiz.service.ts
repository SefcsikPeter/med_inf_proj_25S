import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
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
}
