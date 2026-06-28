import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useProducts } from './useProducts'

vi.mock('./TenantContext', () => ({
  useTenantConfig: () => ({ tenantId: 'demo-rincon-canario' }),
}))

const getProducts = vi.fn()
vi.mock('../../modules/sales/services/salesService', () => ({
  getProducts: (slug: string) => getProducts(slug),
}))

function Probe() {
  const state = useProducts()
  return (
    <div data-testid="state">
      {state.status}
      {state.status === 'success' ? `:${state.data.length}` : ''}
    </div>
  )
}

describe('useProducts', () => {
  it('fetches products for the tenant slug and exposes the success state', async () => {
    getProducts.mockResolvedValue([{ id: 'a' }, { id: 'b' }])

    render(<Probe />)

    await waitFor(() => expect(screen.getByTestId('state')).toHaveTextContent('success:2'))
    expect(getProducts).toHaveBeenCalledWith('demo-rincon-canario')
  })
})
