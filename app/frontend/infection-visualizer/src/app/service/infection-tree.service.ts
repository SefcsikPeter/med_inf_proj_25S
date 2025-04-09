import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfectionTreeService {

  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  getInfectionTree(popSize?: number): Observable<any> {
    const url = popSize
      ? `${this.baseUrl}/inf-tree?pop_size=${popSize}`
      : `${this.baseUrl}/inf-tree`;

    return this.http.get(url);
  }

  getDummyTree(numIter?: number): Observable<any> {
    const url = numIter
      ? `${this.baseUrl}/dummy-tree?num_iter=${numIter}`
      : `${this.baseUrl}/dummy-tree`;
    console.log(url)

    return this.http.get(url);
  }
}
