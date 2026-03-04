<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth'],
})

const { user, logout } = useAuth()
const router = useRouter()

function handleLogout() {
  logout()
  router.push('/login')
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Dashboard</h1>
        <p class="text-muted-foreground">
          Welcome back, {{ user?.name || 'User' }}
        </p>
      </div>
      <button
        class="rounded-md border px-4 py-2 text-sm transition-colors hover:bg-accent"
        @click="handleLogout"
      >
        Logout
      </button>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-lg border p-6">
        <h3 class="text-sm font-medium text-muted-foreground">Voice Channels</h3>
        <p class="mt-2 text-3xl font-bold">—</p>
        <p class="mt-1 text-xs text-muted-foreground">Mumble server</p>
      </div>
      <div class="rounded-lg border p-6">
        <h3 class="text-sm font-medium text-muted-foreground">Devices Online</h3>
        <p class="mt-2 text-3xl font-bold">—</p>
        <p class="mt-1 text-xs text-muted-foreground">MQTT connected</p>
      </div>
      <div class="rounded-lg border p-6">
        <h3 class="text-sm font-medium text-muted-foreground">GPS Trackers</h3>
        <p class="mt-2 text-3xl font-bold">—</p>
        <p class="mt-1 text-xs text-muted-foreground">Traccar active</p>
      </div>
      <div class="rounded-lg border p-6">
        <h3 class="text-sm font-medium text-muted-foreground">Users</h3>
        <p class="mt-2 text-3xl font-bold">—</p>
        <p class="mt-1 text-xs text-muted-foreground">Registered</p>
      </div>
    </div>
  </div>
</template>
