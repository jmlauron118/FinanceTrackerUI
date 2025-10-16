import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://localhost:7029/api'
  constructor(private http: HttpClient) { }

  getValues(): Observable<any> {
    return this.http.get(`${this.baseUrl}/values`);
  }
}
