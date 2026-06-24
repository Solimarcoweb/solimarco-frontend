import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('mounts the providers and renders the home route', async () => {
    render(<App />)

    // The home route is lazy-loaded behind Suspense, so the heading only
    // appears after the dynamic import resolves. Give waitFor an explicit
    // timeout rather than relying on the 1s default, which can be exceeded
    // when the full suite runs under load.
    await waitFor(
      () => {
        expect(screen.getByRole('heading', { name: /inicio/i })).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })
})
