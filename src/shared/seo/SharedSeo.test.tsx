import { render, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HelmetProvider } from 'react-helmet-async'
import { SharedSeo } from './SharedSeo'

describe('SharedSeo', () => {
  it('sets the document title and meta description', async () => {
    render(
      <HelmetProvider>
        <SharedSeo title="Test page" description="Test description" />
      </HelmetProvider>,
    )

    await waitFor(() => {
      expect(document.title).toBe('Test page')
      expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
        'content',
        'Test description',
      )
    })
  })

  it('falls back to title/description for Open Graph tags when not overridden', async () => {
    render(
      <HelmetProvider>
        <SharedSeo title="Test page" description="Test description" />
      </HelmetProvider>,
    )

    await waitFor(() => {
      expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute(
        'content',
        'Test page',
      )
      expect(document.querySelector('meta[property="og:description"]')).toHaveAttribute(
        'content',
        'Test description',
      )
    })
  })
})
