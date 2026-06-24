import styles from './peluqueriaPages.module.css'
import { BusinessInfo } from '../../../shared/components/BusinessInfo'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { BUSINESS, HOURS, PELUQUERIA_TENANT_ID, SITE_URL } from './peluqueriaData'

/** Contact / location page of the multi-page peluqueria site. */
export default function PeluqueriaContactoPage() {
  usePageTracking(PELUQUERIA_TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Contacto | Peluquería Brisa Atlántica"
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
        mapImageUrl="https://picsum.photos/seed/mapa-brisa-multi/1200/450"
      />
    </>
  )
}
