<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth'],
})

const { servers, tree, loading, error, fetchServers, fetchTree } = useVoice()
const selectedServer = ref<number | null>(null)

onMounted(() => {
  fetchServers()
})

watch(selectedServer, (id) => {
  if (id !== null) fetchTree(id)
})

// Auto-select first server
watch(servers, (list) => {
  if (list.length > 0 && selectedServer.value === null) {
    selectedServer.value = list[0].id
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="mb-6 text-3xl font-bold">Voice Servers</h1>

    <div v-if="error" class="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
      {{ error }}
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Server List -->
      <div class="space-y-3">
        <h2 class="text-lg font-semibold">Servers</h2>
        <div v-if="loading && servers.length === 0" class="text-sm text-muted-foreground">
          Loading servers...
        </div>
        <div
          v-for="server in servers"
          :key="server.id"
          class="cursor-pointer rounded-lg border p-4 transition-colors hover:bg-accent"
          :class="{ 'border-primary bg-accent': selectedServer === server.id }"
          @click="selectedServer = server.id"
        >
          <div class="flex items-center justify-between">
            <h3 class="font-medium">{{ server.name }}</h3>
            <span
              class="inline-flex h-2 w-2 rounded-full"
              :class="server.running ? 'bg-green-500' : 'bg-red-500'"
            />
          </div>
          <p class="mt-1 text-sm text-muted-foreground">
            {{ server.users_online }}/{{ server.max_users }} users
          </p>
          <p class="text-xs text-muted-foreground">Port {{ server.port }}</p>
        </div>

        <div v-if="servers.length === 0 && !loading" class="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          No Mumble servers found. Check that Murmur is running.
        </div>
      </div>

      <!-- Channel Tree -->
      <div class="lg:col-span-2">
        <h2 class="mb-3 text-lg font-semibold">Channels</h2>
        <div v-if="tree" class="rounded-lg border p-4">
          <VoiceChannelNode :node="tree" :depth="0" />
        </div>
        <div v-else class="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          Select a server to view channels
        </div>
      </div>
    </div>
  </div>
</template>
