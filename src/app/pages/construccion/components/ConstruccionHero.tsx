import { useTranslation } from 'react-i18next'
import styles from './ConstruccionHero.module.css'
import type { TenantConfig } from '../../../../core/tenant/tenantConfig'
import { CONSTRUCCION_HERO_IMAGE, CONSTRUCCION_STATS } from '../construccionShared'

interface ConstruccionHeroProps {
  /** Resolved tenant config (brand name, description, hero image override). */
  config: TenantConfig
}

/**
 * Full-screen hero for the construccion landing: background photo with ken-burns
 * motion, scrim/glow/frame overlays, brand eyebrow, an animated-shine tagline,
 * two CTAs (quote + projects) and a stats band.
 *
 * @param props.config - Tenant config; `logoUrl`-less hero falls back to the
 *   sample sector image.
 */
export default function ConstruccionHero({ config }: ConstruccionHeroProps) {
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
          <a className={styles.btnGold} href="#contacto">
            {t('construccion.ctaRequestQuote')} <span className={styles.btnCircle}>→</span>
          </a>
          <a className={styles.btnOut} href="#proyectos">
            {t('construccion.heroViewProjects')} →
          </a>
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
