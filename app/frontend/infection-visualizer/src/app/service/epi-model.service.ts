import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EpiModelService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  getSIR(dataParams: any): Observable<any> {
    let url = this.baseUrl + "/sir"
    if (dataParams.transmission_rate) {
      url += "?transmission_rate="
      url += dataParams.transmission_rate
    }
    console.log(url)
    
    return this.http.get(url);
  }
}
