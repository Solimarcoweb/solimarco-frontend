import { render, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HelmetProvider } from 'react-helmet-async'
import { SharedJsonLd } from './SharedJsonLd'

describe('SharedJsonLd', () => {
  it('injects the schema.org object as a JSON-LD script tag', async () => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Solimar&Co. demo business',
    }

    render(
      <HelmetProvider>
        <SharedJsonLd schema={schema} />
      </HelmetProvider>,
    )

    await waitFor(() => {
      const script = document.querySelector('script[type="application/ld+json"]')
      expect(script).not.toBeNull()
      expect(JSON.parse(script?.textContent ?? '')).toEqual(schema)
    })
  })
})
