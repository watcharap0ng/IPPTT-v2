import mongoose from 'mongoose'
import { config } from '../config/index.js'

export async function connectDB() {
  try {
    await mongoose.connect(config.mongodb.uri)
    console.log('MongoDB connected:', config.mongodb.uri)
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB error:', err)
  })

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected')
  })
}
