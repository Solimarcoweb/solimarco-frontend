import { useTranslation } from 'react-i18next'
import styles from './ConstruccionMaterials.module.css'
import { CONSTRUCCION_MATERIALS } from '../construccionShared'

/**
 * Showroom / premium materials section. Brand tiles + a descriptive note.
 *
 * SAMPLE - temporal hasta endpoint/personalización: las marcas vienen de
 * {@link CONSTRUCCION_MATERIALS}; cuando exista contrato de backend se migra.
 */
export default function ConstruccionMaterials() {
  const { t } = useTranslation()

  return (
    <section id="showroom" className={`${styles.section} ${styles.alt}`} aria-labelledby="construccion-materials-h">
      <div className={styles.inner}>
        <div className={styles.eyebrow}>{t('construccion.materialsEyebrow')}</div>
        <h2 id="construccion-materials-h" className={styles.title}>
          {t('construccion.materialsHeading')}
        </h2>

        <div className={styles.grid}>
          {CONSTRUCCION_MATERIALS.map((m) => (
            <div key={m.name} className={styles.tile}>
              <div className={styles.cap}>
                <div className={styles.name}>{m.name}</div>
                <div className={styles.detail}>{m.detail}</div>
              </div>
            </div>
          ))}
        </div>

        <p className={styles.note}>{t('construccion.materialsNote')}</p>
      </div>
    </section>
  )
}
