import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { ErrorHandlerService } from '@services/error-handler.service';
import { LoginCreds } from '@interfaces/login/login-creds';
import { UserModules } from '@interfaces/usermanager/user-modules';
import { Router } from '@angular/router';
import { SnackbarService } from '@services/snackbar.service';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '@interfaces/login/decoded-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = '/api/auth';
  private isBrowser!: boolean;
  private tokenKey = 'ft_access_token';
  private userModulesSubject = new BehaviorSubject<UserModules[]>([]);
  userModules$ = this.userModulesSubject.asObservable();

  constructor(
    private http: HttpClient, 
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private snackbar: SnackbarService,
    @Inject(PLATFORM_ID) platformId: Object
  ) { 
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private get localStorageSafe() {
    return this.isBrowser ? localStorage : null;
  }

  login(loginCreds: LoginCreds): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginCreds).pipe(
      tap((response: any) => {
        if(this.localStorageSafe) {
          localStorage.setItem(this.tokenKey, response.token);
        }

        this.userModulesSubject.next(response.userModules);
      }),
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  getUserModulesFromToken(): UserModules[] {
    const token = this.getToken();

    if(!token) return [];

    try{
      const decoded = jwtDecode<DecodedToken>(token);

      if(decoded.modules){
        return JSON.parse(decoded.modules);
      }
    }
    catch(e) {
      this.snackbar.danger(`Invalid token format: ${e}`, 4000);
    }

    return [];
  }

  getUserModules(): Observable<UserModules[]> {
    return this.http.get<UserModules[]>('/api/usermanager/get-user-modules');
  }

  logout(): void {
    if(this.localStorageSafe) {
      localStorage.removeItem(this.tokenKey);
    }

    this.userModulesSubject.next([]);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.localStorageSafe ? this.localStorageSafe.getItem(this.tokenKey) : null;
  }

  isTokenExpired(token?: string | null): boolean {
    if(!token) return true;

    try{
      const decode: any = jwtDecode(token);

      if(!decode.exp) return true;
      
      return Date.now() >= decode.exp * 1000;
    }
    catch{
      return true;
    }
  }
}
