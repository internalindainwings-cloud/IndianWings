import { Request, Response, NextFunction } from 'express';

const DEFAULT_MAX_BYTES = 15 * 1024; // 15 KB

export function requestSizeLimit(maxBytes: number = DEFAULT_MAX_BYTES) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentLength = req.headers['content-length'];
    if (contentLength && parseInt(contentLength, 10) > maxBytes) {
      res.status(413).json({
        success: false,
        error: 'Payload too large. Maximum request size exceeded.',
      });
      return;
    }
    next();
  };
}
