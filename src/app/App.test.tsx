import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('mounts the providers and renders the home route', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /inicio/i })).toBeInTheDocument()
    })
  })
})
