import type { Meta, StoryObj } from '@storybook/react-vite'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter, Route, Routes } from 'react-router'
import GenericoLayout from './GenericoLayout'

function PlaceholderPage() {
  return <div style={{ padding: '3rem 1.25rem', fontFamily: 'Georgia, serif' }}>Contenido de la página</div>
}

function buildRoutes(initialPath: string) {
  return (
    <HelmetProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/generico-multi" element={<GenericoLayout />}>
            <Route index element={<PlaceholderPage />} />
            <Route path="servicios" element={<PlaceholderPage />} />
            <Route path="contacto" element={<PlaceholderPage />} />
            <Route path="presupuesto" element={<PlaceholderPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  )
}

const meta = {
  title: 'Generico/GenericoLayout',
  component: GenericoLayout,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof GenericoLayout>

export default meta

type Story = StoryObj<typeof meta>

export const Inicio: Story = {
  render: () => buildRoutes('/generico-multi'),
}

export const Servicios: Story = {
  render: () => buildRoutes('/generico-multi/servicios'),
}

export const Contacto: Story = {
  render: () => buildRoutes('/generico-multi/contacto'),
}

export const Presupuesto: Story = {
  render: () => buildRoutes('/generico-multi/presupuesto'),
}
