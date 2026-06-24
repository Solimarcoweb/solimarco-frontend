import styles from './mecanicoPages.module.css'
import { BusinessInfo } from '../../../shared/components/BusinessInfo'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { BUSINESS, HOURS, MECANICO_TENANT_ID, SITE_URL } from './mecanicoData'

/** Contact / location page of the multi-page mechanic site. */
export default function MecanicoContactoPage() {
  usePageTracking(MECANICO_TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Contacto | Taller Mecánico El Teide"
        description={`Contacta con el Taller Mecánico El Teide en La Laguna. Llámanos al ${BUSINESS.phone} o escríbenos a ${BUSINESS.email}.`}
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
        mapImageUrl="https://picsum.photos/seed/mapa-el-teide-multi/1200/450"
      />
    </>
  )
}
