import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import styles from './ConstruccionFooter.module.css'
import type { TenantConfig } from '../../../../core/tenant/tenantConfig'
import { LEGAL_LINKS } from '../construccionShared'

interface ConstruccionFooterProps {
  /** Resolved tenant config (brand, contact, socials). */
  config: TenantConfig
}

const NAV = [
  { id: 'top', key: 'construccion.nav.home' },
  { id: 'servicios', key: 'construccion.nav.services' },
  { id: 'proyectos', key: 'construccion.nav.projects' },
  { id: 'showroom', key: 'construccion.nav.showroom' },
  { id: 'contacto', key: 'construccion.nav.contact' },
] as const

/** Short social labels, in display order. */
const SOCIAL_ORDER: { key: keyof NonNullable<TenantConfig['socialLinks']>; label: string }[] = [
  { key: 'facebook', label: 'f' },
  { key: 'instagram', label: 'ig' },
  { key: 'linkedin', label: 'in' },
  { key: 'youtube', label: 'yt' },
  { key: 'tiktok', label: 'tt' },
  { key: 'whatsapp', label: 'wa' },
]

/**
 * Sector-specific footer for the construccion landing: brand + contact,
 * in-page navigation, legal links (to the global `/legal/:slug` routes) and
 * social icons sourced from the tenant config.
 *
 * @param props.config - Tenant config.
 */
export default function ConstruccionFooter({ config }: ConstruccionFooterProps) {
  const { t } = useTranslation()
  const [firstWord, ...restWords] = config.businessName.split(' ')
  const rest = restWords.join(' ')
  const socials = SOCIAL_ORDER.filter((s) => config.socialLinks?.[s.key])
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <div className={styles.logo}>
            {firstWord}
            {rest && <span> {rest}</span>}
          </div>
          {config.businessDescription && (
            <p className={styles.desc}>{config.businessDescription}</p>
          )}
          <div className={styles.contact}>
            {config.phone && (
              <div className={styles.contactRow}>
                <span className={styles.dot} aria-hidden="true" />
                {config.phone}
              </div>
            )}
            {config.email && (
              <div className={styles.contactRow}>
                <span className={styles.dot} aria-hidden="true" />
                {config.email}
              </div>
            )}
            {config.address && (
              <div className={styles.contactRow}>
                <span className={styles.dot} aria-hidden="true" />
                {config.address}
              </div>
            )}
          </div>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>{t('construccion.nav.home')}</h4>
          {NAV.map((n) => (
            <a key={n.id} className={styles.link} href={`#${n.id}`}>
              {t(n.key)}
            </a>
          ))}
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Legal</h4>
          {LEGAL_LINKS.map((l) => (
            <Link key={l.href} className={styles.link} to={l.href}>
              {l.label}
            </Link>
          ))}
        </div>

        {socials.length > 0 && (
          <div className={styles.col}>
            <h4 className={styles.colTitle}>{t('construccion.footerFollow')}</h4>
            <div className={styles.socials}>
              {socials.map((s) => (
                <a
                  key={s.key}
                  className={styles.soc}
                  href={config.socialLinks?.[s.key]}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.key}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.bottom}>
        <span>
          {config.businessName} · {year} · {t('construccion.footerRights')}
        </span>
        <div className={styles.bottomLinks}>
          {LEGAL_LINKS.map((l) => (
            <Link key={l.href} className={styles.bottomLink} to={l.href}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
