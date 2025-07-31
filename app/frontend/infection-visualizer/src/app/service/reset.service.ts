import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetService {

  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  /**
   * Calls the backend /reset endpoint to reset progress.
   */
  resetProgress(): Observable<any> {
    const url = `${this.baseUrl}/reset`;
    return this.http.post(url, {});
  }
}
