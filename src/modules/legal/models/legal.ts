/** A published legal page (privacy, cookies, legal notice...) for a tenant. */
export interface LegalPage {
  /** URL slug identifying the page, e.g. "privacidad". */
  slug: string
  /** Human-readable page title, rendered as the H1. */
  title: string
  /** Page body as trusted HTML produced by our own backend (not user input). */
  content: string
  /** ISO-8601 timestamp of the last publication/update. */
  updatedAt: string
}
