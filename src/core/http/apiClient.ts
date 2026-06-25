import { env } from '../constants/env'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Thrown when the backend responds `429 Too Many Requests`. A specialised
 * `ApiError` (so `instanceof ApiError` still matches) that also carries how
 * long the client should wait, parsed from the `Retry-After` header.
 */
export class RateLimitError extends ApiError {
  /** Seconds to wait before retrying, from the `Retry-After` header (0 if absent). */
  readonly retryAfter: number

  constructor(retryAfter: number, message: string) {
    super(429, message)
    this.name = 'RateLimitError'
    this.retryAfter = retryAfter
  }
}

/**
 * Parses the `Retry-After` header (a delay in seconds) into a number of
 * seconds. Returns 0 when the header is missing or not a valid non-negative
 * integer (the HTTP-date form is not used by our backend).
 */
function parseRetryAfter(header: string | null): number {
  if (!header) return 0
  const seconds = Number.parseInt(header, 10)
  return Number.isFinite(seconds) && seconds >= 0 ? seconds : 0
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

/**
 * Thin fetch wrapper for all calls to the Solimarco backend.
 * Resolves the request against `VITE_API_BASE_URL`, serializes JSON bodies
 * and throws an `ApiError` for non-2xx responses instead of failing silently.
 *
 * @param path - API path relative to the base URL, e.g. "/api/reservations".
 * @param options - Standard `RequestInit` options, with `body` accepted as a plain object.
 * @returns The parsed JSON response, typed as `T`.
 * @throws {ApiError} When the backend responds with a non-2xx status code.
 */
export async function apiClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    if (response.status === 429) {
      const retryAfter = parseRetryAfter(response.headers.get('Retry-After'))
      throw new RateLimitError(retryAfter, `Request to ${path} was rate limited (429)`)
    }
    throw new ApiError(response.status, `Request to ${path} failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}
