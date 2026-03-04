<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth'],
})

const { devices, positions, loading, error, fetchDevices, fetchPositions } = useTraccar()
const selectedDevice = ref<number | null>(null)
const mapReady = ref(false)

onMounted(async () => {
  await fetchDevices()
  await fetchPositions()
  mapReady.value = true
})

watch(selectedDevice, async (id) => {
  if (id !== null) {
    await fetchPositions(id)
  } else {
    await fetchPositions()
  }
})
</script>

<template>
  <div class="flex h-[calc(100vh-4rem)]">
    <!-- Sidebar -->
    <div class="w-72 shrink-0 overflow-y-auto border-r p-4">
      <h2 class="mb-4 text-lg font-semibold">GPS Trackers</h2>

      <button
        class="mb-2 w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
        :class="{ 'bg-accent': selectedDevice === null }"
        @click="selectedDevice = null"
      >
        All Devices
      </button>

      <div v-for="device in devices" :key="device.id" class="mb-1">
        <button
          class="w-full rounded-md px-3 py-2 text-left transition-colors hover:bg-accent"
          :class="{ 'bg-accent border-primary': selectedDevice === device.id }"
          @click="selectedDevice = device.id"
        >
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">{{ device.name }}</span>
            <span
              class="h-2 w-2 rounded-full"
              :class="device.status === 'online' ? 'bg-green-500' : 'bg-gray-300'"
            />
          </div>
          <p class="text-xs text-muted-foreground">{{ device.uniqueId }}</p>
        </button>
      </div>

      <div v-if="devices.length === 0 && !loading" class="py-4 text-center text-sm text-muted-foreground">
        No tracking devices found
      </div>
    </div>

    <!-- Map -->
    <div class="relative flex-1">
      <div v-if="error" class="absolute left-4 top-4 z-10 rounded-md bg-destructive/90 px-3 py-2 text-sm text-white">
        {{ error }}
      </div>

      <div v-if="!mapReady" class="flex h-full items-center justify-center text-muted-foreground">
        Loading map...
      </div>

      <client-only>
        <TrackingLeafletMap
          v-if="mapReady"
          :positions="positions"
          :devices="devices"
          class="h-full w-full"
        />
      </client-only>
    </div>
  </div>
</template>
