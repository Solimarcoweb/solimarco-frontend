import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './RestauranteLandingPage.module.css'
import { Hero } from '../../../shared/components/Hero'
import { LanguageSelector } from '../../../shared/components/LanguageSelector'
import { Menu, type MenuCategory } from '../../../shared/components/Menu'
import { BusinessInfo, type BusinessHours } from '../../../shared/components/BusinessInfo'
import { Footer, type LegalLink } from '../../../shared/components/Footer'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { SharedSeo, SharedJsonLd } from '../../../shared/seo'
import { SUPPORTED_LOCALES } from '../../../i18n'
import { applyTheme } from '../../../themes'

/** Tenant identifier for the restaurant landing demo. */
const TENANT_ID = 'demo-restaurante'

/** Canonical site URL of the tenant; the restaurant page is the landing route. */
const PAGE_URL = 'https://www.pasterialaisla.es/'

/** Real-looking business data for the demo (Pastelería La Isla, Santa Cruz). */
const BUSINESS = {
  name: 'Pastelería La Isla',
  address: 'Calle del Castillo 32, 38002 Santa Cruz de Tenerife',
  phone: '+34 922 24 18 60',
  email: 'hola@pasterialaisla.es',
} as const

/** Maps Spanish day labels to schema.org day names for the opening-hours spec. */
const SCHEMA_DAY: Record<string, string> = {
  Lunes: 'Monday',
  Martes: 'Tuesday',
  Miércoles: 'Wednesday',
  Jueves: 'Thursday',
  Viernes: 'Friday',
  Sábado: 'Saturday',
  Domingo: 'Sunday',
}

const HOURS: BusinessHours[] = [
  { day: 'Lunes', open: '', close: '', closed: true },
  { day: 'Martes', open: '08:30', close: '20:00' },
  { day: 'Miércoles', open: '08:30', close: '20:00' },
  { day: 'Jueves', open: '08:30', close: '20:00' },
  { day: 'Viernes', open: '08:30', close: '20:30' },
  { day: 'Sábado', open: '09:00', close: '20:30' },
  { day: 'Domingo', open: '09:00', close: '14:00' },
]

const MENU: MenuCategory[] = [
  {
    id: 'tartas',
    name: 'Tartas',
    items: [
      {
        id: 'tarta-zanahoria',
        name: 'Tarta de zanahoria',
        description: 'Bizcocho especiado con nueces y frosting de queso crema.',
        price: 3.8,
        imageUrl: 'https://picsum.photos/seed/tarta-zanahoria/600/450',
        allergens: ['gluten', 'lactosa', 'frutos secos', 'huevo'],
      },
      {
        id: 'tarta-queso',
        name: 'Tarta de queso al horno',
        description: 'Receta vasca, cremosa por dentro y caramelizada por fuera.',
        price: 4.2,
        imageUrl: 'https://picsum.photos/seed/tarta-queso/600/450',
        allergens: ['lactosa', 'huevo'],
      },
    ],
  },
  {
    id: 'bolleria',
    name: 'Bollería',
    items: [
      {
        id: 'croissant',
        name: 'Croissant de mantequilla',
        description: 'Hojaldre artesano fermentado 24 horas.',
        price: 1.6,
        imageUrl: 'https://picsum.photos/seed/croissant/600/450',
        allergens: ['gluten', 'lactosa'],
      },
      {
        id: 'napolitana',
        name: 'Napolitana de chocolate',
        description: 'Rellena de chocolate negro 55%.',
        price: 1.9,
        imageUrl: 'https://picsum.photos/seed/napolitana/600/450',
        allergens: ['gluten', 'lactosa', 'soja'],
      },
    ],
  },
  {
    id: 'cafes',
    name: 'Cafés e infusiones',
    items: [
      {
        id: 'cortado',
        name: 'Cortado leche y leche',
        description: 'Especialidad canaria con leche condensada y café.',
        price: 1.4,
      },
      {
        id: 'barraquito',
        name: 'Barraquito',
        description: 'Café, leche condensada, licor 43, limón y canela.',
        price: 2.3,
        allergens: ['lactosa'],
      },
    ],
  },
]

const LEGAL_LINKS: LegalLink[] = [
  { label: 'Aviso legal', href: '/legal/aviso-legal' },
  { label: 'Política de privacidad', href: '/legal/privacidad' },
  { label: 'Política de cookies', href: '/legal/cookies' },
]

const SEO_DESCRIPTION =
  'Pastelería y cafetería artesana en el centro de Santa Cruz de Tenerife. Tartas, bollería recién hecha y café de especialidad canario.'

/** schema.org FoodEstablishment structured data, sharing the page's business data. */
const FOOD_ESTABLISHMENT_SCHEMA: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'FoodEstablishment',
  name: BUSINESS.name,
  description: SEO_DESCRIPTION,
  url: PAGE_URL,
  telephone: BUSINESS.phone,
  email: BUSINESS.email,
  servesCuisine: ['Pastelería', 'Cafetería'],
  priceRange: '€',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Calle del Castillo 32',
    postalCode: '38002',
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

/**
 * Landing page for the restaurant/hospitality sector (simple variant: no online
 * reservations or cart). Composes Hero → Menu → BusinessInfo → Footer under the
 * `calido` theme, with a minimal header, page-view tracking, SEO tags and
 * FoodEstablishment structured data. Demo tenant: Pastelería La Isla.
 */
export default function RestauranteLandingPage() {
  const { i18n } = useTranslation()

  useEffect(() => {
    applyTheme('calido')
  }, [])

  usePageTracking(TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Pastelería La Isla | Pastelería y cafetería en Santa Cruz de Tenerife"
        description={SEO_DESCRIPTION}
        canonicalUrl={PAGE_URL}
      />
      <SharedJsonLd schema={FOOD_ESTABLISHMENT_SCHEMA} />

      <header className={styles.header}>
        <span className={styles.brand}>{BUSINESS.name}</span>
        <LanguageSelector availableLocales={[...SUPPORTED_LOCALES]} currentLocale={i18n.language} />
      </header>

      <main>
        <Hero
          title="Pastelería La Isla"
          subtitle="Tartas, bollería artesana y café de especialidad en el centro de Santa Cruz de Tenerife"
          ctaLabel="Ver la carta"
          ctaHref="#carta"
          backgroundImage="https://picsum.photos/seed/pasteleria-la-isla/1600/900"
        />

        <section id="carta" className={styles.menuSection} aria-labelledby="carta-heading">
          <h2 id="carta-heading" className={styles.menuHeading}>
            Nuestra carta
          </h2>
          <Menu categories={MENU} />
        </section>

        <BusinessInfo
          address={BUSINESS.address}
          phone={BUSINESS.phone}
          email={BUSINESS.email}
          hours={HOURS}
          mapImageUrl="https://picsum.photos/seed/mapa-la-isla/1200/450"
        />
      </main>

      <Footer
        businessName={BUSINESS.name}
        address={BUSINESS.address}
        phone={BUSINESS.phone}
        email={BUSINESS.email}
        legalLinks={LEGAL_LINKS}
      />
    </>
  )
}
