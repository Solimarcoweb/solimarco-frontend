import type { BusinessHours } from '../../../shared/components/BusinessInfo'
import type { LegalLink } from '../../../shared/components/Footer'
import type { Service } from '../../../shared/components/ServicesList'

/** Tenant identifier for the mechanic multi-page demo (Taller Mecánico El Teide). */
export const MECANICO_TENANT_ID = 'demo-el-teide'

/** Canonical site URL of the tenant. */
export const SITE_URL = 'https://www.tallermecanicoelteide.es'

/** Base path of the multi-page mechanic site. */
export const BASE_PATH = '/mecanico-multi'

/** Real-looking business data for the demo (Taller Mecánico El Teide, La Laguna). */
export const BUSINESS = {
  name: 'Taller Mecánico El Teide',
  address: 'Calle Heliodoro Rodríguez López 8, 38205 San Cristóbal de La Laguna, Tenerife',
  phone: '+34 922 25 41 60',
  email: 'taller@mecanicoelteide.es',
} as const

export const LEGAL_LINKS: LegalLink[] = [
  { label: 'Aviso legal', href: '/legal/aviso-legal' },
  { label: 'Política de privacidad', href: '/legal/privacidad' },
  { label: 'Política de cookies', href: '/legal/cookies' },
]

export const HOURS: BusinessHours[] = [
  { day: 'Lunes', open: '08:00', close: '18:00' },
  { day: 'Martes', open: '08:00', close: '18:00' },
  { day: 'Miércoles', open: '08:00', close: '18:00' },
  { day: 'Jueves', open: '08:00', close: '18:00' },
  { day: 'Viernes', open: '08:00', close: '17:00' },
  { day: 'Sábado', open: '09:00', close: '13:00' },
  { day: 'Domingo', open: '', close: '', closed: true },
]

export const SERVICES: Service[] = [
  {
    id: 'mantenimiento',
    name: 'Mantenimiento y revisión',
    description:
      'Revisión completa de 27 puntos: aceite, filtros, frenos, neumáticos, niveles y sistema eléctrico. Te entregamos un informe detallado del estado del vehículo.',
    price: 'desde 49 €',
    duration: '~45 min',
    imageUrl: 'https://picsum.photos/seed/taller-mantenimiento/800/600',
  },
  {
    id: 'frenos',
    name: 'Frenos y suspensión',
    description:
      'Sustitución de pastillas, discos, latiguillos y amortiguadores. Diagnosis de ruidos y vibraciones.',
    price: 'desde 79 €',
    duration: '~90 min',
    imageUrl: 'https://picsum.photos/seed/taller-frenos/800/600',
  },
  {
    id: 'itv',
    name: 'Pre-revisión ITV',
    description:
      'Comprobamos todo lo que la ITV va a revisar para que pases sin sorpresas. Si algo falla, lo arreglamos antes de que vayas.',
    price: '29 €',
    duration: '~30 min',
    imageUrl: 'https://picsum.photos/seed/taller-itv/800/600',
  },
  {
    id: 'electricidad',
    name: 'Electricidad y electrónica',
    description:
      'Diagnosis OBD, sustitución de batería, alternador, motor de arranque y reparación de averías eléctricas.',
    price: 'desde 35 €',
    duration: '~60 min',
    imageUrl: 'https://picsum.photos/seed/taller-electrica/800/600',
  },
  {
    id: 'neumaticos',
    name: 'Neumáticos y llantas',
    description:
      'Montaje, equilibrado y alineación de todas las marcas. Reparación de pinchazos. Guardamos tus neumáticos de temporada.',
    price: 'desde 12 €/ud',
    duration: '~30 min',
    imageUrl: 'https://picsum.photos/seed/taller-neumaticos/800/600',
  },
  {
    id: 'aire',
    name: 'Aire acondicionado',
    description:
      'Recarga de gas, limpieza del circuito y revisión de compresor y condensador. Idealmente antes del verano.',
    price: 'desde 55 €',
    duration: '~60 min',
    imageUrl: 'https://picsum.photos/seed/taller-aire/800/600',
  },
]

/** Three highlighted services for the home page teaser. */
export const FEATURED_SERVICES: Service[] = [SERVICES[0], SERVICES[1], SERVICES[2]]

export const SEO_DESCRIPTION =
  'Taller mecánico en San Cristóbal de La Laguna, Tenerife. Mantenimiento, frenos, ITV, electricidad y neumáticos. Pide cita online.'

/** Maps Spanish day labels to schema.org day names. */
const SCHEMA_DAY: Record<string, string> = {
  Lunes: 'Monday',
  Martes: 'Tuesday',
  Miércoles: 'Wednesday',
  Jueves: 'Thursday',
  Viernes: 'Friday',
  Sábado: 'Saturday',
  Domingo: 'Sunday',
}

/** schema.org AutoRepair structured data, shared across every page via the layout. */
export const AUTO_REPAIR_SCHEMA: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'AutoRepair',
  name: BUSINESS.name,
  description: SEO_DESCRIPTION,
  url: SITE_URL,
  telephone: BUSINESS.phone,
  email: BUSINESS.email,
  priceRange: '€€',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Calle Heliodoro Rodríguez López 8',
    postalCode: '38205',
    addressLocality: 'San Cristóbal de La Laguna',
    addressRegion: 'Santa Cruz de Tenerife',
    addressCountry: 'ES',
  },
  openingHoursSpecification: HOURS.filter((entry) => !entry.closed).map((entry) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: SCHEMA_DAY[entry.day],
    opens: entry.open,
    closes: entry.close,
  })),
}
