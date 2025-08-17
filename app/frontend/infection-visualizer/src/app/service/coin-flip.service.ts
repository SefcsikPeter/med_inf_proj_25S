import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoinFlipService {

  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

    getCoinFlips(nFlips?: number): Observable<any> {
      const url = nFlips
        ? `${this.baseUrl}/coin-flip?n_flips=${nFlips}`
        : `${this.baseUrl}/coin-flip`;
      console.log(url)
  
      return this.http.get(url);
    }
}
