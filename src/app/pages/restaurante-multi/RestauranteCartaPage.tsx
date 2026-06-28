import styles from './restaurantePages.module.css'
import { Menu } from '../../../shared/components/Menu'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useMenu } from '../../../core/tenant/useMenu'
import { toMenu } from '../../../core/tenant/tenantContentMappers'
import { RESTAURANTE_BASE_PATH } from '../restaurante-landing/restauranteShared'

/** Full menu page of the multi-page restaurant site. */
export default function RestauranteCartaPage() {
  const config = useTenantConfig()
  const menuState = useMenu()
  usePageTracking(config.tenantId)

  return (
    <>
      <SharedSeo
        title={`Carta | ${config.businessName}`}
        description={`Descubre la carta de ${config.businessName}.`}
        canonicalUrl={`${window.location.origin}${RESTAURANTE_BASE_PATH}/carta`}
      />

      <section className={styles.page} aria-labelledby="carta-title">
        <h1 id="carta-title" className={styles.title}>
          Nuestra carta
        </h1>

        {menuState.status === 'loading' && (
          <p className={styles.status} role="status">
            Cargando…
          </p>
        )}
        {menuState.status === 'error' && (
          <p className={styles.status} role="alert">
            No se ha podido cargar la carta.
          </p>
        )}
        {menuState.status === 'success' && <Menu categories={toMenu(menuState.data)} />}
      </section>
    </>
  )
}
