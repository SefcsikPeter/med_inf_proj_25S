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

    getGossipData(dataParams: any): Observable<any> {
      const url = this.baseUrl + "/coin-flip/gossip";
      let params = new URLSearchParams();

      if (dataParams.pop_size) {
        params.append('pop_size', dataParams.pop_size);
      }
      if (dataParams.conversations_per_day) {
        params.append('conversations_per_day', dataParams.conversations_per_day);
      }
      if (dataParams.n_days) {
        params.append('n_days', dataParams.n_days);
      }

      const fullUrl = `${url}?${params.toString()}`;
      console.log(fullUrl);
  
      return this.http.get(fullUrl);
    }
}
