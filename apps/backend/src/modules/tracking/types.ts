export interface TraccarDevice {
  id: number
  name: string
  uniqueId: string
  status: string
  lastUpdate: string
  positionId: number
  groupId: number
}

export interface TraccarPosition {
  id: number
  deviceId: number
  latitude: number
  longitude: number
  speed: number
  course: number
  altitude: number
  fixTime: string
  serverTime: string
  attributes: Record<string, unknown>
}

export interface TraccarGeofence {
  id: number
  name: string
  description: string
  area: string
}
