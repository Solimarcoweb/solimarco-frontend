import styles from './BusinessInfo.module.css'

/** Opening hours for a single day. */
export interface BusinessHours {
  /** Day label, e.g. "Lunes". */
  day: string
  /** Opening time in 24h "HH:MM" format. */
  open: string
  /** Closing time in 24h "HH:MM" format. */
  close: string
  /** When true, the business is closed that day (open/close are ignored). */
  closed?: boolean
}

export interface BusinessInfoProps {
  /** Postal address (single line or comma-separated). */
  address: string
  /** Contact phone in human-readable form; also used for the `tel:` link. */
  phone: string
  /** Contact email; also used for the `mailto:` link. */
  email: string
  /** Opening hours, one entry per day. */
  hours: BusinessHours[]
  /** Optional static map image URL (lazy-loaded, no third-party script). */
  mapImageUrl?: string
}

/**
 * Builds a `tel:` href from a human-readable phone string, keeping a leading `+`.
 */
function toTelHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

/**
 * Business information block: opening hours, contact details and an optional
 * static map. Mobile-first. The contact details live in a semantic `<address>`
 * and each day's hours use `<time>` elements; the same data shape feeds the
 * schema.org `openingHoursSpecification` built by the page.
 *
 * @param props.address - Postal address of the business.
 * @param props.phone - Contact phone (also used for the `tel:` link).
 * @param props.email - Contact email (also used for the `mailto:` link).
 * @param props.hours - Opening hours, one entry per day.
 * @param props.mapImageUrl - Optional static map image URL.
 * @returns The business-info section element.
 */
export function BusinessInfo({ address, phone, email, hours, mapImageUrl }: BusinessInfoProps) {
  return (
    <section className={styles.info} aria-labelledby="business-info-title">
      <h2 id="business-info-title" className={styles.title}>
        Dónde encontrarnos
      </h2>

      <div className={styles.grid}>
        <div className={styles.col}>
          <h3 className={styles.colTitle}>Horario</h3>
          <ul className={styles.hours}>
            {hours.map((entry) => (
              <li key={entry.day} className={styles.hoursRow}>
                <span className={styles.day}>{entry.day}</span>
                {entry.closed ? (
                  <span className={styles.closed}>Cerrado</span>
                ) : (
                  <span className={styles.range}>
                    <time dateTime={entry.open}>{entry.open}</time>
                    <span aria-hidden="true"> – </span>
                    <time dateTime={entry.close}>{entry.close}</time>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h3 className={styles.colTitle}>Contacto</h3>
          {/* Semantic contact details of the business itself. */}
          <address className={styles.address}>
            <p className={styles.addressLine}>{address}</p>
            <a className={styles.contactLink} href={toTelHref(phone)}>
              {phone}
            </a>
            <a className={styles.contactLink} href={`mailto:${email}`}>
              {email}
            </a>
          </address>
        </div>
      </div>

      {mapImageUrl && (
        <figure className={styles.mapFigure}>
          <img
            className={styles.map}
            src={mapImageUrl}
            alt={`Mapa de la ubicación de ${address}`}
            loading="lazy"
            decoding="async"
          />
        </figure>
      )}
    </section>
  )
}
