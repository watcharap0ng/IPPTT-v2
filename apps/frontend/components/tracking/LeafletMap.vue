<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from 'vue'

interface Position {
  deviceId: number
  latitude: number
  longitude: number
  speed: number
  course: number
  fixTime: string
}

interface Device {
  id: number
  name: string
  status: string
}

const props = defineProps<{
  positions: Position[]
  devices: Device[]
}>()

let map: any = null
let markers: Map<number, any> = new Map()
let L: any = null

onMounted(async () => {
  // Dynamic import — Leaflet is client-only
  L = await import('leaflet')
  await import('leaflet/dist/leaflet.css')

  const el = document.getElementById('map-container')
  if (!el) return

  map = L.map(el).setView([13.7563, 100.5018], 10) // Bangkok default

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map)

  updateMarkers()
})

watch(() => props.positions, updateMarkers, { deep: true })

function updateMarkers() {
  if (!map || !L) return

  // Clear existing
  markers.forEach((m) => map.removeLayer(m))
  markers.clear()

  const bounds: [number, number][] = []

  props.positions.forEach((pos) => {
    const device = props.devices.find((d) => d.id === pos.deviceId)
    const name = device?.name || `Device ${pos.deviceId}`

    const marker = L.marker([pos.latitude, pos.longitude])
      .addTo(map)
      .bindPopup(`
        <strong>${name}</strong><br/>
        Speed: ${pos.speed.toFixed(1)} km/h<br/>
        ${new Date(pos.fixTime).toLocaleString()}
      `)

    markers.set(pos.deviceId, marker)
    bounds.push([pos.latitude, pos.longitude])
  })

  if (bounds.length > 0) {
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
  }
}

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <div id="map-container" class="h-full w-full" />
</template>
