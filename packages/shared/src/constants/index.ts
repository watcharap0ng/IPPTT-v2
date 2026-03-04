export const USER_ROLES = ['admin', 'operator', 'user'] as const
export const DEVICE_TYPES = ['radio', 'gps-tracker', 'iot-sensor'] as const
export const DEVICE_STATUSES = ['online', 'offline', 'inactive'] as const

export const MQTT_TOPICS = {
  DEVICE_STATUS: 'ipptt/devices/+/status',
  DEVICE_COMMAND: 'ipptt/devices/+/command',
  GPS_POSITION: 'ipptt/gps/+/position',
  VOICE_EVENT: 'ipptt/voice/+/event',
} as const

export const API_ROUTES = {
  AUTH: '/api/auth',
  USERS: '/api/users',
  DEVICES: '/api/devices',
  VOICE: '/api/voice',
  TRACKING: '/api/tracking',
  TALKGROUPS: '/api/talkgroups',
} as const
