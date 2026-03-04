interface Device {
  _id: string
  name: string
  imei: string
  type: string
  status: string
  userId?: { name: string; email: string }
  ip?: string
  firmware?: string
  lastSeen?: string
}

interface DeviceStats {
  total: number
  online: number
  offline: number
  inactive: number
}

export function useDevices() {
  const config = useRuntimeConfig()
  const { getAuthHeaders } = useAuth()
  const apiBase = config.public.apiBase

  const devices = ref<Device[]>([])
  const stats = ref<DeviceStats | null>(null)
  const loading = ref(false)
  const error = ref('')

  async function fetchDevices(params?: { status?: string; type?: string }) {
    loading.value = true
    error.value = ''
    try {
      const query = new URLSearchParams(params as Record<string, string>).toString()
      const url = `${apiBase}/api/devices${query ? '?' + query : ''}`
      const response = await $fetch<{ success: boolean; devices: Device[]; total: number }>(
        url,
        { headers: getAuthHeaders() }
      )
      devices.value = response.devices
    } catch (e: any) {
      error.value = e?.data?.error || 'Failed to fetch devices'
    } finally {
      loading.value = false
    }
  }

  async function fetchStats() {
    try {
      const response = await $fetch<{ success: boolean; data: DeviceStats }>(
        `${apiBase}/api/devices/stats`,
        { headers: getAuthHeaders() }
      )
      stats.value = response.data
    } catch {
      // silent
    }
  }

  async function sendCommand(deviceId: string, command: Record<string, unknown>) {
    return $fetch(`${apiBase}/api/devices/${deviceId}/command`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: command,
    })
  }

  return { devices, stats, loading, error, fetchDevices, fetchStats, sendCommand }
}
