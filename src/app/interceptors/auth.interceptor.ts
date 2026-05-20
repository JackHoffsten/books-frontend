import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);
  const accessToken: string | null = authService.getAccessToken();
  const isApiRequest = req.url.includes('/api');
  
  if (!isApiRequest) {
    return next(req);
  }

  let authReq = req.clone({ withCredentials: true });
  
  if (accessToken && !req.url.includes('/refresh-token')) {
    authReq = authReq.clone({
      setHeaders: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });
  }

  return next(authReq);
};
