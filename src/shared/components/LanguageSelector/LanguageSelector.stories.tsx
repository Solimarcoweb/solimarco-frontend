import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { createI18nInstance } from '../../../i18n'
import { LanguageSelector } from './LanguageSelector'

const i18nInstance = createI18nInstance('es')

const meta = {
  title: 'Shared/LanguageSelector',
  component: LanguageSelector,
  decorators: [
    (Story) => (
      <I18nextProvider i18n={i18nInstance}>
        <Story />
      </I18nextProvider>
    ),
  ],
} satisfies Meta<typeof LanguageSelector>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The four supported locales, starting on Spanish. The active option is
 * highlighted; selecting another updates it (state kept locally in the story).
 */
export const Default: Story = {
  args: {
    availableLocales: ['es', 'en', 'de', 'fr'],
    currentLocale: 'es',
  },
  render: (args) => {
    const [locale, setLocale] = useState(args.currentLocale)

    return (
      <LanguageSelector
        availableLocales={args.availableLocales}
        currentLocale={locale}
        onLocaleChange={setLocale}
      />
    )
  },
}
