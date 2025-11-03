import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const loginGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  // ✅ Skip SSR rendering for authenticated users
  if (!isPlatformBrowser(platformId)) {
    const token = globalThis.localStorage?.getItem('ft_access_token');
    if (token) {
      // Prevent SSR from rendering login at all
      return false;
    }
    return true;
  }

  const token = localStorage.getItem('ft_access_token');
  if (token) {
    console.log('renderred!');
    router.navigateByUrl('/dashboard');
    return false; // prevent login route rendering
  }

  return true;
};
