<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth'],
})

const config = useRuntimeConfig()
const { getAuthHeaders } = useAuth()

const profiles = ref<any[]>([])
const logs = ref<any[]>([])
const loading = ref(true)
const activeTab = ref<'profiles' | 'logs'>('profiles')

onMounted(async () => {
  try {
    const [profileRes, logRes] = await Promise.all([
      $fetch<{ success: boolean; profiles: any[] }>(
        `${config.public.apiBase}/api/provision/profiles`,
        { headers: getAuthHeaders() }
      ),
      $fetch<{ success: boolean; logs: any[] }>(
        `${config.public.apiBase}/api/provision/logs?limit=20`,
        { headers: getAuthHeaders() }
      ),
    ])
    profiles.value = profileRes.profiles
    logs.value = logRes.logs
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="mb-6 text-3xl font-bold">Auto-Provisioning</h1>

    <div class="mb-4 flex gap-2">
      <button
        class="rounded-md px-4 py-2 text-sm font-medium transition-colors"
        :class="activeTab === 'profiles' ? 'bg-primary text-primary-foreground' : 'bg-muted'"
        @click="activeTab = 'profiles'"
      >
        Profiles
      </button>
      <button
        class="rounded-md px-4 py-2 text-sm font-medium transition-colors"
        :class="activeTab === 'logs' ? 'bg-primary text-primary-foreground' : 'bg-muted'"
        @click="activeTab = 'logs'"
      >
        Logs
      </button>
    </div>

    <div v-if="loading" class="text-muted-foreground">Loading...</div>

    <!-- Profiles Tab -->
    <div v-else-if="activeTab === 'profiles'" class="space-y-3">
      <div
        v-for="profile in profiles"
        :key="profile._id"
        class="rounded-lg border p-4"
      >
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">{{ profile.name }}</h3>
          <span class="rounded-full bg-muted px-2 py-1 text-xs">{{ profile.deviceType }}</span>
        </div>
        <p v-if="profile.description" class="mt-1 text-sm text-muted-foreground">
          {{ profile.description }}
        </p>
      </div>
      <div v-if="profiles.length === 0" class="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        No provisioning profiles configured
      </div>
    </div>

    <!-- Logs Tab -->
    <div v-else class="rounded-lg border">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b bg-muted/50">
            <th class="px-4 py-3 text-left font-medium">Device IMEI</th>
            <th class="px-4 py-3 text-left font-medium">Profile</th>
            <th class="px-4 py-3 text-left font-medium">Status</th>
            <th class="px-4 py-3 text-left font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log._id" class="border-b">
            <td class="px-4 py-2 font-mono text-xs">{{ log.deviceImei }}</td>
            <td class="px-4 py-2">{{ log.profileId?.name || '—' }}</td>
            <td class="px-4 py-2">
              <span
                class="rounded-full px-2 py-1 text-xs"
                :class="log.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
              >
                {{ log.status }}
              </span>
            </td>
            <td class="px-4 py-2 text-muted-foreground">
              {{ new Date(log.createdAt).toLocaleString() }}
            </td>
          </tr>
          <tr v-if="logs.length === 0">
            <td colspan="4" class="px-4 py-8 text-center text-muted-foreground">No provisioning logs</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
