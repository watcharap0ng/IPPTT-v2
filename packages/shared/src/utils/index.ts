/**
 * Convert Buddhist Era year to Christian Era
 */
export function beToCe(beYear: number): number {
  return beYear - 543
}

/**
 * Convert Christian Era year to Buddhist Era
 */
export function ceToBe(ceYear: number): number {
  return ceYear + 543
}

/**
 * Validate Thai national ID (13 digits)
 */
export function validateNationalId(id: string): boolean {
  if (!/^\d{13}$/.test(id)) return false

  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(id[i]) * (13 - i)
  }
  const checkDigit = (11 - (sum % 11)) % 10
  return checkDigit === parseInt(id[12])
}

/**
 * Format date in Thai locale
 */
export function formatThaiDate(date: Date): string {
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
