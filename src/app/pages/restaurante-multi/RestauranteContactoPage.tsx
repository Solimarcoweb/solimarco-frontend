import styles from './restaurantePages.module.css'
import { BusinessInfo } from '../../../shared/components/BusinessInfo'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { BUSINESS, HOURS, RESTAURANT_TENANT_ID, SITE_URL } from './restauranteData'

/** Contact page of the multi-page restaurant site: hours, contact and map. */
export default function RestauranteContactoPage() {
  usePageTracking(RESTAURANT_TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Contacto y horario | Restaurante El Drago"
        description="Horario, dirección y contacto de Restaurante El Drago en el Puerto de la Cruz, Tenerife."
        canonicalUrl={`${SITE_URL}/contacto`}
      />

      <div className={styles.pageHead}>
        <h1 className={styles.title}>Dónde estamos</h1>
      </div>

      <BusinessInfo
        address={BUSINESS.address}
        phone={BUSINESS.phone}
        email={BUSINESS.email}
        hours={HOURS}
        mapImageUrl="https://picsum.photos/seed/mapa-el-drago/1200/450"
      />
    </>
  )
}
