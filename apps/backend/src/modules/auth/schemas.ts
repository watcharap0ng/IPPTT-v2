import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).max(100),
  phone: z.string().optional(),
  nationalId: z.string().length(13).optional(),
})

export const refreshSchema = z.object({
  refreshToken: z.string(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type RefreshInput = z.infer<typeof refreshSchema>
