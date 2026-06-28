import { useTranslation } from 'react-i18next'
import styles from './ConstruccionContact.module.css'
import ConstruccionBudgetForm from './ConstruccionBudgetForm'
import type { BusinessHours } from '../../../../shared/components/BusinessInfo'
import type { TenantConfig } from '../../../../core/tenant/tenantConfig'

interface ConstruccionContactProps {
  /** Resolved tenant config (contact details, modules). */
  config: TenantConfig
  /** Weekly hours (already mapped via `toBusinessHours`). */
  hours: BusinessHours[]
}

/**
 * Contact section: business details + opening hours on the left, the
 * sector-local budget form (underline fields, dark/gold) on the right. The form
 * only renders when the tenant has the budget module enabled.
 *
 * @param props.config - Tenant config.
 * @param props.hours - Weekly hours to list.
 */
export default function ConstruccionContact({ config, hours }: ConstruccionContactProps) {
  const { t } = useTranslation()
  const showForm = config.modules?.hasBudgetForm !== false

  return (
    <section id="contacto" className={`${styles.section} ${styles.alt}`} aria-labelledby="construccion-contact-h">
      <div className={styles.grid}>
        <div className={styles.info}>
          <div className={styles.eyebrow}>{t('construccion.contactEyebrow')}</div>
          <h2 id="construccion-contact-h" className={styles.title}>
            {t('construccion.budgetHeading')}
          </h2>

          <ul className={styles.cinfo}>
            {config.address && (
              <li className={styles.cinfoRow}>
                <span className={styles.cinfoLine} aria-hidden="true" />
                <span className={styles.cinfoTxt}>{config.address}</span>
              </li>
            )}
            {config.phone && (
              <li className={styles.cinfoRow}>
                <span className={styles.cinfoLine} aria-hidden="true" />
                <a className={styles.cinfoTxt} href={`tel:${config.phone.replace(/\s+/g, '')}`}>
                  {config.phone}
                </a>
              </li>
            )}
            {config.email && (
              <li className={styles.cinfoRow}>
                <span className={styles.cinfoLine} aria-hidden="true" />
                <a className={styles.cinfoTxt} href={`mailto:${config.email}`}>
                  {config.email}
                </a>
              </li>
            )}
          </ul>

          {hours.length > 0 && (
            <div className={styles.schedWrap}>
              <div className={styles.eyebrow}>{t('construccion.scheduleHeading')}</div>
              <dl className={styles.sched}>
                {hours.map((h) => (
                  <div key={h.day} className={styles.schedRow}>
                    <dt className={styles.schedDay}>{t(`weekdays.${h.day}`, { defaultValue: h.day })}</dt>
                    <dd className={styles.schedTime}>
                      {h.closed || !h.open ? t('businessInfo.closed') : `${h.open} - ${h.close}`}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {showForm && (
          <div className={styles.formWrap}>
            <ConstruccionBudgetForm tenantId={config.tenantId} />
          </div>
        )}
      </div>
    </section>
  )
}
