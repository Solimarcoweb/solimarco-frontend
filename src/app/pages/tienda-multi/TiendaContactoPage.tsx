import styles from './tiendaPages.module.css'
import { BusinessInfo } from '../../../shared/components/BusinessInfo'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { BUSINESS, HOURS, SITE_URL, TIENDA_TENANT_ID } from './tiendaData'

/** Contact / location page of the multi-page tienda site. */
export default function TiendaContactoPage() {
  usePageTracking(TIENDA_TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Contacto | El Rincón Canario"
        description={`Visítanos en ${BUSINESS.address} o llámanos al ${BUSINESS.phone}.`}
        canonicalUrl={`${SITE_URL}/contacto`}
      />

      <div className={styles.page}>
        <h1 className={styles.title}>Dónde estamos</h1>
      </div>

      <BusinessInfo
        address={BUSINESS.address}
        phone={BUSINESS.phone}
        email={BUSINESS.email}
        hours={HOURS}
        mapImageUrl="https://picsum.photos/seed/mapa-rincon-multi/1200/450"
      />
    </>
  )
}
