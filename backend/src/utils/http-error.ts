/**
 * Errors that carry an HTTP status. Follows the `http-errors` convention (`status` + `expose`),
 * which Express middleware like `express.json()` also uses, e.g. 400 for a malformed JSON body.
 */
export type HttpError = Error & {
  status: number;
  /** Whether `message` is safe to send to the client. */
  expose: boolean;
};

export const httpError = (status: number, message: string): HttpError =>
  Object.assign(new Error(message), { name: 'HttpError', status, expose: status < 500 });

export const notFound = (message: string): HttpError => httpError(404, message);

/** Upstream (EDGAR) failed or returned something we couldn't understand. */
export const badGateway = (message: string): HttpError =>
  // Our own 502 messages are safe to show; they don't leak internals.
  Object.assign(httpError(502, message), { expose: true });

export const isHttpError = (err: unknown): err is HttpError =>
  err instanceof Error &&
  'status' in err &&
  typeof err.status === 'number' &&
  'expose' in err &&
  typeof err.expose === 'boolean';
