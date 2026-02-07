import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { EMPTY } from 'rxjs';
import { AuthService } from '@services/login/auth.service';
import { SnackbarService } from '@services/snackbar.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);
  const authService = inject(AuthService);
  const snackbar = inject(SnackbarService);

  if (req.url.includes('/api/auth/login')) {
    return next(req);
  }

  let token: string | null = null;
  if (isBrowser && typeof localStorage !== 'undefined') {
    token = localStorage.getItem('ft_access_token');
  }

  if (isBrowser && token === null) {
    authService.logout();

    return EMPTY;
  }
  else if(authService.isTokenExpired(token)) {
    snackbar.warning('Session expired. Please log in again.', 4000);
    authService.logout();

    return EMPTY;
  }

  req = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(req);
};