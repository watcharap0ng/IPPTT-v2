<script setup lang="ts">
const { isAuthenticated, user, logout } = useAuth()
const router = useRouter()

function handleLogout() {
  logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <header class="border-b">
      <div class="container mx-auto flex h-16 items-center justify-between px-4">
        <NuxtLink to="/" class="text-xl font-bold text-primary">
          IPPTT v2
        </NuxtLink>
        <nav class="flex items-center gap-4">
          <template v-if="isAuthenticated">
            <NuxtLink to="/dashboard" class="text-sm text-muted-foreground hover:text-foreground">
              Dashboard
            </NuxtLink>
            <NuxtLink to="/voice" class="text-sm text-muted-foreground hover:text-foreground">
              Voice
            </NuxtLink>
            <NuxtLink to="/devices" class="text-sm text-muted-foreground hover:text-foreground">
              Devices
            </NuxtLink>
            <NuxtLink to="/tracking" class="text-sm text-muted-foreground hover:text-foreground">
              Tracking
            </NuxtLink>
            <NuxtLink to="/talkgroups" class="text-sm text-muted-foreground hover:text-foreground">
              Talkgroups
            </NuxtLink>
            <NuxtLink to="/admin/provision" class="text-sm text-muted-foreground hover:text-foreground">
              Provision
            </NuxtLink>
            <span class="text-sm text-muted-foreground">{{ user?.name }}</span>
            <button
              class="text-sm text-muted-foreground hover:text-foreground"
              @click="handleLogout"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="text-sm text-muted-foreground hover:text-foreground">
              Login
            </NuxtLink>
          </template>
        </nav>
      </div>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>
