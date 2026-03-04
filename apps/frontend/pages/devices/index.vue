<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth'],
})

const { devices, stats, loading, error, fetchDevices, fetchStats } = useDevices()
const filter = ref('')

onMounted(() => {
  fetchDevices()
  fetchStats()
})

const filteredDevices = computed(() => {
  if (!filter.value) return devices.value
  return devices.value.filter((d) =>
    d.name.toLowerCase().includes(filter.value.toLowerCase()) ||
    d.imei.includes(filter.value)
  )
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-3xl font-bold">Devices</h1>
      <NuxtLink
        to="/devices/new"
        class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Add Device
      </NuxtLink>
    </div>

    <!-- Stats -->
    <div v-if="stats" class="mb-6 grid grid-cols-4 gap-4">
      <div class="rounded-lg border p-4 text-center">
        <p class="text-2xl font-bold">{{ stats.total }}</p>
        <p class="text-xs text-muted-foreground">Total</p>
      </div>
      <div class="rounded-lg border p-4 text-center">
        <p class="text-2xl font-bold text-green-600">{{ stats.online }}</p>
        <p class="text-xs text-muted-foreground">Online</p>
      </div>
      <div class="rounded-lg border p-4 text-center">
        <p class="text-2xl font-bold text-red-600">{{ stats.offline }}</p>
        <p class="text-xs text-muted-foreground">Offline</p>
      </div>
      <div class="rounded-lg border p-4 text-center">
        <p class="text-2xl font-bold text-gray-400">{{ stats.inactive }}</p>
        <p class="text-xs text-muted-foreground">Inactive</p>
      </div>
    </div>

    <!-- Search -->
    <input
      v-model="filter"
      type="text"
      placeholder="Search by name or IMEI..."
      class="mb-4 flex h-10 w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    />

    <div v-if="error" class="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
      {{ error }}
    </div>

    <!-- Device Table -->
    <div class="rounded-lg border">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b bg-muted/50">
            <th class="px-4 py-3 text-left font-medium">Name</th>
            <th class="px-4 py-3 text-left font-medium">IMEI</th>
            <th class="px-4 py-3 text-left font-medium">Type</th>
            <th class="px-4 py-3 text-left font-medium">Status</th>
            <th class="px-4 py-3 text-left font-medium">Last Seen</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="device in filteredDevices"
            :key="device._id"
            class="border-b transition-colors hover:bg-muted/50"
          >
            <td class="px-4 py-3">
              <NuxtLink :to="`/devices/${device._id}`" class="font-medium text-primary hover:underline">
                {{ device.name }}
              </NuxtLink>
            </td>
            <td class="px-4 py-3 font-mono text-xs">{{ device.imei }}</td>
            <td class="px-4 py-3">
              <span class="rounded-full bg-muted px-2 py-1 text-xs">{{ device.type }}</span>
            </td>
            <td class="px-4 py-3">
              <span
                class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
                :class="{
                  'bg-green-100 text-green-700': device.status === 'online',
                  'bg-red-100 text-red-700': device.status === 'offline',
                  'bg-gray-100 text-gray-500': device.status === 'inactive',
                }"
              >
                <span class="h-1.5 w-1.5 rounded-full" :class="{
                  'bg-green-500': device.status === 'online',
                  'bg-red-500': device.status === 'offline',
                  'bg-gray-400': device.status === 'inactive',
                }" />
                {{ device.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-muted-foreground">
              {{ device.lastSeen ? new Date(device.lastSeen).toLocaleString() : '—' }}
            </td>
          </tr>
          <tr v-if="filteredDevices.length === 0 && !loading">
            <td colspan="5" class="px-4 py-8 text-center text-muted-foreground">
              No devices found
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
