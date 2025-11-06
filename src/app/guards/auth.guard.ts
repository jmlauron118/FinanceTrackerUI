// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '@services/login/auth.service';
// import { SnackbarService } from '@services/snackbar.service';
// import { of } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';

// export const authGuard: CanActivateFn = (route, state) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);
//   const snackbar = inject(SnackbarService);

//   const currentModule = route.data['moduleName'] as string;
//   const token = authService.getToken();

//   if(!token || authService.isTokenExpired(token)) {
//     snackbar.warning('Session expired. Please log in again.');
//     authService.logout();
//     return of(false);
//   }
//   return authService.getUserModules().pipe(
//     map(modules => {
//       const hasAccess = modules.some(m => m.modulePage.toLowerCase() === currentModule);

//       if (!hasAccess) {
//         console.warn(`❌ Access denied to module: ${currentModule}`);
//         router.navigate(['/dashboard']); // or a 403 page
//       }

//       return hasAccess;

//     }),
//     catchError((err) => {
//       console.error('❌ Failed to fetch modules', err);
//       router.navigate(['/login']);
//       return of(false);
//     })
//   );
// };

import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@services/login/auth.service';
import { SnackbarService } from '@services/snackbar.service';

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const authService = inject(AuthService);
  const snackbar = inject(SnackbarService);

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('ft_access_token');
    if (!token) {
      router.navigate(['/login']);
      return false;
    }
 
    authService.getUserModules().subscribe({
      next: response => {
        const currentModule = route.data['moduleName'] as string;
        const hasAccess = response.data.some(m => m.modulePage.toLowerCase() === currentModule);

        if (!hasAccess) {
          snackbar.warning(`❌ Access denied to module: ${currentModule}`);

          router.navigate(['/forbidden']);
          
          return true;
        }

        return false;
      }
    });
    
    return true;
  }

  return false;
};