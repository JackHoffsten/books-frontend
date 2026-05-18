export interface User {
  username: string;
  email: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  accessToken: string;
}

