import { Link } from 'react-router'
import styles from './restaurantePages.module.css'
import { Hero } from '../../../shared/components/Hero'
import { Menu } from '../../../shared/components/Menu'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useMenu } from '../../../core/tenant/useMenu'
import { toMenu } from '../../../core/tenant/tenantContentMappers'
import { RESTAURANTE_BASE_PATH } from '../restaurante-landing/restauranteShared'

/**
 * Home page of the multi-page restaurant site: hero, a few highlighted dishes
 * and a call to action towards the reservations page.
 */
export default function RestauranteHomePage() {
  const config = useTenantConfig()
  const menuState = useMenu()
  usePageTracking(config.tenantId)

  // Up to four dishes flattened from the menu, in display order.
  const featured =
    menuState.status === 'success'
      ? toMenu(menuState.data)
          .flatMap((category) => category.items)
          .slice(0, 4)
      : []

  const canReserve = config.modules?.hasReservations !== false

  return (
    <>
      <SharedSeo
        title={`${config.businessName} | Restaurante`}
        description={config.businessDescription ?? config.businessName}
        canonicalUrl={`${window.location.origin}${RESTAURANTE_BASE_PATH}`}
      />

      <Hero
        title={config.businessName}
        subtitle={config.businessDescription ?? ''}
        ctaLabel="Ver los destacados"
        ctaHref="#destacados"
        logoUrl={config.logoUrl}
      />

      {featured.length > 0 && (
        <section id="destacados" className={styles.featured} aria-label="Platos destacados">
          <Menu categories={[{ id: 'destacados', name: 'Nuestros destacados', items: featured }]} />
          {canReserve && (
            <div className={styles.ctaWrap}>
              <Link to={`${RESTAURANTE_BASE_PATH}/reservas`} className={styles.cta}>
                Reservar mesa
              </Link>
            </div>
          )}
        </section>
      )}
    </>
  )
}
