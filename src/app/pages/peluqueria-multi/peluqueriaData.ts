import type { BusinessHours } from '../../../shared/components/BusinessInfo'
import type { LegalLink } from '../../../shared/components/Footer'
import type { Service } from '../../../shared/components/ServicesList'

/** Tenant identifier for the peluqueria demo (Brisa Atlántica). */
export const PELUQUERIA_TENANT_ID = 'demo-brisa-atlantica'

/** Canonical site URL of the tenant. */
export const SITE_URL = 'https://www.peluqueriabrisaatlantica.es'

/** Base path of the multi-page peluqueria site. */
export const BASE_PATH = '/peluqueria-multi'

/** Real-looking business data for the demo (Peluquería Brisa Atlántica, Los Cristianos). */
export const BUSINESS = {
  name: 'Peluquería Brisa Atlántica',
  address: 'Avenida Juan Carlos I 23, 38650 Los Cristianos, Tenerife',
  phone: '+34 922 79 05 44',
  email: 'hola@brisaatlantica.es',
} as const

export const LEGAL_LINKS: LegalLink[] = [
  { label: 'Aviso legal', href: '/legal/aviso-legal' },
  { label: 'Política de privacidad', href: '/legal/privacidad' },
  { label: 'Política de cookies', href: '/legal/cookies' },
]

export const HOURS: BusinessHours[] = [
  { day: 'Lunes', open: '', close: '', closed: true },
  { day: 'Martes', open: '09:30', close: '19:30' },
  { day: 'Miércoles', open: '09:30', close: '19:30' },
  { day: 'Jueves', open: '09:30', close: '19:30' },
  { day: 'Viernes', open: '09:30', close: '19:30' },
  { day: 'Sábado', open: '09:00', close: '15:00' },
  { day: 'Domingo', open: '', close: '', closed: true },
]

export const SERVICES: Service[] = [
  {
    id: 'corte-mujer',
    name: 'Corte y peinado mujer',
    description:
      'Corte personalizado con consulta de imagen, lavado, secado y acabado. Incluye masaje capilar.',
    price: 'desde 28 €',
    duration: '~60 min',
    imageUrl: 'https://picsum.photos/seed/corte-mujer/800/600',
  },
  {
    id: 'corte-hombre',
    name: 'Corte hombre',
    description:
      'Corte clásico o moderno con navaja o tijera, lavado y secado. Incluye perfilado de barba.',
    price: 'desde 18 €',
    duration: '~30 min',
    imageUrl: 'https://picsum.photos/seed/corte-hombre/800/600',
  },
  {
    id: 'coloracion-completa',
    name: 'Coloración completa',
    description:
      'Tinte permanente o demi-permanente de toda la cabeza con las mejores marcas del mercado. Sin amoníaco disponible.',
    price: 'desde 45 €',
    duration: '~90 min',
    imageUrl: 'https://picsum.photos/seed/coloracion/800/600',
  },
  {
    id: 'mechas-balayage',
    name: 'Mechas y balayage',
    description:
      'Técnica de aclarado degradado, balayage californiano o mechas babylights. Resultado natural y luminoso.',
    price: 'desde 65 €',
    duration: '~120 min',
    imageUrl: 'https://picsum.photos/seed/balayage/800/600',
  },
  {
    id: 'tratamiento-keratina',
    name: 'Tratamiento de keratina',
    description:
      'Alisado progresivo con keratina vegetal. Elimina el frizz, añade brillo y facilita el peinado durante meses.',
    price: 'desde 80 €',
    duration: '~150 min',
    imageUrl: 'https://picsum.photos/seed/keratina/800/600',
  },
  {
    id: 'hidratacion-capilar',
    name: 'Tratamiento de hidratación',
    description:
      'Mascarilla nutritiva de queratina y aceite de argán, aplicada con calor para potenciar la absorción.',
    price: '35 €',
    duration: '~45 min',
    imageUrl: 'https://picsum.photos/seed/hidratacion-pelo/800/600',
  },
  {
    id: 'peinado-recogido',
    name: 'Peinado y recogido',
    description:
      'Peinados para bodas, comuniones, celebraciones y eventos. Prueba incluida para novias.',
    price: 'desde 40 €',
    duration: '~60 min',
    imageUrl: 'https://picsum.photos/seed/peinado-recogido/800/600',
  },
]

/** Services shaped for AppointmentForm's service selector. */
export const APPOINTMENT_SERVICES: Service[] = SERVICES.map((s) => ({
  ...s,
  name: `${s.name} — ${s.duration}`,
}))

/** Highlighted services for the home page teaser. */
export const FEATURED_SERVICES: Service[] = [
  SERVICES[0], // corte mujer
  SERVICES[2], // coloración
  SERVICES[4], // keratina
]

export const SEO_DESCRIPTION =
  'Peluquería en Los Cristianos, Tenerife. Corte, color, mechas, keratina, tratamientos capilares y peinados para eventos. Pide cita online.'

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

/** schema.org HairSalon structured data, shared across every page via the layout. */
export const HAIR_SALON_SCHEMA: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'HairSalon',
  name: BUSINESS.name,
  description: SEO_DESCRIPTION,
  url: SITE_URL,
  telephone: BUSINESS.phone,
  email: BUSINESS.email,
  priceRange: '€€',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Avenida Juan Carlos I 23',
    postalCode: '38650',
    addressLocality: 'Los Cristianos',
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
