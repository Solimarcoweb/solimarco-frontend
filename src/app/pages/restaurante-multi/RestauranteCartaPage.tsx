import styles from './restaurantePages.module.css'
import { Menu } from '../../../shared/components/Menu'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { MENU, RESTAURANT_TENANT_ID, SITE_URL } from './restauranteData'

/** Full menu page of the multi-page restaurant site. */
export default function RestauranteCartaPage() {
  usePageTracking(RESTAURANT_TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Carta | Restaurante El Drago"
        description="Descubre la carta de Restaurante El Drago: entrantes, principales y postres de cocina canaria tradicional en el Puerto de la Cruz."
        canonicalUrl={`${SITE_URL}/carta`}
      />

      <section className={styles.page} aria-labelledby="carta-title">
        <h1 id="carta-title" className={styles.title}>
          Nuestra carta
        </h1>
        <Menu categories={MENU} />
      </section>
    </>
  )
}
