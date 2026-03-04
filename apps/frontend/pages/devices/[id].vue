<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth'],
})

const route = useRoute()
const config = useRuntimeConfig()
const { getAuthHeaders } = useAuth()
const { sendCommand } = useDevices()

const device = ref<any>(null)
const loading = ref(true)
const commandInput = ref('')
const commandResult = ref('')

onMounted(async () => {
  try {
    const response = await $fetch<{ success: boolean; data: any }>(
      `${config.public.apiBase}/api/devices/${route.params.id}`,
      { headers: getAuthHeaders() }
    )
    device.value = response.data
  } catch {
    // handle error
  } finally {
    loading.value = false
  }
})

async function handleSendCommand() {
  if (!commandInput.value.trim()) return
  try {
    const cmd = JSON.parse(commandInput.value)
    await sendCommand(route.params.id as string, cmd)
    commandResult.value = 'Command sent successfully'
    commandInput.value = ''
  } catch (e: any) {
    commandResult.value = e.message || 'Failed to send command'
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <NuxtLink to="/devices" class="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground">
      &larr; Back to Devices
    </NuxtLink>

    <div v-if="loading" class="text-muted-foreground">Loading...</div>

    <div v-else-if="device" class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold">{{ device.name }}</h1>
        <span
          class="rounded-full px-3 py-1 text-sm font-medium"
          :class="{
            'bg-green-100 text-green-700': device.status === 'online',
            'bg-red-100 text-red-700': device.status === 'offline',
            'bg-gray-100 text-gray-500': device.status === 'inactive',
          }"
        >
          {{ device.status }}
        </span>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="rounded-lg border p-4">
          <h3 class="mb-3 font-semibold">Details</h3>
          <dl class="space-y-2 text-sm">
            <div class="flex justify-between">
              <dt class="text-muted-foreground">IMEI</dt>
              <dd class="font-mono">{{ device.imei }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-muted-foreground">Type</dt>
              <dd>{{ device.type }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-muted-foreground">IP</dt>
              <dd>{{ device.ip || '—' }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-muted-foreground">Firmware</dt>
              <dd>{{ device.firmware || '—' }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-muted-foreground">Last Seen</dt>
              <dd>{{ device.lastSeen ? new Date(device.lastSeen).toLocaleString() : '—' }}</dd>
            </div>
          </dl>
        </div>

        <div class="rounded-lg border p-4">
          <h3 class="mb-3 font-semibold">Send Command</h3>
          <textarea
            v-model="commandInput"
            placeholder='{"action": "reboot"}'
            rows="3"
            class="mb-2 w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            @click="handleSendCommand"
          >
            Send
          </button>
          <p v-if="commandResult" class="mt-2 text-sm text-muted-foreground">
            {{ commandResult }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
