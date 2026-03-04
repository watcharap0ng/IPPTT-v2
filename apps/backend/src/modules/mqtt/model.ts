import mongoose, { Schema, type Document } from 'mongoose'

export interface IDevice extends Document {
  name: string
  imei: string
  type: 'radio' | 'gps-tracker' | 'iot-sensor'
  status: 'online' | 'offline' | 'inactive'
  userId?: mongoose.Types.ObjectId
  ip?: string
  firmware?: string
  lastSeen?: Date
  metadata: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

const deviceSchema = new Schema<IDevice>(
  {
    name: { type: String, required: true, trim: true },
    imei: { type: String, required: true, unique: true, trim: true },
    type: {
      type: String,
      enum: ['radio', 'gps-tracker', 'iot-sensor'],
      default: 'radio',
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'inactive'],
      default: 'offline',
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    ip: String,
    firmware: String,
    lastSeen: Date,
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
)

deviceSchema.index({ imei: 1 })
deviceSchema.index({ status: 1 })
deviceSchema.index({ userId: 1 })

export const Device = mongoose.model<IDevice>('Device', deviceSchema)
