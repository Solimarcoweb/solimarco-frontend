import { useTranslation } from 'react-i18next'
import styles from './construccionPages.module.css'
import ConstruccionHero from '../construccion/components/ConstruccionHero'
import ConstruccionServices from '../construccion/components/ConstruccionServices'
import ConstruccionProjects from '../construccion/components/ConstruccionProjects'
import ConstruccionMaterials from '../construccion/components/ConstruccionMaterials'
import ConstruccionCta from '../construccion/components/ConstruccionCta'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useServices } from '../../../core/tenant/useServices'
import { useProjects } from '../../../core/tenant/useProjects'
import { toProjects, toServices } from '../../../core/tenant/tenantContentMappers'
import { CONSTRUCCION_BASE_PATH } from '../construccion/construccionShared'

/** Home page of the redesigned multi-page construccion site. */
export default function ConstruccionHomePage() {
  const { t } = useTranslation()
  const config = useTenantConfig()
  const servicesState = useServices()
  const projectsState = useProjects()
  usePageTracking(config.tenantId)

  if (servicesState.status !== 'success' || projectsState.status !== 'success') {
    const failed = servicesState.status === 'error' || projectsState.status === 'error'
    return (
      <p className={styles.status} role={failed ? 'alert' : 'status'}>
        {failed ? t('construccion.loadError') : t('construccion.loading')}
      </p>
    )
  }

  const services = toServices(servicesState.data)
  const projects = toProjects(projectsState.data)

  return (
    <>
      <SharedSeo
        title={`${config.businessName} | Construcción y reformas`}
        description={config.businessDescription ?? config.businessName}
        canonicalUrl={`${window.location.origin}${CONSTRUCCION_BASE_PATH}`}
      />

      <ConstruccionHero config={config} quoteTo="contacto" projectsTo="proyectos" />
      <ConstruccionServices services={services} limit={4} viewAllTo="servicios" />
      <ConstruccionProjects projects={projects} limit={3} viewAllTo="proyectos" />
      <ConstruccionMaterials />
      <ConstruccionCta to="contacto" />
    </>
  )
}
