import type { Meta, StoryObj } from '@storybook/react-vite'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter, Route, Routes } from 'react-router'
import { createI18nInstance } from '../../../i18n'
import RestauranteLayout from './RestauranteLayout'

const i18nInstance = createI18nInstance('es')

/** Placeholder routed content, standing in for a real page inside the outlet. */
function PlaceholderPage() {
  return <div style={{ padding: '3rem 1.25rem' }}>Contenido de la página</div>
}

const meta = {
  title: 'Restaurante/RestauranteLayout',
  component: RestauranteLayout,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof RestauranteLayout>

export default meta

type Story = StoryObj<typeof meta>

/** The shared layout with the "Carta" route active, showing the nav state. */
export const Default: Story = {
  render: () => (
    <HelmetProvider>
      <I18nextProvider i18n={i18nInstance}>
        <MemoryRouter initialEntries={['/restaurante-multi/carta']}>
          <Routes>
            <Route path="/restaurante-multi" element={<RestauranteLayout />}>
              <Route index element={<PlaceholderPage />} />
              <Route path="carta" element={<PlaceholderPage />} />
              <Route path="reservas" element={<PlaceholderPage />} />
              <Route path="contacto" element={<PlaceholderPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </HelmetProvider>
  ),
}
