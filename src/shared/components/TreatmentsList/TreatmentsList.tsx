import styles from './TreatmentsList.module.css'

/** A single treatment or aesthetic service. */
export interface Treatment {
  id: string
  name: string
  description: string
  /** Display price string, e.g. "desde 45 €". */
  price: string
  /** Estimated session duration, e.g. "60 min". */
  duration: string
  /** Category label used to group treatments in the full list. */
  category: string
  /** Optional photo URL (lazy-loaded). */
  imageUrl?: string
}

export interface TreatmentsListProps {
  /** All treatments to display. */
  treatments: Treatment[]
  /** Optional section heading override. */
  heading?: string
}

/** Featured treatment: wide card with optional image, shown first in each category group. */
function FeaturedTreatment({ treatment }: { treatment: Treatment }) {
  return (
    <article className={styles.featured} aria-labelledby={`tr-${treatment.id}`}>
      {treatment.imageUrl && (
        <img
          className={styles.featuredImage}
          src={treatment.imageUrl}
          alt=""
          loading="lazy"
          decoding="async"
          aria-hidden="true"
        />
      )}
      <div className={styles.featuredBody}>
        <h3 id={`tr-${treatment.id}`} className={styles.name}>
          {treatment.name}
        </h3>
        <p className={styles.description}>{treatment.description}</p>
        <dl className={styles.meta}>
          <div className={styles.metaItem}>
            <dt className={styles.metaLabel}>Precio</dt>
            <dd className={styles.metaValue}>{treatment.price}</dd>
          </div>
          <div className={styles.metaItem}>
            <dt className={styles.metaLabel}>Duración</dt>
            <dd className={styles.metaValue}>{treatment.duration}</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}

/** Secondary treatment: compact row with hairline divider — editorial list style. */
function TreatmentRow({ treatment }: { treatment: Treatment }) {
  return (
    <li className={styles.row} aria-labelledby={`tr-${treatment.id}`}>
      <div className={styles.rowMain}>
        <h3 id={`tr-${treatment.id}`} className={styles.rowName}>
          {treatment.name}
        </h3>
        <p className={styles.rowDescription}>{treatment.description}</p>
      </div>
      <dl className={styles.rowMeta}>
        <div className={styles.metaItem}>
          <dt className={styles.metaLabel}>Precio</dt>
          <dd className={styles.metaValue}>{treatment.price}</dd>
        </div>
        <div className={styles.metaItem}>
          <dt className={styles.metaLabel}>Duración</dt>
          <dd className={styles.metaValue}>{treatment.duration}</dd>
        </div>
      </dl>
    </li>
  )
}

/** Groups treatments by category, preserving first-seen order. */
function groupByCategory(treatments: Treatment[]): Map<string, Treatment[]> {
  const groups = new Map<string, Treatment[]>()
  for (const t of treatments) {
    const current = groups.get(t.category) ?? []
    current.push(t)
    groups.set(t.category, current)
  }
  return groups
}

/**
 * Editorial-style treatments list for beauty/aesthetic sector tenants.
 * Groups treatments by category. The first treatment in each category gets a
 * featured card layout; the rest render as a hairline-divided list — avoiding
 * the three-equal-cards antipattern. Mobile-first, CSS Modules.
 *
 * @param props.treatments - All treatments to display.
 * @param props.heading - Optional section heading (default: "Tratamientos").
 * @returns A labelled section listing all treatments by category.
 */
export function TreatmentsList({ treatments, heading = 'Tratamientos' }: TreatmentsListProps) {
  const groups = [...groupByCategory(treatments).entries()]

  return (
    <section className={styles.section} aria-labelledby="treatments-heading">
      <h2 id="treatments-heading" className={styles.heading}>
        {heading}
      </h2>

      {groups.map(([category, items]) => {
        const [first, ...rest] = items
        return (
          <div key={category} className={styles.group}>
            <h3 className={styles.category}>{category}</h3>
            {first && <FeaturedTreatment treatment={first} />}
            {rest.length > 0 && (
              <ul className={styles.list} role="list">
                {rest.map((t) => (
                  <TreatmentRow key={t.id} treatment={t} />
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </section>
  )
}
