import { useTranslation } from 'react-i18next'
import styles from './construccionPages.module.css'
import { ProjectGallery } from '../../../shared/components/ProjectGallery'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useProjects } from '../../../core/tenant/useProjects'
import { toProjects } from '../../../core/tenant/tenantContentMappers'
import { CONSTRUCCION_BASE_PATH } from '../construccion/construccionShared'

/** Projects/portfolio page of the multi-page construction site. */
export default function ConstruccionProyectosPage() {
  const { t } = useTranslation()
  const config = useTenantConfig()
  const projectsState = useProjects()
  usePageTracking(config.tenantId)

  return (
    <>
      <SharedSeo
        title={`Proyectos | ${config.businessName}`}
        description={`Obras y reformas realizadas por ${config.businessName}.`}
        canonicalUrl={`${window.location.origin}${CONSTRUCCION_BASE_PATH}/proyectos`}
      />

      <div className={styles.page}>
        <h1 className={styles.title}>{t('construccion.projectsHeading')}</h1>
      </div>

      {projectsState.status === 'loading' && (
        <p className={styles.status} role="status">
          {t('construccion.loading')}
        </p>
      )}
      {projectsState.status === 'error' && (
        <p className={styles.status} role="alert">
          {t('construccion.projectsError')}
        </p>
      )}
      {projectsState.status === 'success' && (
        <ProjectGallery items={toProjects(projectsState.data)} />
      )}
    </>
  )
}
