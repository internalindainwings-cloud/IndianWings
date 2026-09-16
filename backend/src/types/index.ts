import { Request } from 'express';

export interface ApiSuccess<T = unknown> {
  success: true;
  data?: T;
  [key: string]: unknown;
}

export interface ApiError {
  success: false;
  error: string;
  fields?: Record<string, string[]>;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

export interface AdminPayload {
  sub: string;
  iat: number;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  adminPayload?: AdminPayload;
}
