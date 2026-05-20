import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { ApiError, ErrorCode } from '../models/api-error.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);

  private isRefreshingToken: boolean = false;
  private waitingRequests: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  handleError(req: HttpRequest<unknown>, error: HttpErrorResponse, next: HttpHandlerFn): Observable<never> {
    console.log(error);

    const apiError = this.transformToApiError(error);

    if (apiError.status === 401) {
      if (req.url.includes('/refresh-token')) {
        this.handleLogout();
        return throwError(() => apiError);
      }

      return this.tryRefreshToken(req, next, apiError);
    }

    return throwError(() => apiError);
  }

  private transformToApiError(error: HttpErrorResponse): ApiError {
    if (error.error === null) {
      return {
        title: error.statusText || 'Unknown Error',
        status: error.status,
        detail: error.message,
        code: ErrorCode.UNKNOWN_ERROR,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      title: error.error.title || 'Error',
      status: error.error.status || error.status,
      detail: error.error.detail || error.message,
      code: error.error.code || ErrorCode.UNKNOWN_ERROR,
      timestamp: error.error.timestamp || new Date().toISOString(),
    };
  }

  private tryRefreshToken(req: HttpRequest<unknown>, next: HttpHandlerFn, apiError: ApiError): Observable<never> {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.waitingRequests.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response: AuthResponse) => {
          this.isRefreshingToken = false;

          console.log("refresh-token response:");
          console.log(response);

          const newAccessToken = this.authService.getAccessToken();
          console.log(newAccessToken);
          this.waitingRequests.next(newAccessToken);

          const newReq = req.clone({
            setHeaders: {
              'Authorization': `Bearer ${newAccessToken}`
            }
          });

          console.log("req");
          console.log(req);
          console.log("newReq");
          console.log(newReq);
          
          return next(newReq);
        }),
        catchError(() => {
          this.isRefreshingToken = false;
          this.handleLogout();
          return throwError(() => apiError);
        })
      ) as Observable<never>;
    }

    return this.waitingRequests.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(() => {
        return next(req);
      })
    ) as Observable<never>;
  }

  private handleLogout() {
    this.authService.logout();
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.router.url }
    });
  }
}
