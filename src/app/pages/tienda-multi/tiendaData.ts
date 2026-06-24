import type { BusinessHours } from '../../../shared/components/BusinessInfo'
import type { LegalLink } from '../../../shared/components/Footer'
import type { ProductItem } from '../../../modules/sales/models/product'

/** Tenant identifier for the tienda demo (El Rincón Canario). */
export const TIENDA_TENANT_ID = 'demo-rincon-canario'

/** Canonical site URL of the tenant. */
export const SITE_URL = 'https://www.elrinconcanario.es'

/** Base path of the multi-page tienda site. */
export const BASE_PATH = '/tienda-multi'

/** Real-looking business data for the demo (El Rincón Canario, Santa Cruz). */
export const BUSINESS = {
  name: 'El Rincón Canario',
  address: 'Calle del Castillo 58, 38001 Santa Cruz de Tenerife',
  phone: '+34 922 24 07 13',
  email: 'hola@elrinconcanario.es',
} as const

export const LEGAL_LINKS: LegalLink[] = [
  { label: 'Aviso legal', href: '/legal/aviso-legal' },
  { label: 'Política de privacidad', href: '/legal/privacidad' },
  { label: 'Política de cookies', href: '/legal/cookies' },
]

export const HOURS: BusinessHours[] = [
  { day: 'Lunes', open: '09:30', close: '20:00' },
  { day: 'Martes', open: '09:30', close: '20:00' },
  { day: 'Miércoles', open: '09:30', close: '20:00' },
  { day: 'Jueves', open: '09:30', close: '20:00' },
  { day: 'Viernes', open: '09:30', close: '20:30' },
  { day: 'Sábado', open: '10:00', close: '14:00' },
  { day: 'Domingo', open: '', close: '', closed: true },
]

export const PRODUCTS: ProductItem[] = [
  {
    id: 'mojo-rojo',
    name: 'Mojo rojo picón',
    description: 'Receta artesana con ají, pimiento rojo y comino. Perfecto con papas arrugadas.',
    price: 4.5,
    unit: 'tarro 200 g',
    category: 'Salsas y mojos',
    imageUrl: 'https://picsum.photos/seed/mojo-rojo/600/450',
    stock: 34,
  },
  {
    id: 'mojo-verde',
    name: 'Mojo verde cilantro',
    description: 'Con cilantro fresco, ajo y aceite de oliva virgen extra de las Islas.',
    price: 4.5,
    unit: 'tarro 200 g',
    category: 'Salsas y mojos',
    imageUrl: 'https://picsum.photos/seed/mojo-verde/600/450',
    stock: 28,
  },
  {
    id: 'mojo-palmero',
    name: 'Mojo palmero',
    description: 'Variante suave con pimiento palmero ahumado. El favorito de la isla.',
    price: 5.2,
    unit: 'tarro 200 g',
    category: 'Salsas y mojos',
    imageUrl: 'https://picsum.photos/seed/mojo-palmero/600/450',
    stock: 17,
  },
  {
    id: 'gofio-trigo',
    name: 'Gofio de trigo',
    description: 'Molido en molino de agua en el municipio de Garachico. Tostado medio.',
    price: 3.2,
    unit: 'bolsa 500 g',
    category: 'Gofio y cereales',
    imageUrl: 'https://picsum.photos/seed/gofio-trigo/600/450',
    stock: 52,
  },
  {
    id: 'gofio-millo',
    name: 'Gofio de millo',
    description: 'Maíz canario tostado de cultivo local. Base ideal para el escaldón.',
    price: 3.2,
    unit: 'bolsa 500 g',
    category: 'Gofio y cereales',
    imageUrl: 'https://picsum.photos/seed/gofio-millo/600/450',
    stock: 41,
  },
  {
    id: 'queso-majorero-tierno',
    name: 'Queso majorero tierno',
    description: 'DOP Queso Majorero. Elaborado con leche de cabra majorera en Fuerteventura.',
    price: 9.8,
    unit: 'pieza ≈500 g',
    category: 'Quesos',
    imageUrl: 'https://picsum.photos/seed/queso-majorero/600/450',
    stock: 12,
  },
  {
    id: 'queso-palmero-ahumado',
    name: 'Queso palmero ahumado',
    description: 'DOP Queso Palmero. Ahumado con cáscara de almendra y tunera. Intenso y cremoso.',
    price: 11.5,
    unit: 'pieza ≈400 g',
    category: 'Quesos',
    imageUrl: 'https://picsum.photos/seed/queso-palmero/600/450',
    stock: 8,
  },
  {
    id: 'vino-tinto-tacoronte',
    name: 'Vino tinto Tacoronte-Acentejo',
    description: 'DO Tacoronte-Acentejo, listán negro 100%. Roble 6 meses. Notas de frutos rojos.',
    price: 8.9,
    unit: 'botella 75 cl',
    category: 'Vinos',
    imageUrl: 'https://picsum.photos/seed/vino-tinto/600/450',
    stock: 24,
  },
  {
    id: 'vino-blanco-güímar',
    name: 'Vino blanco Valle de Güímar',
    description: 'DO Valle de Güímar, listán blanco. Fresco y afrutado, con ligera acidez mineral.',
    price: 7.5,
    unit: 'botella 75 cl',
    category: 'Vinos',
    imageUrl: 'https://picsum.photos/seed/vino-blanco/600/450',
    stock: 19,
  },
  {
    id: 'cesteria-palmera',
    name: 'Cestería palmera',
    description: 'Cesta tejida a mano con palma canaria por artesanas de Breña Alta, La Palma.',
    price: 32,
    unit: 'ud',
    category: 'Artesanía',
    imageUrl: 'https://picsum.photos/seed/cesteria/600/450',
    stock: 5,
  },
  {
    id: 'bordado-lagartera',
    name: 'Mantel bordado canario',
    description: 'Bordado tradicional calado a mano. Lino natural, 140 × 180 cm.',
    price: 58,
    unit: 'ud',
    category: 'Artesanía',
    imageUrl: 'https://picsum.photos/seed/bordado/600/450',
    stock: 3,
  },
]

/** A handful of highlighted products for the home page teaser. */
export const FEATURED_PRODUCTS: ProductItem[] = [
  PRODUCTS[0], // mojo rojo
  PRODUCTS[3], // gofio trigo
  PRODUCTS[5], // queso majorero
  PRODUCTS[7], // vino tinto
]

export const SEO_DESCRIPTION =
  'Tienda de productos típicos canarios en Santa Cruz de Tenerife. Mojos, gofio, quesos DOP, vinos de denominación de origen y artesanía local.'

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

/** schema.org Store structured data, shared across every page via the layout. */
export const STORE_SCHEMA: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: BUSINESS.name,
  description: SEO_DESCRIPTION,
  url: SITE_URL,
  telephone: BUSINESS.phone,
  email: BUSINESS.email,
  priceRange: '€€',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Calle del Castillo 58',
    postalCode: '38001',
    addressLocality: 'Santa Cruz de Tenerife',
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
