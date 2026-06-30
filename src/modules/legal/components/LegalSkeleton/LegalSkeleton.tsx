import { useTranslation } from 'react-i18next'
import styles from './LegalSkeleton.module.css'

/** Varied line widths per simulated paragraph, to mimic real legal copy. */
const SKELETON_PARAGRAPHS: string[][] = [
  ['96%', '100%', '88%'],
  ['100%', '92%', '97%', '70%'],
  ['90%', '100%', '64%'],
]

/**
 * Standalone loading skeleton for legal pages: a title bar + paragraphs of
 * varied widths with a subtle shimmer, in the same reading column as the real
 * content (no layout shift on load). Colours derive from theme tokens
 * (`--color-text` for the blocks, `--legal-skeleton-shimmer` for the sweep), so
 * it adapts to the surrounding palette — dark/gold inside the construccion
 * chrome, light grey elsewhere.
 *
 * Tiny and dependency-free (no `LegalPageView`/DOMPurify), so it can be used
 * both as the lazy-chunk Suspense fallback and as the in-view loading state,
 * giving a single continuous skeleton across both phases. Announced via
 * `role="status"`; the bars themselves are decorative.
 */
export function LegalSkeleton() {
  const { t } = useTranslation()
  return (
    <div
      className={styles.column}
      role="status"
      aria-live="polite"
      aria-label={t('legal.loading')}
    >
      <div className={`${styles.sk} ${styles.skTitle}`} aria-hidden="true" />
      <div className={`${styles.sk} ${styles.skMeta}`} aria-hidden="true" />
      {SKELETON_PARAGRAPHS.map((lines, paragraph) => (
        <div key={paragraph} className={styles.skPara} aria-hidden="true">
          {lines.map((width, line) => (
            <div key={line} className={`${styles.sk} ${styles.skLine}`} style={{ width }} />
          ))}
        </div>
      ))}
    </div>
  )
}
