<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const { login, isAuthenticated } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

// Redirect if already logged in
watch(isAuthenticated, (val) => {
  if (val) router.push('/dashboard')
}, { immediate: true })

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    await login(email.value, password.value)
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e?.data?.error || 'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
    <div class="w-full max-w-sm space-y-6">
      <div class="text-center">
        <h1 class="text-2xl font-bold">Sign In</h1>
        <p class="text-sm text-muted-foreground">
          Enter your credentials to access IPPTT
        </p>
      </div>

      <div v-if="error" class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
        {{ error }}
      </div>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <div class="space-y-2">
          <label for="email" class="text-sm font-medium">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="admin@ipptt.local"
            required
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div class="space-y-2">
          <label for="password" class="text-sm font-medium">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <p class="text-center text-sm text-muted-foreground">
        Don't have an account?
        <NuxtLink to="/register" class="text-primary hover:underline">Register</NuxtLink>
      </p>
    </div>
  </div>
</template>
