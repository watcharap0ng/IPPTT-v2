<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth'],
})

const config = useRuntimeConfig()
const { getAuthHeaders } = useAuth()

const talkgroups = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await $fetch<{ success: boolean; talkgroups: any[] }>(
      `${config.public.apiBase}/api/talkgroups`,
      { headers: getAuthHeaders() }
    )
    talkgroups.value = response.talkgroups
  } finally {
    loading.value = false
  }
})

async function exportXml(id: string) {
  const xml = await $fetch<string>(
    `${config.public.apiBase}/api/talkgroups/${id}/xml`,
    { headers: getAuthHeaders() }
  )
  const blob = new Blob([xml], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `talkgroup-${id}.xml`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-3xl font-bold">Talkgroups</h1>
      <NuxtLink
        to="/talkgroups/new"
        class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        New Talkgroup
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-muted-foreground">Loading...</div>

    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="tg in talkgroups"
        :key="tg._id"
        class="rounded-lg border p-4"
      >
        <div class="mb-2 flex items-center justify-between">
          <NuxtLink :to="`/talkgroups/${tg._id}`" class="font-semibold text-primary hover:underline">
            {{ tg.name }}
          </NuxtLink>
          <span class="text-xs text-muted-foreground">{{ tg.channels.length }} ch</span>
        </div>
        <p v-if="tg.description" class="mb-3 text-sm text-muted-foreground">{{ tg.description }}</p>
        <button
          class="text-xs text-muted-foreground hover:text-foreground"
          @click="exportXml(tg._id)"
        >
          Export XML
        </button>
      </div>

      <div v-if="talkgroups.length === 0" class="col-span-full rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        No talkgroups configured yet
      </div>
    </div>
  </div>
</template>
