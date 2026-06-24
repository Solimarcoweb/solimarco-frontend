import type { Preview } from '@storybook/react-vite'
import { I18nextProvider } from 'react-i18next'
import { createI18nInstance } from '../src/i18n/config'

/** Storybook-wide i18n instance — Spanish so story labels match the app defaults. */
const storybookI18n = createI18nInstance('es')

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },

  decorators: [
    (Story) => (
      <I18nextProvider i18n={storybookI18n}>
        <Story />
      </I18nextProvider>
    ),
  ],
}

export default preview
