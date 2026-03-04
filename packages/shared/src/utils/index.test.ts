import { describe, it, expect } from 'vitest'
import { beToCe, ceToBe, validateNationalId, formatThaiDate } from './index.js'

describe('beToCe', () => {
  it('converts Buddhist Era to Christian Era', () => {
    expect(beToCe(2569)).toBe(2026)
    expect(beToCe(2543)).toBe(2000)
    expect(beToCe(2500)).toBe(1957)
  })
})

describe('ceToBe', () => {
  it('converts Christian Era to Buddhist Era', () => {
    expect(ceToBe(2026)).toBe(2569)
    expect(ceToBe(2000)).toBe(2543)
    expect(ceToBe(1957)).toBe(2500)
  })
})

describe('validateNationalId', () => {
  it('rejects IDs that are not 13 digits', () => {
    expect(validateNationalId('123')).toBe(false)
    expect(validateNationalId('12345678901234')).toBe(false)
    expect(validateNationalId('abcdefghijklm')).toBe(false)
    expect(validateNationalId('')).toBe(false)
  })

  it('accepts valid checksum', () => {
    expect(validateNationalId('1100700000001')).toBe(true)
  })

  it('rejects invalid checksum', () => {
    // Same ID but last digit changed
    expect(validateNationalId('1100700000002')).toBe(false)
  })

  it('rejects all-zero ID', () => {
    expect(validateNationalId('0000000000000')).toBe(false)
  })
})

describe('formatThaiDate', () => {
  it('formats date in Thai locale', () => {
    const date = new Date('2026-03-04T00:00:00Z')
    const formatted = formatThaiDate(date)
    // Should contain Buddhist year 2569
    expect(formatted).toContain('2569')
  })
})
