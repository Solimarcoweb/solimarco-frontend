import type { Meta, StoryObj } from '@storybook/react-vite'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter, Route, Routes } from 'react-router'
import TiendaLayout from './TiendaLayout'

/** Placeholder content standing in for a real page inside the outlet. */
function PlaceholderPage() {
  return <div style={{ padding: '3rem 1.25rem', fontFamily: 'sans-serif' }}>Contenido de la página</div>
}

const meta = {
  title: 'Tienda/TiendaLayout',
  component: TiendaLayout,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TiendaLayout>

export default meta

type Story = StoryObj<typeof meta>

/** Layout with "Inicio" active. */
export const Inicio: Story = {
  render: () => (
    <HelmetProvider>
      <MemoryRouter initialEntries={['/tienda-multi']}>
        <Routes>
          <Route path="/tienda-multi" element={<TiendaLayout />}>
            <Route index element={<PlaceholderPage />} />
            <Route path="productos" element={<PlaceholderPage />} />
            <Route path="carrito" element={<PlaceholderPage />} />
            <Route path="contacto" element={<PlaceholderPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  ),
}

/** Layout with "Tienda" active. */
export const Tienda: Story = {
  render: () => (
    <HelmetProvider>
      <MemoryRouter initialEntries={['/tienda-multi/productos']}>
        <Routes>
          <Route path="/tienda-multi" element={<TiendaLayout />}>
            <Route index element={<PlaceholderPage />} />
            <Route path="productos" element={<PlaceholderPage />} />
            <Route path="carrito" element={<PlaceholderPage />} />
            <Route path="contacto" element={<PlaceholderPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  ),
}

/** Layout with "Carrito" active. */
export const Carrito: Story = {
  render: () => (
    <HelmetProvider>
      <MemoryRouter initialEntries={['/tienda-multi/carrito']}>
        <Routes>
          <Route path="/tienda-multi" element={<TiendaLayout />}>
            <Route index element={<PlaceholderPage />} />
            <Route path="productos" element={<PlaceholderPage />} />
            <Route path="carrito" element={<PlaceholderPage />} />
            <Route path="contacto" element={<PlaceholderPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  ),
}
