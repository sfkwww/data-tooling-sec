import type { z } from 'zod';

const API_BASE_URL = '/api';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiErrorBody {
  error?: { message?: string };
}

/**
 * Thin fetch wrapper: prefixes the API base URL, throws ApiError on non-2xx, and parses the
 * JSON body with `schema` so the result is validated rather than asserted.
 */
export async function apiFetch<T extends z.ZodType>(
  path: string,
  schema: T,
  init?: RequestInit,
): Promise<z.infer<T>> {
  const res = await fetch(`${API_BASE_URL}${path}`, init);
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as ApiErrorBody;
    throw new ApiError(res.status, body.error?.message ?? `Request failed (${res.status})`);
  }
  return schema.parse(await res.json());
}
