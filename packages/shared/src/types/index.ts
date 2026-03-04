export interface User {
  _id: string
  email: string
  username: string
  role: UserRole
  nationalId?: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'admin' | 'operator' | 'user'

export interface Device {
  _id: string
  name: string
  imei: string
  type: DeviceType
  status: DeviceStatus
  userId?: string
  lastSeen?: Date
  createdAt: Date
  updatedAt: Date
}

export type DeviceType = 'radio' | 'gps-tracker' | 'iot-sensor'
export type DeviceStatus = 'online' | 'offline' | 'inactive'

export interface Talkgroup {
  _id: string
  name: string
  channelId: number
  description?: string
  members: string[]
  createdAt: Date
  updatedAt: Date
}

export interface TrackerPosition {
  deviceId: string
  latitude: number
  longitude: number
  speed: number
  course: number
  altitude: number
  timestamp: Date
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  limit: number
}
