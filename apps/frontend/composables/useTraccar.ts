interface TraccarDevice {
  id: number
  name: string
  uniqueId: string
  status: string
  lastUpdate: string
}

interface TraccarPosition {
  id: number
  deviceId: number
  latitude: number
  longitude: number
  speed: number
  course: number
  altitude: number
  fixTime: string
}

export function useTraccar() {
  const config = useRuntimeConfig()
  const { getAuthHeaders } = useAuth()
  const apiBase = config.public.apiBase

  const devices = ref<TraccarDevice[]>([])
  const positions = ref<TraccarPosition[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchDevices() {
    loading.value = true
    error.value = ''
    try {
      const response = await $fetch<{ success: boolean; data: TraccarDevice[] }>(
        `${apiBase}/api/tracking/devices`,
        { headers: getAuthHeaders() }
      )
      devices.value = response.data
    } catch (e: any) {
      error.value = e?.data?.error || 'Failed to fetch tracking devices'
    } finally {
      loading.value = false
    }
  }

  async function fetchPositions(deviceId?: number) {
    try {
      const query = deviceId ? `?deviceId=${deviceId}` : ''
      const response = await $fetch<{ success: boolean; data: TraccarPosition[] }>(
        `${apiBase}/api/tracking/positions${query}`,
        { headers: getAuthHeaders() }
      )
      positions.value = response.data
    } catch (e: any) {
      error.value = e?.data?.error || 'Failed to fetch positions'
    }
  }

  async function fetchRoute(deviceId: number, from: string, to: string) {
    const response = await $fetch<{ success: boolean; data: TraccarPosition[] }>(
      `${apiBase}/api/tracking/route?deviceId=${deviceId}&from=${from}&to=${to}`,
      { headers: getAuthHeaders() }
    )
    return response.data
  }

  return { devices, positions, loading, error, fetchDevices, fetchPositions, fetchRoute }
}
