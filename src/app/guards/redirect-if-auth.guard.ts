import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const redirectIfAuthGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  
  if (authService.isAuthenticated()) {
    router.navigate(['/books']);
    return false;
  }

  return true;
};
