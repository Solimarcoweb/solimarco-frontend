import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './RestauranteLandingPage.module.css'
import { Hero } from '../../../shared/components/Hero'
import { LanguageSelector } from '../../../shared/components/LanguageSelector'
import { Menu } from '../../../shared/components/Menu'
import { BusinessInfo } from '../../../shared/components/BusinessInfo'
import { Footer } from '../../../shared/components/Footer'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { SharedSeo, SharedJsonLd } from '../../../shared/seo'
import { SUPPORTED_LOCALES } from '../../../i18n'
import { applyTheme } from '../../../themes'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useBusinessHours } from '../../../core/tenant/useBusinessHours'
import { useMenu } from '../../../core/tenant/useMenu'
import { toBusinessHours, toMenu } from '../../../core/tenant/tenantContentMappers'
import { RESTAURANTE_THEME, LEGAL_LINKS, buildRestaurantSchema } from './restauranteShared'

/**
 * Single-page (landing) restaurant template, driven entirely by tenant data:
 * branding/contact from `useTenantConfig`, the menu from `useMenu` and the
 * opening hours from `useBusinessHours`. Sections: Hero → Carta → Horario +
 * Contacto → Footer. Renders a loading/error state until the content endpoints
 * resolve.
 */
export default function RestauranteLandingPage() {
  const { i18n } = useTranslation()
  const config = useTenantConfig()
  const menuState = useMenu()
  const hoursState = useBusinessHours()

  useEffect(() => {
    applyTheme(config.themeName || RESTAURANTE_THEME)
  }, [config.themeName])

  usePageTracking(config.tenantId)

  if (menuState.status !== 'success' || hoursState.status !== 'success') {
    const failed = menuState.status === 'error' || hoursState.status === 'error'
    return (
      <main className={styles.status}>
        {failed ? (
          <p role="alert">No se ha podido cargar el contenido. Inténtalo de nuevo en unos minutos.</p>
        ) : (
          <p role="status">Cargando…</p>
        )}
      </main>
    )
  }

  const menu = toMenu(menuState.data)
  const hours = toBusinessHours(hoursState.data)
  const canonicalUrl = `${window.location.origin}/`

  return (
    <>
      <SharedSeo
        title={`${config.businessName} | Restaurante`}
        description={config.businessDescription ?? config.businessName}
        canonicalUrl={canonicalUrl}
      />
      <SharedJsonLd schema={buildRestaurantSchema(config, canonicalUrl)} />

      <header className={styles.header}>
        <span className={styles.brand}>{config.businessName}</span>
        <LanguageSelector availableLocales={[...SUPPORTED_LOCALES]} currentLocale={i18n.language} />
      </header>

      <main>
        <Hero
          title={config.businessName}
          subtitle={config.businessDescription ?? ''}
          ctaLabel="Ver la carta"
          ctaHref="#carta"
          logoUrl={config.logoUrl}
        />

        {menu.length > 0 && (
          <section
            id="carta"
            className={`${styles.menuSection} ${styles.sectionAlt}`}
            aria-labelledby="carta-heading"
          >
            <h2 id="carta-heading" className={styles.menuHeading}>
              Nuestra carta
            </h2>
            <Menu categories={menu} />
          </section>
        )}

        <BusinessInfo
          address={config.address ?? ''}
          phone={config.phone ?? ''}
          email={config.email ?? ''}
          hours={hours}
        />
      </main>

      <Footer
        className={styles.sectionAlt}
        businessName={config.businessName}
        address={config.address ?? ''}
        phone={config.phone ?? ''}
        email={config.email ?? ''}
        legalLinks={LEGAL_LINKS}
      />
    </>
  )
}
