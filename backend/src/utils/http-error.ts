export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

/** Upstream (EDGAR) failed or returned something we couldn't understand. */
export class UpstreamError extends HttpError {
  constructor(message: string) {
    super(502, message);
    this.name = 'UpstreamError';
  }
}
