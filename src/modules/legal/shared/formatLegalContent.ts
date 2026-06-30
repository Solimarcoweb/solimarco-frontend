/** Result of {@link formatLegalContent}: an optional leading notice + body HTML. */
export interface FormattedLegal {
  /** Leading bracketed disclaimer (e.g. "Plantilla base…"), or null if absent. */
  notice: string | null
  /** Body as HTML ready to sanitise + inject. */
  bodyHtml: string
}

/** Detects whether the content already contains block-level HTML. */
const BLOCK_TAG = /<(?:p|h[1-6]|ul|ol|li|div|section|article|table|br)\b/i
/** Leading `[disclaimer]` as plain text. */
const LEADING_BRACKET = /^\s*\[([^\]]*)\]\s*/
/** Leading `[disclaimer]` already wrapped in a single paragraph. */
const LEADING_BRACKET_P = /^\s*<p>\s*\[([^\]]*)\]\s*<\/p>\s*/i

/** Escapes the HTML-significant characters of plain text. */
function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * Prepares backend legal content for display. Handles both shapes:
 *
 * - **Plain text** (current backend): splits on blank lines into `<p>` blocks,
 *   collapsing single newlines within a block to spaces, with the text escaped.
 * - **HTML** (future-proof): passed through untouched (it is sanitised by the
 *   caller with DOMPurify regardless).
 *
 * In both shapes, a leading bracketed disclaimer (`[…]`, optionally already in a
 * `<p>`) is lifted out into {@link FormattedLegal.notice} so the caller can show
 * it as a separate callout instead of inline.
 *
 * NOTE: ideally the backend would emit structured HTML directly; this dual
 * handling keeps the current plain-text contract working in the meantime.
 *
 * @param raw - Raw `content` string from the legal endpoint.
 * @returns The extracted notice and the body HTML.
 */
export function formatLegalContent(raw: string): FormattedLegal {
  const text = raw.trim()

  let notice: string | null = null
  let rest = text
  const inParagraph = text.match(LEADING_BRACKET_P)
  const asText = text.match(LEADING_BRACKET)
  if (inParagraph) {
    notice = inParagraph[1].trim()
    rest = text.slice(inParagraph[0].length)
  } else if (asText) {
    notice = asText[1].trim()
    rest = text.slice(asText[0].length)
  }
  rest = rest.trim()

  if (rest === '') {
    return { notice, bodyHtml: '' }
  }

  // Already HTML → leave it for the sanitiser.
  if (BLOCK_TAG.test(rest)) {
    return { notice, bodyHtml: rest }
  }

  // Plain text → paragraphs. Prefer blank-line boundaries; fall back to single
  // newlines when the text has none.
  const blocks = rest.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean)
  const source = blocks.length > 0 ? blocks : rest.split(/\n/)
  const bodyHtml = source
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${escapeHtml(block).replace(/\s*\n\s*/g, ' ')}</p>`)
    .join('')

  return { notice, bodyHtml }
}
