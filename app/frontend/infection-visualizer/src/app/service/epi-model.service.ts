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
    const url = this.baseUrl + "/sir";

    let params = new URLSearchParams();

    console.log('sir parameters', dataParams.discrete)

    if (dataParams.transmission_rate) {
      params.append('transmission_rate', dataParams.transmission_rate);
    }
    if (dataParams.recovery_rate) {
      params.append('recovery_rate', dataParams.recovery_rate);
    }
    if (dataParams.discrete !== undefined && dataParams.discrete !== null) {
      params.append('discrete', String(dataParams.discrete));
    }
    if (dataParams.pop_size) {
      params.append('pop_size', dataParams.pop_size);
    }
    if (dataParams.n_inf) {
      params.append('n_inf', dataParams.n_inf);
    }
    if (dataParams.n_days) {
      params.append('n_days', dataParams.n_days);
    }

    const fullUrl = `${url}?${params.toString()}`;
    console.log(fullUrl);

    return this.http.get(fullUrl);
  }
}
