import { useTranslation } from 'react-i18next'

/**
 * Shown while a lazily-loaded route module is being fetched, so navigations
 * never render a blank page (good for Core Web Vitals / perceived performance).
 */
export function RouteFallback() {
  const { t } = useTranslation()
  return <p>{t('common.loading')}</p>
}
