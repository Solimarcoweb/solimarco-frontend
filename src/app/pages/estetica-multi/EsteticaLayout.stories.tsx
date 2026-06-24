import type { Meta, StoryObj } from '@storybook/react-vite'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter, Route, Routes } from 'react-router'
import EsteticaLayout from './EsteticaLayout'

function PlaceholderPage() {
  return <div style={{ padding: '4rem 1.25rem', fontFamily: 'Georgia, serif' }}>Contenido de la página</div>
}

const meta = {
  title: 'Estetica/EsteticaLayout',
  component: EsteticaLayout,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof EsteticaLayout>

export default meta

type Story = StoryObj<typeof meta>

export const Inicio: Story = {
  render: () => (
    <HelmetProvider>
      <MemoryRouter initialEntries={['/estetica-multi']}>
        <Routes>
          <Route path="/estetica-multi" element={<EsteticaLayout />}>
            <Route index element={<PlaceholderPage />} />
            <Route path="tratamientos" element={<PlaceholderPage />} />
            <Route path="cita" element={<PlaceholderPage />} />
            <Route path="contacto" element={<PlaceholderPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  ),
}

export const Tratamientos: Story = {
  render: () => (
    <HelmetProvider>
      <MemoryRouter initialEntries={['/estetica-multi/tratamientos']}>
        <Routes>
          <Route path="/estetica-multi" element={<EsteticaLayout />}>
            <Route index element={<PlaceholderPage />} />
            <Route path="tratamientos" element={<PlaceholderPage />} />
            <Route path="cita" element={<PlaceholderPage />} />
            <Route path="contacto" element={<PlaceholderPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  ),
}

export const Cita: Story = {
  render: () => (
    <HelmetProvider>
      <MemoryRouter initialEntries={['/estetica-multi/cita']}>
        <Routes>
          <Route path="/estetica-multi" element={<EsteticaLayout />}>
            <Route index element={<PlaceholderPage />} />
            <Route path="tratamientos" element={<PlaceholderPage />} />
            <Route path="cita" element={<PlaceholderPage />} />
            <Route path="contacto" element={<PlaceholderPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  ),
}
