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

  getSIRAT(dataParams: any): Observable<any> {
    const url = `${this.baseUrl}/sir/at`;

    let params = new URLSearchParams();

    if (dataParams.start_index !== undefined && dataParams.start_index !== null) {
      params.append('start_index', dataParams.start_index.toString());
    }
    if (dataParams.end_index !== undefined && dataParams.end_index !== null) {
      params.append('end_index', dataParams.end_index.toString());
    }
    if (dataParams.include_generated !== undefined && dataParams.include_generated !== null) {
      params.append('include_generated', String(dataParams.include_generated));
    }
    if (dataParams.transmission_rate !== undefined && dataParams.transmission_rate !== null) {
      params.append('transmission_rate', dataParams.transmission_rate.toString());
    }
    if (dataParams.recovery_rate !== undefined && dataParams.recovery_rate !== null) {
      params.append('recovery_rate', dataParams.recovery_rate.toString());
    }
    if (dataParams.sim_extra_days !== undefined && dataParams.sim_extra_days !== null) {
      params.append('sim_extra_days', dataParams.sim_extra_days.toString());
    }

    const fullUrl = `${url}?${params.toString()}`;
    console.log('SIR AT URL:', fullUrl);

    return this.http.get(fullUrl);
  }

}
