export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  host: process.env.HOST || '0.0.0.0',

  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ipptt',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  mqtt: {
    url: process.env.MQTT_URL || 'mqtt://localhost:1883',
    username: process.env.MQTT_USERNAME || '',
    password: process.env.MQTT_PASSWORD || '',
  },

  murmur: {
    restUrl: process.env.MURMUR_REST_URL || 'http://localhost:5000',
  },

  traccar: {
    url: process.env.TRACCAR_URL || 'http://localhost:8082',
    token: process.env.TRACCAR_TOKEN || '',
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
} as const
