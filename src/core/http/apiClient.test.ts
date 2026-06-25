import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, RateLimitError, apiClient } from './apiClient'

afterEach(() => {
  vi.unstubAllGlobals()
})

function stubFetch(response: Response) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))
}

describe('apiClient', () => {
  it('returns the parsed JSON body on a 2xx response', async () => {
    stubFetch(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    await expect(apiClient('/api/x')).resolves.toEqual({ ok: true })
  })

  it('throws RateLimitError with retryAfter from the Retry-After header on 429', async () => {
    stubFetch(new Response('', { status: 429, headers: { 'Retry-After': '42' } }))

    const error = await apiClient('/api/x').catch((e: unknown) => e)

    expect(error).toBeInstanceOf(RateLimitError)
    expect(error).toBeInstanceOf(ApiError) // a RateLimitError is still an ApiError
    expect((error as RateLimitError).retryAfter).toBe(42)
    expect((error as RateLimitError).status).toBe(429)
  })

  it('defaults retryAfter to 0 when the Retry-After header is missing', async () => {
    stubFetch(new Response('', { status: 429 }))

    const error = await apiClient('/api/x').catch((e: unknown) => e)

    expect(error).toBeInstanceOf(RateLimitError)
    expect((error as RateLimitError).retryAfter).toBe(0)
  })

  it('throws a plain ApiError (not RateLimitError) on other non-2xx responses', async () => {
    stubFetch(new Response('', { status: 500 }))

    const error = await apiClient('/api/x').catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).not.toBeInstanceOf(RateLimitError)
    expect((error as ApiError).status).toBe(500)
  })
})
