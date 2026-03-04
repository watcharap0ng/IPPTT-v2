import mongoose, { Schema, type Document } from 'mongoose'

export interface IChannel {
  number: number
  name: string
  frequency?: string
  rxFrequency?: string
  txFrequency?: string
  colorCode?: number
  timeSlot?: number
  contactName?: string
}

export interface ITalkgroup extends Document {
  name: string
  description?: string
  channels: IChannel[]
  createdBy: mongoose.Types.ObjectId
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const channelSchema = new Schema<IChannel>(
  {
    number: { type: Number, required: true },
    name: { type: String, required: true },
    frequency: String,
    rxFrequency: String,
    txFrequency: String,
    colorCode: Number,
    timeSlot: Number,
    contactName: String,
  },
  { _id: false }
)

const talkgroupSchema = new Schema<ITalkgroup>(
  {
    name: { type: String, required: true, trim: true },
    description: String,
    channels: { type: [channelSchema], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

talkgroupSchema.index({ name: 1 })
talkgroupSchema.index({ createdBy: 1 })

export const Talkgroup = mongoose.model<ITalkgroup>('Talkgroup', talkgroupSchema)
