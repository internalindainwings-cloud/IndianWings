import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[ErrorHandler] Unhandled error:', err?.message || err);
  res.status(500).json({
    success: false,
    error: 'Something went wrong. Please try again.',
  });
}
