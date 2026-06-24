import type { BusinessHours } from '../../../shared/components/BusinessInfo'
import type { MenuCategory, MenuItem } from '../../../shared/components/Menu'
import type { LegalLink } from '../../../shared/components/Footer'

/** Tenant identifier for the multi-page restaurant demo (Restaurante El Drago). */
export const RESTAURANT_TENANT_ID = 'demo-el-drago'

/** Base canonical site URL of the tenant. */
export const SITE_URL = 'https://www.restauranteeldrago.es'

/** Base path of the multi-page restaurant site. */
export const BASE_PATH = '/restaurante-multi'

/** Real-looking business data for the demo (Restaurante El Drago, Puerto de la Cruz). */
export const BUSINESS = {
  name: 'Restaurante El Drago',
  address: 'Calle Quintana 14, 38400 Puerto de la Cruz, Santa Cruz de Tenerife',
  phone: '+34 922 38 25 40',
  email: 'reservas@restauranteeldrago.es',
} as const

export const LEGAL_LINKS: LegalLink[] = [
  { label: 'Aviso legal', href: '/legal/aviso-legal' },
  { label: 'Política de privacidad', href: '/legal/privacidad' },
  { label: 'Política de cookies', href: '/legal/cookies' },
]

export const HOURS: BusinessHours[] = [
  { day: 'Lunes', open: '', close: '', closed: true },
  { day: 'Martes', open: '13:00', close: '23:00' },
  { day: 'Miércoles', open: '13:00', close: '23:00' },
  { day: 'Jueves', open: '13:00', close: '23:00' },
  { day: 'Viernes', open: '13:00', close: '23:30' },
  { day: 'Sábado', open: '13:00', close: '23:30' },
  { day: 'Domingo', open: '13:00', close: '17:00' },
]

export const MENU: MenuCategory[] = [
  {
    id: 'entrantes',
    name: 'Entrantes',
    items: [
      {
        id: 'croquetas-pescado',
        name: 'Croquetas de pescado del día',
        description: 'Cremosas, con pescado fresco de la lonja del Puerto.',
        price: 9.5,
        imageUrl: 'https://picsum.photos/seed/croquetas-pescado/600/450',
        allergens: ['gluten', 'lactosa', 'pescado'],
      },
      {
        id: 'queso-asado-mojo',
        name: 'Queso asado con mojo',
        description: 'Queso tierno canario a la plancha con mojo rojo y verde.',
        price: 8,
        imageUrl: 'https://picsum.photos/seed/queso-asado/600/450',
        allergens: ['lactosa'],
      },
    ],
  },
  {
    id: 'principales',
    name: 'Principales',
    items: [
      {
        id: 'cabra-estofada',
        name: 'Cabra estofada',
        description: 'Guiso tradicional a fuego lento con papas y vino del país.',
        price: 14.5,
        imageUrl: 'https://picsum.photos/seed/cabra-estofada/600/450',
      },
      {
        id: 'cherne-plancha',
        name: 'Lomo de cherne a la plancha',
        description: 'Con papas arrugadas, mojo verde y verduras de temporada.',
        price: 18,
        imageUrl: 'https://picsum.photos/seed/cherne-plancha/600/450',
        allergens: ['pescado'],
      },
      {
        id: 'solomillo',
        name: 'Solomillo con papas arrugadas',
        description: 'Solomillo de ternera a la brasa con salsa de pimienta.',
        price: 19.5,
        imageUrl: 'https://picsum.photos/seed/solomillo/600/450',
        allergens: ['lactosa'],
      },
    ],
  },
  {
    id: 'postres',
    name: 'Postres',
    items: [
      {
        id: 'quesillo',
        name: 'Quesillo canario',
        description: 'El flan isleño de toda la vida, con caramelo casero.',
        price: 5.5,
        imageUrl: 'https://picsum.photos/seed/quesillo/600/450',
        allergens: ['lactosa', 'huevo'],
      },
      {
        id: 'frangollo',
        name: 'Frangollo',
        description: 'Postre tradicional de millo con leche, limón y canela.',
        price: 5,
        imageUrl: 'https://picsum.photos/seed/frangollo/600/450',
        allergens: ['lactosa', 'gluten'],
      },
    ],
  },
]

/** A handful of highlighted dishes for the home page. */
export const FEATURED: MenuItem[] = [
  MENU[1].items[0], // cabra estofada
  MENU[1].items[1], // cherne
  MENU[0].items[1], // queso asado
  MENU[2].items[0], // quesillo
]

export const SEO_DESCRIPTION =
  'Cocina canaria de mercado en el Puerto de la Cruz. Reserva tu mesa en Restaurante El Drago y disfruta de producto local y recetas tradicionales.'

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

/** schema.org Restaurant structured data, shared across every page via the layout. */
export const RESTAURANT_SCHEMA: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: BUSINESS.name,
  description: SEO_DESCRIPTION,
  url: SITE_URL,
  telephone: BUSINESS.phone,
  email: BUSINESS.email,
  servesCuisine: ['Canaria', 'Mediterránea'],
  priceRange: '€€',
  acceptsReservations: true,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Calle Quintana 14',
    postalCode: '38400',
    addressLocality: 'Puerto de la Cruz',
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
