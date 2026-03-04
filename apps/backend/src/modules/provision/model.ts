import mongoose, { Schema, type Document } from 'mongoose'

export interface IProvisionProfile extends Document {
  name: string
  description?: string
  deviceType: 'radio' | 'gps-tracker' | 'iot-sensor'
  template: string
  variables: Record<string, string>
  isActive: boolean
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export interface IProvisionLog extends Document {
  profileId: mongoose.Types.ObjectId
  deviceImei: string
  status: 'success' | 'failed'
  output?: string
  createdAt: Date
}

const provisionProfileSchema = new Schema<IProvisionProfile>(
  {
    name: { type: String, required: true, trim: true },
    description: String,
    deviceType: {
      type: String,
      enum: ['radio', 'gps-tracker', 'iot-sensor'],
      required: true,
    },
    template: { type: String, required: true },
    variables: { type: Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

const provisionLogSchema = new Schema<IProvisionLog>(
  {
    profileId: { type: Schema.Types.ObjectId, ref: 'ProvisionProfile', required: true },
    deviceImei: { type: String, required: true },
    status: { type: String, enum: ['success', 'failed'], required: true },
    output: String,
  },
  { timestamps: true }
)

provisionLogSchema.index({ profileId: 1 })
provisionLogSchema.index({ deviceImei: 1 })

export const ProvisionProfile = mongoose.model<IProvisionProfile>('ProvisionProfile', provisionProfileSchema)
export const ProvisionLog = mongoose.model<IProvisionLog>('ProvisionLog', provisionLogSchema)
