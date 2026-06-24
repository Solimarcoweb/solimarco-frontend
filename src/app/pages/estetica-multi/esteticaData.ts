import type { BusinessHours } from '../../../shared/components/BusinessInfo'
import type { LegalLink } from '../../../shared/components/Footer'
import type { Treatment } from '../../../shared/components/TreatmentsList'
import type { Service } from '../../../shared/components/ServicesList'

/** Tenant identifier for the estetica demo (Centro Estético Magnolia). */
export const ESTETICA_TENANT_ID = 'demo-magnolia'

/** Canonical site URL of the tenant. */
export const SITE_URL = 'https://www.centroestéticomagnolia.es'

/** Base path of the multi-page estetica site. */
export const BASE_PATH = '/estetica-multi'

/** Real-looking business data for the demo (Centro Estético Magnolia, Puerto de la Cruz). */
export const BUSINESS = {
  name: 'Centro Estético Magnolia',
  address: 'Calle Blanco 12, 38400 Puerto de la Cruz, Tenerife',
  phone: '+34 922 37 14 88',
  email: 'hola@centromagnolia.es',
} as const

export const LEGAL_LINKS: LegalLink[] = [
  { label: 'Aviso legal', href: '/legal/aviso-legal' },
  { label: 'Política de privacidad', href: '/legal/privacidad' },
  { label: 'Política de cookies', href: '/legal/cookies' },
]

export const HOURS: BusinessHours[] = [
  { day: 'Lunes', open: '', close: '', closed: true },
  { day: 'Martes', open: '10:00', close: '20:00' },
  { day: 'Miércoles', open: '10:00', close: '20:00' },
  { day: 'Jueves', open: '10:00', close: '20:00' },
  { day: 'Viernes', open: '10:00', close: '20:00' },
  { day: 'Sábado', open: '10:00', close: '15:00' },
  { day: 'Domingo', open: '', close: '', closed: true },
]

export const TREATMENTS: Treatment[] = [
  // Tratamientos faciales
  {
    id: 'hidratacion-profunda',
    name: 'Hidratación facial profunda',
    description:
      'Tratamiento intensivo con ácido hialurónico, vitamina C y extracto de rosa mosqueta. Devuelve la luminosidad y calma pieles sensibilizadas.',
    price: 'desde 55 €',
    duration: '60 min',
    category: 'Tratamientos faciales',
    imageUrl: 'https://picsum.photos/seed/magnolia-facial/800/600',
  },
  {
    id: 'lifting-contorno',
    name: 'Lifting de contorno facial',
    description:
      'Reafirmante de mandíbula y cuello con radiofrecuencia monopolar y masaje drenante. Resultados visibles desde la primera sesión.',
    price: '80 €',
    duration: '75 min',
    category: 'Tratamientos faciales',
  },
  {
    id: 'peeling-quimico',
    name: 'Peeling químico suave',
    description:
      'Exfoliación con ácido láctico al 30 % para renovar la textura y unificar el tono. Apto para pieles mixtas y grasas.',
    price: '65 €',
    duration: '45 min',
    category: 'Tratamientos faciales',
  },
  {
    id: 'mesoterapia-vitaminas',
    name: 'Mesoterapia vitamínica',
    description:
      'Microinyecciones de cóctel vitamínico (C, E, B12) para nutrición e hidratación profunda.',
    price: '90 €',
    duration: '50 min',
    category: 'Tratamientos faciales',
  },
  // Tratamientos corporales
  {
    id: 'drenaje-linfatico',
    name: 'Drenaje linfático manual',
    description:
      'Técnica Vodder para mejorar la circulación, reducir la retención de líquidos y aliviar la pesadez de piernas.',
    price: 'desde 50 €',
    duration: '60 min',
    category: 'Tratamientos corporales',
    imageUrl: 'https://picsum.photos/seed/magnolia-drenaje/800/600',
  },
  {
    id: 'envolturas-algas',
    name: 'Envoltura de algas marinas',
    description:
      'Remineralización con algas atlánticas, efecto reafirmante y detoxificante. Complemento ideal para tratamientos anticelulíticos.',
    price: '60 €',
    duration: '50 min',
    category: 'Tratamientos corporales',
  },
  {
    id: 'masaje-relajante',
    name: 'Masaje relajante corporal',
    description:
      'Masaje sueco de espalda, piernas y brazos. Aceites esenciales de lavanda y bergamota.',
    price: '45 €',
    duration: '50 min',
    category: 'Tratamientos corporales',
  },
  // Manicura y pedicura
  {
    id: 'manicura-semipermanente',
    name: 'Manicura semipermanente',
    description:
      'Limado, cutículas y esmaltado semipermanente con 3 semanas de duración garantizada.',
    price: '28 €',
    duration: '45 min',
    category: 'Manicura y pedicura',
    imageUrl: 'https://picsum.photos/seed/magnolia-manicura/800/600',
  },
  {
    id: 'pedicura-spa',
    name: 'Pedicura spa',
    description:
      'Baño de pies con sales del Pacífico, exfoliación, hidratación con manteca de karité y esmaltado.',
    price: '38 €',
    duration: '60 min',
    category: 'Manicura y pedicura',
  },
  // Depilación
  {
    id: 'depilacion-laser',
    name: 'Depilación láser diodo',
    description:
      'Tecnología de diodo 808 nm apta para todos los fototipos. Sesiones individuales o bono de 6.',
    price: 'desde 30 €',
    duration: '20–60 min',
    category: 'Depilación',
    imageUrl: 'https://picsum.photos/seed/magnolia-laser/800/600',
  },
  {
    id: 'depilacion-cera',
    name: 'Depilación con cera caliente',
    description:
      'Cera de alta adherencia para zonas delicadas. Acabado suave de hasta 4 semanas.',
    price: 'desde 12 €',
    duration: '15–45 min',
    category: 'Depilación',
  },
]

/** Services shaped for AppointmentForm's service selector. */
export const APPOINTMENT_SERVICES: Service[] = TREATMENTS.map((t) => ({
  id: t.id,
  name: `${t.name} — ${t.duration}`,
  description: t.description,
  price: t.price,
  duration: t.duration,
  imageUrl: t.imageUrl,
}))

/** Featured treatments for the home page teaser (one per category). */
export const FEATURED_TREATMENTS: Treatment[] = [
  TREATMENTS[0], // hidratación facial
  TREATMENTS[4], // drenaje linfático
  TREATMENTS[7], // manicura semipermanente
  TREATMENTS[9], // depilación láser
]

export const SEO_DESCRIPTION =
  'Centro estético en Puerto de la Cruz, Tenerife. Tratamientos faciales, corporales, manicura, pedicura y depilación láser. Pide cita online.'

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

/** schema.org BeautySalon structured data, shared across every page via the layout. */
export const BEAUTY_SALON_SCHEMA: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'BeautySalon',
  name: BUSINESS.name,
  description: SEO_DESCRIPTION,
  url: SITE_URL,
  telephone: BUSINESS.phone,
  email: BUSINESS.email,
  priceRange: '€€',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Calle Blanco 12',
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
