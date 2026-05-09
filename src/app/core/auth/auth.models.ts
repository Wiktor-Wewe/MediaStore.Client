export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface JwtPayload {
  sub?: string;
  email?: string;
  role?: string;
  exp?: number;
  [key: string]: unknown;
}
