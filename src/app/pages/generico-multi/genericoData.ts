import type { BusinessHours } from '../../../shared/components/BusinessInfo'
import type { LegalLink } from '../../../shared/components/Footer'
import type { Service } from '../../../shared/components/ServicesList'

/** Tenant identifier for the generic business demo. */
export const GENERICO_TENANT_ID = 'demo-generico'

/** Canonical site URL of the tenant. */
export const SITE_URL = 'https://www.serviciostenerife.es'

/** Base path of the multi-page generic site. */
export const BASE_PATH = '/generico-multi'

/** Real-looking business data for the demo (Servicios Profesionales Tenerife). */
export const BUSINESS = {
  name: 'Servicios Profesionales Tenerife',
  address: 'Calle Méndez Núñez 38, 38003 Santa Cruz de Tenerife',
  phone: '+34 922 28 61 40',
  email: 'info@serviciostenerife.es',
} as const

export const LEGAL_LINKS: LegalLink[] = [
  { label: 'Aviso legal', href: '/legal/aviso-legal' },
  { label: 'Política de privacidad', href: '/legal/privacidad' },
  { label: 'Política de cookies', href: '/legal/cookies' },
]

export const HOURS: BusinessHours[] = [
  { day: 'Lunes', open: '08:30', close: '18:00' },
  { day: 'Martes', open: '08:30', close: '18:00' },
  { day: 'Miércoles', open: '08:30', close: '18:00' },
  { day: 'Jueves', open: '08:30', close: '18:00' },
  { day: 'Viernes', open: '08:30', close: '15:00' },
  { day: 'Sábado', open: '', close: '', closed: true },
  { day: 'Domingo', open: '', close: '', closed: true },
]

export const SERVICES: Service[] = [
  {
    id: 'consultoria',
    name: 'Consultoría y asesoramiento',
    description:
      'Análisis de tu situación actual, identificación de áreas de mejora y hoja de ruta personalizada. Primera consulta gratuita de 30 minutos.',
    price: 'desde 60 €/h',
    duration: 'flexible',
    imageUrl: 'https://picsum.photos/seed/consultoria/800/600',
  },
  {
    id: 'gestion-proyectos',
    name: 'Gestión de proyectos',
    description:
      'Planificación, seguimiento y entrega de proyectos dentro de plazo y presupuesto. Metodología ágil o en cascada según el contexto.',
    price: 'desde 800 €/proyecto',
    duration: 'según alcance',
    imageUrl: 'https://picsum.photos/seed/gestion/800/600',
  },
  {
    id: 'tramitaciones',
    name: 'Tramitaciones y gestiones',
    description:
      'Gestión de licencias, permisos, registros y documentación ante organismos públicos. Seguimiento personalizado hasta la resolución.',
    price: 'desde 120 €',
    duration: 'variable',
    imageUrl: 'https://picsum.photos/seed/tramites/800/600',
  },
  {
    id: 'formacion',
    name: 'Formación y talleres',
    description:
      'Cursos presenciales y online para equipos. Temáticas a medida según las necesidades del cliente. Grupos reducidos para mayor aprovechamiento.',
    price: 'desde 200 €/sesión',
    duration: '2–8 h',
    imageUrl: 'https://picsum.photos/seed/formacion/800/600',
  },
  {
    id: 'auditoria',
    name: 'Auditoría y diagnóstico',
    description:
      'Revisión exhaustiva de procesos, sistemas o documentación. Informe de conclusiones y plan de acción incluidos.',
    price: 'desde 350 €',
    duration: '1–3 días',
    imageUrl: 'https://picsum.photos/seed/auditoria/800/600',
  },
  {
    id: 'soporte',
    name: 'Soporte y mantenimiento',
    description:
      'Servicio de soporte continuo con tiempo de respuesta garantizado. Planes mensuales adaptados al volumen de incidencias.',
    price: 'desde 150 €/mes',
    duration: 'continuo',
    imageUrl: 'https://picsum.photos/seed/soporte/800/600',
  },
]

/** Highlighted services for the home page teaser. */
export const FEATURED_SERVICES: Service[] = [SERVICES[0], SERVICES[1], SERVICES[2]]

export const SEO_DESCRIPTION =
  'Servicios profesionales en Santa Cruz de Tenerife: consultoría, gestión de proyectos, tramitaciones, formación y auditoría. Solicita presupuesto sin compromiso.'

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

/** schema.org LocalBusiness structured data, shared across every page via the layout. */
export const LOCAL_BUSINESS_SCHEMA: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: BUSINESS.name,
  description: SEO_DESCRIPTION,
  url: SITE_URL,
  telephone: BUSINESS.phone,
  email: BUSINESS.email,
  priceRange: '€€',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Calle Méndez Núñez 38',
    postalCode: '38003',
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
