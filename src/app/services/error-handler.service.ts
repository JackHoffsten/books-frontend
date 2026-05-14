import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ApiError, ErrorCode } from '../models/api-error.model';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  handleError(error: HttpErrorResponse): Observable<never> {
    const apiError = this.transformToApiError(error);
    console.error('API Error:', apiError);

    if (apiError.status === 401) {
      // TODO: Refresh token or redirect to login
    }

    return throwError(() => apiError);
  }

  private transformToApiError(error: HttpErrorResponse): ApiError {
    if (error.error == null) {
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
}
