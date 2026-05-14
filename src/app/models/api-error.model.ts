export interface ApiError {
  title: string;
  status: number;
  detail: string;
  code: ErrorCode;
  timestamp: string;
}

export enum ErrorCode {
  USERNAME_EMPTY = 'USERNAME_EMPTY',
  EMAIL_EMPTY = 'EMAIL_EMPTY',
  USERNAME_TAKEN = 'USERNAME_TAKEN',
  EMAIL_TAKEN = 'EMAIL_TAKEN',
  PASSWORD_TOO_SHORT = 'PASSWORD_TOO_SHORT',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}