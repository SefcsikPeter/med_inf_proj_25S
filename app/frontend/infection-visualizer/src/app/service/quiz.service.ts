import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private baseUrl = 'http://localhost:8000/quiz';
  constructor(private http: HttpClient) {}

  getQuizQuestion(storyId: number, page: number = 0): Observable<any> {
    const url = `${this.baseUrl}/${storyId}`;
    const params = new HttpParams().set('page', page.toString());

    return this.http.get<any>(url, {params});
  }

  getQuizData(storyId: number): Observable<any> {
    const url = `${this.baseUrl}/${storyId}/data`;
    console.log(url)
    return this.http.get<any>(url);
  }

  submitAnswers(storyId: number, selectedAnswers: string[]): Observable<any> {
    const url = `${this.baseUrl}/${storyId}/submit`;
    return this.http.post<any>(url, selectedAnswers);
  }
}
