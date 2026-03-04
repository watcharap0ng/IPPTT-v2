import { describe, it, expect } from 'vitest'
import { renderTemplate, extractVariables } from './template-engine.js'

describe('renderTemplate', () => {
  it('replaces variables', () => {
    const result = renderTemplate('Hello {{name}}, welcome to {{place}}!', {
      name: 'John',
      place: 'IPPTT',
    })
    expect(result).toBe('Hello John, welcome to IPPTT!')
  })

  it('keeps unmatched placeholders', () => {
    const result = renderTemplate('{{found}} and {{missing}}', { found: 'yes' })
    expect(result).toBe('yes and {{missing}}')
  })

  it('handles empty variables', () => {
    const result = renderTemplate('No vars here', {})
    expect(result).toBe('No vars here')
  })

  it('handles empty template', () => {
    const result = renderTemplate('', { key: 'value' })
    expect(result).toBe('')
  })

  it('replaces multiple occurrences', () => {
    const result = renderTemplate('{{x}} + {{x}} = {{x}}{{x}}', { x: '1' })
    expect(result).toBe('1 + 1 = 11')
  })
})

describe('extractVariables', () => {
  it('extracts variable names', () => {
    const vars = extractVariables('{{name}} at {{ip}}:{{port}}')
    expect(vars).toEqual(expect.arrayContaining(['name', 'ip', 'port']))
    expect(vars).toHaveLength(3)
  })

  it('deduplicates variables', () => {
    const vars = extractVariables('{{x}} + {{x}} + {{y}}')
    expect(vars).toHaveLength(2)
    expect(vars).toEqual(expect.arrayContaining(['x', 'y']))
  })

  it('returns empty for no variables', () => {
    const vars = extractVariables('plain text')
    expect(vars).toHaveLength(0)
  })
})
