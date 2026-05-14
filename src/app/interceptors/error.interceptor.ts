import { HttpInterceptorFn } from '@angular/common/http';
import { ErrorHandlerService } from '../services/error-handler.service';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandler = inject(ErrorHandlerService);
  return next(req).pipe(
    catchError(error => errorHandler.handleError(error))
  );
};
