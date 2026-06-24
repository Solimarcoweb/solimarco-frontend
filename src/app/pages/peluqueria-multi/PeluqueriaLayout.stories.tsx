import type { Meta, StoryObj } from '@storybook/react-vite'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter, Route, Routes } from 'react-router'
import PeluqueriaLayout from './PeluqueriaLayout'

function PlaceholderPage() {
  return <div style={{ padding: '3rem 1.25rem', fontFamily: 'sans-serif' }}>Contenido de la página</div>
}

function buildRoutes(initialPath: string) {
  return (
    <HelmetProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/peluqueria-multi" element={<PeluqueriaLayout />}>
            <Route index element={<PlaceholderPage />} />
            <Route path="servicios" element={<PlaceholderPage />} />
            <Route path="cita" element={<PlaceholderPage />} />
            <Route path="contacto" element={<PlaceholderPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  )
}

const meta = {
  title: 'Peluqueria/PeluqueriaLayout',
  component: PeluqueriaLayout,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PeluqueriaLayout>

export default meta

type Story = StoryObj<typeof meta>

export const Inicio: Story = {
  render: () => buildRoutes('/peluqueria-multi'),
}

export const Servicios: Story = {
  render: () => buildRoutes('/peluqueria-multi/servicios'),
}

export const Cita: Story = {
  render: () => buildRoutes('/peluqueria-multi/cita'),
}

export const Contacto: Story = {
  render: () => buildRoutes('/peluqueria-multi/contacto'),
}
