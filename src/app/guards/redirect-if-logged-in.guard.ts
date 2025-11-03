import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/login/auth.service';

export const redirectIfLoggedInGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();
  if (token && !auth.isTokenExpired(token)) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
