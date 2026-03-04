<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth'],
})

const route = useRoute()
const config = useRuntimeConfig()
const { getAuthHeaders } = useAuth()

const talkgroup = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await $fetch<{ success: boolean; data: any }>(
      `${config.public.apiBase}/api/talkgroups/${route.params.id}`,
      { headers: getAuthHeaders() }
    )
    talkgroup.value = response.data
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <NuxtLink to="/talkgroups" class="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground">
      &larr; Back to Talkgroups
    </NuxtLink>

    <div v-if="loading" class="text-muted-foreground">Loading...</div>

    <div v-else-if="talkgroup" class="space-y-6">
      <h1 class="text-3xl font-bold">{{ talkgroup.name }}</h1>
      <p v-if="talkgroup.description" class="text-muted-foreground">{{ talkgroup.description }}</p>

      <div class="rounded-lg border">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b bg-muted/50">
              <th class="px-4 py-3 text-left font-medium">#</th>
              <th class="px-4 py-3 text-left font-medium">Name</th>
              <th class="px-4 py-3 text-left font-medium">Frequency</th>
              <th class="px-4 py-3 text-left font-medium">RX</th>
              <th class="px-4 py-3 text-left font-medium">TX</th>
              <th class="px-4 py-3 text-left font-medium">Color Code</th>
              <th class="px-4 py-3 text-left font-medium">Time Slot</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="ch in talkgroup.channels"
              :key="ch.number"
              class="border-b"
            >
              <td class="px-4 py-2">{{ ch.number }}</td>
              <td class="px-4 py-2 font-medium">{{ ch.name }}</td>
              <td class="px-4 py-2 font-mono text-xs">{{ ch.frequency || '—' }}</td>
              <td class="px-4 py-2 font-mono text-xs">{{ ch.rxFrequency || '—' }}</td>
              <td class="px-4 py-2 font-mono text-xs">{{ ch.txFrequency || '—' }}</td>
              <td class="px-4 py-2">{{ ch.colorCode ?? '—' }}</td>
              <td class="px-4 py-2">{{ ch.timeSlot ?? '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
