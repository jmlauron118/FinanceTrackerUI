import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { ErrorHandlerService } from '@services/error-handler.service';
import { LoginCreds } from '@interfaces/login/login-creds';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = '/api/auth';

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  login(loginCreds: LoginCreds): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginCreds)
      .pipe();
  }
}
