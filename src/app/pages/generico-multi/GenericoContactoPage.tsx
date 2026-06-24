import styles from './genericoPages.module.css'
import { BusinessInfo } from '../../../shared/components/BusinessInfo'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { BUSINESS, GENERICO_TENANT_ID, HOURS, SITE_URL } from './genericoData'

/** Contact / location page of the multi-page generic site. */
export default function GenericoContactoPage() {
  usePageTracking(GENERICO_TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Contacto | Servicios Profesionales Tenerife"
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
        mapImageUrl="https://picsum.photos/seed/mapa-servicios-tenerife/1200/450"
      />
    </>
  )
}
