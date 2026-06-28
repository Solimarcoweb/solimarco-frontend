import { useTranslation } from 'react-i18next'
import styles from './construccionPages.module.css'
import ConstruccionPageHero from '../construccion/components/ConstruccionPageHero'
import ConstruccionProjects from '../construccion/components/ConstruccionProjects'
import ConstruccionCta from '../construccion/components/ConstruccionCta'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useProjects } from '../../../core/tenant/useProjects'
import { toProjects } from '../../../core/tenant/tenantContentMappers'
import { CONSTRUCCION_BASE_PATH, CONSTRUCCION_PAGE_IMAGES } from '../construccion/construccionShared'

/** Projects page of the redesigned multi-page construccion site. */
export default function ConstruccionProyectosPage() {
  const { t } = useTranslation()
  const config = useTenantConfig()
  const projectsState = useProjects()
  usePageTracking(config.tenantId)

  return (
    <>
      <SharedSeo
        title={`${t('construccion.nav.projects')} | ${config.businessName}`}
        description={`${t('construccion.projectsIntro')}`}
        canonicalUrl={`${window.location.origin}${CONSTRUCCION_BASE_PATH}/proyectos`}
      />

      <ConstruccionPageHero
        eyebrow={t('construccion.projectsEyebrow')}
        title={t('construccion.projectsHeading')}
        subtitle={t('construccion.projectsIntro')}
        image={CONSTRUCCION_PAGE_IMAGES.projects}
      />

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
        <ConstruccionProjects projects={toProjects(projectsState.data)} showHead={false} />
      )}

      <ConstruccionCta to="contacto" />
    </>
  )
}
