import { useTranslation } from 'react-i18next'
import { SharedSeo } from '../../shared/seo'

/**
 * Placeholder home page for the public web-frontend shell.
 * Real per-tenant content (hero, services, contact...) will replace this
 * once the corresponding `modules/` are built (see CLAUDE.md section 12).
 */
export default function HomePage() {
  const { t } = useTranslation()

  return (
    <main>
      <SharedSeo title="Solimar&Co." description="Solimar&Co. platform" />
      <h1>{t('nav.home')}</h1>
    </main>
  )
}
