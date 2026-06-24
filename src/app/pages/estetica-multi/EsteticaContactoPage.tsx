import styles from './esteticaPages.module.css'
import { BusinessInfo } from '../../../shared/components/BusinessInfo'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { BUSINESS, ESTETICA_TENANT_ID, HOURS, SITE_URL } from './esteticaData'

/** Contact / location page of the multi-page estetica site. */
export default function EsteticaContactoPage() {
  usePageTracking(ESTETICA_TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Contacto | Centro Estético Magnolia"
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
        mapImageUrl="https://picsum.photos/seed/mapa-magnolia-multi/1200/450"
      />
    </>
  )
}
