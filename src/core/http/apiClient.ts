import { env } from '../constants/env'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
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
    throw new ApiError(response.status, `Request to ${path} failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}
