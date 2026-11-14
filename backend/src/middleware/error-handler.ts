import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { isHttpError } from '../utils/http-error.js';

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({ error: { message: `Route not found: ${req.method} ${req.path}` } });
};

export const errorHandler: ErrorRequestHandler = (err: unknown, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({ error: { message: 'Invalid request', issues: err.issues } });
    return;
  }

  if (isHttpError(err)) {
    if (err.status >= 500) console.error(err);
    const message = err.expose ? err.message : 'Internal server error';
    res.status(err.status).json({ error: { message } });
    return;
  }
  console.error(err);
  res.status(500).json({ error: { message: 'Internal server error' } });
};
