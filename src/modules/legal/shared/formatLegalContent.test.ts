import { describe, expect, it } from 'vitest'
import { formatLegalContent } from './formatLegalContent'

describe('formatLegalContent', () => {
  it('wraps plain-text blocks (blank-line separated) in paragraphs', () => {
    const result = formatLegalContent('Uno.\n\nDos.')
    expect(result.notice).toBeNull()
    expect(result.bodyHtml).toBe('<p>Uno.</p><p>Dos.</p>')
  })

  it('collapses single newlines within a block to spaces', () => {
    expect(formatLegalContent('Línea uno\nlínea dos').bodyHtml).toBe('<p>Línea uno línea dos</p>')
  })

  it('lifts a leading [disclaimer] into notice', () => {
    const result = formatLegalContent('[Plantilla base]\n\nTexto real.')
    expect(result.notice).toBe('Plantilla base')
    expect(result.bodyHtml).toBe('<p>Texto real.</p>')
  })

  it('lifts a disclaimer already wrapped in a paragraph', () => {
    const result = formatLegalContent('<p>[Aviso]</p><p>Cuerpo</p>')
    expect(result.notice).toBe('Aviso')
    expect(result.bodyHtml).toBe('<p>Cuerpo</p>')
  })

  it('passes through existing block HTML untouched', () => {
    expect(formatLegalContent('<h2>T</h2><p>Body</p>').bodyHtml).toBe('<h2>T</h2><p>Body</p>')
  })

  it('escapes HTML-significant characters in plain text', () => {
    expect(formatLegalContent('a < b & c').bodyHtml).toBe('<p>a &lt; b &amp; c</p>')
  })

  it('returns an empty body for blank content', () => {
    expect(formatLegalContent('   ').bodyHtml).toBe('')
    expect(formatLegalContent('   ').notice).toBeNull()
  })
})
