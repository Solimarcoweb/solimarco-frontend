import { useTranslation } from 'react-i18next'
import styles from './ConstruccionHero.module.css'
import ConstruccionLink from './ConstruccionLink'
import type { TenantConfig } from '../../../../core/tenant/tenantConfig'
import { CONSTRUCCION_HERO_IMAGE, CONSTRUCCION_STATS } from '../construccionShared'

interface ConstruccionHeroProps {
  /** Resolved tenant config (brand name, description, hero image override). */
  config: TenantConfig
  /** Quote CTA target: anchor (`#contacto`, landing) or route (`contacto`, multi). */
  quoteTo?: string
  /** Projects CTA target: anchor (`#proyectos`, landing) or route (`proyectos`, multi). */
  projectsTo?: string
}

/**
 * Full-screen hero for the construccion landing: background photo with ken-burns
 * motion, scrim/glow/frame overlays, brand eyebrow, an animated-shine tagline,
 * two CTAs (quote + projects) and a stats band.
 *
 * @param props.config - Tenant config; `logoUrl`-less hero falls back to the
 *   sample sector image.
 */
export default function ConstruccionHero({
  config,
  quoteTo = '#contacto',
  projectsTo = '#proyectos',
}: ConstruccionHeroProps) {
  const { t } = useTranslation()
  // SAMPLE - temporal hasta endpoint/personalización: no hay foto de hero por tenant todavía.
  const heroImage = CONSTRUCCION_HERO_IMAGE

  return (
    <section id="top" className={styles.hero}>
      <img className={styles.img} src={heroImage} alt="" aria-hidden="true" />
      <div className={styles.scrim} />
      <div className={styles.glow} />
      <div className={styles.frame} />

      <div className={styles.inner}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowBrand}>{config.businessName}</span>
          <span aria-hidden="true"> · </span>
          {t('construccion.heroEyebrow')}
        </div>
        <h1 className={styles.title}>
          <span className={styles.shine}>{t('construccion.heroTitle')}</span>
        </h1>
        {config.businessDescription && <p className={styles.sub}>{config.businessDescription}</p>}
        <div className={styles.actions}>
          <ConstruccionLink className={styles.btnGold} to={quoteTo}>
            {t('construccion.ctaRequestQuote')}
            <span className={styles.btnCircle} aria-hidden="true">
              <svg
                className={styles.btnCircleIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="12" x2="20" y2="12" />
                <polyline points="14 6 20 12 14 18" />
              </svg>
            </span>
          </ConstruccionLink>
          <ConstruccionLink className={styles.btnOut} to={projectsTo}>
            {t('construccion.heroViewProjects')} →
          </ConstruccionLink>
        </div>
      </div>

      <div className={styles.foot}>
        <div className={styles.stats}>
          {CONSTRUCCION_STATS.map((s) => (
            <div key={s.labelKey} className={styles.stat}>
              <div className={styles.statN}>{s.value}</div>
              <div className={styles.statL}>{t(s.labelKey)}</div>
            </div>
          ))}
        </div>
        <div className={styles.dots} aria-hidden="true">
          <span className={styles.dotOn} />
          <span />
          <span />
        </div>
      </div>
    </section>
  )
}
