import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Vitest globals are disabled, so Testing Library's automatic afterEach cleanup
// is not registered for us. Unmount rendered trees between tests manually to
// avoid leaking DOM nodes across cases in the same file.
afterEach(() => {
  cleanup()
})
