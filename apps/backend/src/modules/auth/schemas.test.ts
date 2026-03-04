import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema, refreshSchema } from './schemas.js'

describe('loginSchema', () => {
  it('validates correct login input', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    })
    expect(result.success).toBe(false)
  })

  it('rejects short password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '12345',
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing fields', () => {
    expect(loginSchema.safeParse({}).success).toBe(false)
    expect(loginSchema.safeParse({ email: 'test@example.com' }).success).toBe(false)
    expect(loginSchema.safeParse({ password: 'password123' }).success).toBe(false)
  })
})

describe('registerSchema', () => {
  it('validates correct registration input', () => {
    const result = registerSchema.safeParse({
      email: 'new@example.com',
      password: 'secure123',
      name: 'Test User',
    })
    expect(result.success).toBe(true)
  })

  it('validates with optional fields', () => {
    const result = registerSchema.safeParse({
      email: 'new@example.com',
      password: 'secure123',
      name: 'Test User',
      phone: '0891234567',
      nationalId: '1234567890123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects short name', () => {
    const result = registerSchema.safeParse({
      email: 'new@example.com',
      password: 'secure123',
      name: 'A',
    })
    expect(result.success).toBe(false)
  })

  it('rejects wrong nationalId length', () => {
    const result = registerSchema.safeParse({
      email: 'new@example.com',
      password: 'secure123',
      name: 'Test User',
      nationalId: '12345',
    })
    expect(result.success).toBe(false)
  })
})

describe('refreshSchema', () => {
  it('validates refresh token', () => {
    const result = refreshSchema.safeParse({ refreshToken: 'some-token-string' })
    expect(result.success).toBe(true)
  })

  it('rejects missing token', () => {
    const result = refreshSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})
