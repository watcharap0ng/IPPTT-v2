import mqtt from 'mqtt'
import { config } from '../../config/index.js'
import { Device } from './model.js'

let client: mqtt.MqttClient | null = null

export function getMqttClient(): mqtt.MqttClient | null {
  return client
}

export async function initMqttClient() {
  const { url, username, password } = config.mqtt

  client = mqtt.connect(url, {
    username: username || undefined,
    password: password || undefined,
    protocolVersion: 5,
    reconnectPeriod: 5000,
  })

  client.on('connect', () => {
    console.log('MQTT connected:', url)

    // Subscribe to device status topics
    client!.subscribe('ipptt/devices/+/status', { qos: 1 })
    client!.subscribe('ipptt/gps/+/position', { qos: 0 })
  })

  client.on('message', async (topic, payload) => {
    try {
      const data = JSON.parse(payload.toString())
      const parts = topic.split('/')

      if (parts[1] === 'devices' && parts[3] === 'status') {
        const imei = parts[2]
        await Device.findOneAndUpdate(
          { imei },
          {
            status: data.status || 'online',
            lastSeen: new Date(),
            ip: data.ip,
            firmware: data.firmware,
          },
          { upsert: false }
        )
      }
    } catch (err) {
      console.error('MQTT message parse error:', err)
    }
  })

  client.on('error', (err) => {
    console.error('MQTT error:', err)
  })

  return client
}

export function publishCommand(imei: string, command: Record<string, unknown>) {
  if (!client) throw { statusCode: 503, message: 'MQTT not connected' }
  client.publish(
    `ipptt/devices/${imei}/command`,
    JSON.stringify(command),
    { qos: 1 }
  )
}
