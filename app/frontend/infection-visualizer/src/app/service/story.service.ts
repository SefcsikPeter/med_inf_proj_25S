import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  private baseUrl = 'http://localhost:8000/story';

  constructor(private http: HttpClient) {}

  getStorySlide(storyId: number, page: number = 0): Observable<any> {
    const url = `${this.baseUrl}/${storyId}`;
    const params = new HttpParams().set('page', page.toString());

    return this.http.get<any>(url, { params });
  }
}
