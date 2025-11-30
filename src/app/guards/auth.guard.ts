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