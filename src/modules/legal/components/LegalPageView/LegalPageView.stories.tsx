import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router'
import type { LegalPage } from '../../models/legal'
import { LegalPageView } from './LegalPageView'

/** Sample published content for the three typical legal pages of a tenant. */
const PAGES = {
  privacidad: {
    id: 'legal-privacidad',
    tenantId: 'bm-construccion',
    type: 'POLITICA_PRIVACIDAD',
    content: `
      <p>En BM Construcción S.L. tratamos los datos que nos facilitas con la
      única finalidad de gestionar tu solicitud de presupuesto o pedido.</p>
      <h2>Responsable del tratamiento</h2>
      <p>BM Construcción S.L., con domicilio en La Laguna (Santa Cruz de Tenerife).</p>
      <h2>Finalidad y legitimación</h2>
      <ul>
        <li>Atender tus consultas y solicitudes de presupuesto.</li>
        <li>Gestionar pedidos de la tienda de materiales.</li>
      </ul>
      <p>Puedes ejercer tus derechos escribiendo a
      <a href="mailto:info@bmconstruccionsl.com">info@bmconstruccionsl.com</a>.</p>
    `,
    version: 3,
    publishedAt: '2026-03-14T09:00:00Z',
    active: true,
  },
  cookies: {
    id: 'legal-cookies',
    tenantId: 'bm-construccion',
    type: 'COOKIES',
    content: `
      <p>Este sitio usa cookies técnicas necesarias para su funcionamiento y,
      con tu consentimiento, cookies de medición de audiencia.</p>
      <h2>Tipos de cookies</h2>
      <ul>
        <li><strong>Técnicas:</strong> imprescindibles, no requieren consentimiento.</li>
        <li><strong>Analíticas:</strong> nos ayudan a entender qué contenido interesa más.</li>
      </ul>
    `,
    version: 1,
    publishedAt: '2026-02-02T10:30:00Z',
    active: true,
  },
  'aviso-legal': {
    id: 'legal-aviso',
    tenantId: 'bm-construccion',
    type: 'AVISO_LEGAL',
    content: `
      <p>En cumplimiento de la Ley 34/2002 (LSSI-CE), se informa de los datos
      identificativos del titular de este sitio web.</p>
      <h2>Titular</h2>
      <p>BM Construcción S.L. — NIF B-38XXXXXX — La Laguna, Tenerife.</p>
    `,
    version: 1,
    publishedAt: '2026-01-20T08:15:00Z',
    active: true,
  },
} satisfies Record<string, LegalPage>

/**
 * Patches `globalThis.fetch` to resolve the given legal page, so the story
 * exercises the component's real service path (apiClient → fetch) without the
 * network. Returns a cleanup that restores the original fetch.
 */
function stubLegalFetch(page: LegalPage): () => void {
  const original = globalThis.fetch
  globalThis.fetch = (() =>
    Promise.resolve(
      new Response(JSON.stringify(page), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )) as typeof fetch
  return () => {
    globalThis.fetch = original
  }
}

const meta = {
  title: 'Legal/LegalPageView',
  component: LegalPageView,
  parameters: {
    layout: 'fullscreen',
  },
  // The view uses react-router (Link / useNavigate for the back actions).
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof LegalPageView>

export default meta

type Story = StoryObj<typeof meta>

/** Builds a story for one legal slug, stubbing the backend response for it. */
function legalStory(slug: keyof typeof PAGES): Story {
  const page = PAGES[slug]
  return {
    args: { tenantSlug: 'bm-construccion', type: page.type },
    beforeEach: () => stubLegalFetch(page),
  }
}

export const Privacidad = legalStory('privacidad')
export const Cookies = legalStory('cookies')
export const AvisoLegal = legalStory('aviso-legal')
