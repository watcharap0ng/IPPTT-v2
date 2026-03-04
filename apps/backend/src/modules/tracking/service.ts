import { config } from '../../config/index.js'

const TRACCAR_URL = config.traccar.url
const TRACCAR_TOKEN = config.traccar.token

async function fetchTraccar(path: string, options?: RequestInit) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (TRACCAR_TOKEN) {
    headers['Authorization'] = `Bearer ${TRACCAR_TOKEN}`
  }

  const response = await fetch(`${TRACCAR_URL}/api${path}`, {
    ...options,
    headers: { ...headers, ...options?.headers },
  })

  if (!response.ok) {
    throw { statusCode: response.status, message: `Traccar error: ${response.statusText}` }
  }
  return response.json()
}

export class TrackingService {
  async getDevices() {
    return fetchTraccar('/devices')
  }

  async getPositions(deviceId?: number) {
    const query = deviceId ? `?deviceId=${deviceId}` : ''
    return fetchTraccar(`/positions${query}`)
  }

  async getDevice(id: number) {
    const devices = await fetchTraccar(`/devices?id=${id}`)
    if (!devices.length) throw { statusCode: 404, message: 'Device not found' }
    return devices[0]
  }

  async getGeofences() {
    return fetchTraccar('/geofences')
  }

  async getRoute(deviceId: number, from: string, to: string) {
    return fetchTraccar(`/positions?deviceId=${deviceId}&from=${from}&to=${to}`)
  }

  async getHealth() {
    try {
      await fetchTraccar('/server')
      return { status: 'ok' }
    } catch {
      return { status: 'error' }
    }
  }
}
