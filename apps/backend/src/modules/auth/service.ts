import type { FastifyInstance } from 'fastify'
import { User, type IUser } from '../users/model.js'
import type { LoginInput, RegisterInput } from './schemas.js'
import crypto from 'node:crypto'

export class AuthService {
  constructor(private app: FastifyInstance) {}

  async register(input: RegisterInput) {
    const existing = await User.findOne({ email: input.email })
    if (existing) {
      throw { statusCode: 409, message: 'Email already registered' }
    }

    const user = await User.create({
      ...input,
      provider: 'local',
    })

    return this.generateTokens(user)
  }

  async login(input: LoginInput) {
    const user = await User.findOne({ email: input.email }).select('+password +refreshTokens')
    if (!user || !user.password) {
      throw { statusCode: 401, message: 'Invalid credentials' }
    }

    const valid = await user.comparePassword(input.password)
    if (!valid) {
      throw { statusCode: 401, message: 'Invalid credentials' }
    }

    return this.generateTokens(user)
  }

  async refresh(refreshToken: string) {
    const user = await User.findOne({
      refreshTokens: refreshToken,
    }).select('+refreshTokens')

    if (!user) {
      throw { statusCode: 401, message: 'Invalid refresh token' }
    }

    // Rotate: remove old, add new
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken)
    const tokens = await this.generateTokens(user)

    return tokens
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await User.updateOne(
        { _id: userId },
        { $pull: { refreshTokens: refreshToken } }
      )
    } else {
      // Logout all sessions
      await User.updateOne(
        { _id: userId },
        { $set: { refreshTokens: [] } }
      )
    }
  }

  private async generateTokens(user: IUser) {
    const accessToken = this.app.jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      { expiresIn: '15m' }
    )

    const refreshToken = crypto.randomBytes(40).toString('hex')

    // Save refresh token
    await User.updateOne(
      { _id: user._id },
      { $push: { refreshTokens: refreshToken } }
    )

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }
  }
}
