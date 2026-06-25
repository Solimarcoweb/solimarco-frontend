import styles from './ServicesList.module.css'

/** A single service offered by the business. */
export interface Service {
  id: string
  name: string
  description: string
  /** Display price string, e.g. "desde 39 €". */
  price?: string
  /** Estimated duration, e.g. "~45 min". */
  duration?: string
  /** Optional illustration or photo URL (lazy-loaded). */
  imageUrl?: string
}

export interface ServicesListProps {
  /** Full list of services to display. */
  services: Service[]
  /** Optional section heading override. */
  heading?: string
  /** Extra class for the root `<section>` (e.g. an alternating background). */
  className?: string
}

/** Renders one featured card (first item) in a wide layout, the rest in a 2-col grid below. */
function FeaturedCard({ service }: { service: Service }) {
  return (
    <article className={styles.featured} aria-labelledby={`svc-${service.id}`}>
      {service.imageUrl && (
        <img
          className={styles.featuredImage}
          src={service.imageUrl}
          alt=""
          loading="lazy"
          decoding="async"
          aria-hidden="true"
        />
      )}
      <div className={styles.featuredBody}>
        <h3 id={`svc-${service.id}`} className={styles.name}>
          {service.name}
        </h3>
        <p className={styles.description}>{service.description}</p>
        <div className={styles.meta}>
          {service.price && <span className={styles.price}>{service.price}</span>}
          {service.duration && <span className={styles.duration}>{service.duration}</span>}
        </div>
      </div>
    </article>
  )
}

/** Renders a compact service card for the secondary grid. */
function ServiceCard({ service }: { service: Service }) {
  return (
    <article className={styles.card} aria-labelledby={`svc-${service.id}`}>
      {service.imageUrl && (
        <img
          className={styles.cardImage}
          src={service.imageUrl}
          alt=""
          loading="lazy"
          decoding="async"
          aria-hidden="true"
        />
      )}
      <div className={styles.cardBody}>
        <h3 id={`svc-${service.id}`} className={styles.name}>
          {service.name}
        </h3>
        <p className={styles.description}>{service.description}</p>
        <div className={styles.meta}>
          {service.price && <span className={styles.price}>{service.price}</span>}
          {service.duration && <span className={styles.duration}>{service.duration}</span>}
        </div>
      </div>
    </article>
  )
}

/**
 * Asymmetric services grid: the first service gets a wide featured layout;
 * the rest fill a responsive 2-column grid. Mobile-first, CSS Modules.
 *
 * @param props.services - Full list of services to display.
 * @param props.heading - Optional section heading (default: "Nuestros servicios").
 * @returns A labelled section listing all services.
 */
export function ServicesList({
  services,
  heading = 'Nuestros servicios',
  className,
}: ServicesListProps) {
  const [first, ...rest] = services

  return (
    <section
      className={className ? `${styles.section} ${className}` : styles.section}
      aria-labelledby="services-heading"
    >
      <h2 id="services-heading" className={styles.heading}>
        {heading}
      </h2>

      {first && <FeaturedCard service={first} />}

      {rest.length > 0 && (
        <ul className={styles.grid} role="list">
          {rest.map((service) => (
            <li key={service.id}>
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
