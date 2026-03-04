<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth'],
})

const config = useRuntimeConfig()
const { getAuthHeaders } = useAuth()
const router = useRouter()

const name = ref('')
const description = ref('')
const error = ref('')
const loading = ref(false)

async function handleCreate() {
  if (!name.value.trim()) return
  loading.value = true
  error.value = ''

  try {
    await $fetch(`${config.public.apiBase}/api/talkgroups`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: { name: name.value, description: description.value, channels: [] },
    })
    router.push('/talkgroups')
  } catch (e: any) {
    error.value = e?.data?.error || 'Failed to create talkgroup'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <NuxtLink to="/talkgroups" class="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground">
      &larr; Back to Talkgroups
    </NuxtLink>

    <h1 class="mb-6 text-3xl font-bold">New Talkgroup</h1>

    <div v-if="error" class="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
      {{ error }}
    </div>

    <form class="max-w-lg space-y-4" @submit.prevent="handleCreate">
      <div class="space-y-2">
        <label for="name" class="text-sm font-medium">Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          required
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div class="space-y-2">
        <label for="desc" class="text-sm font-medium">Description</label>
        <textarea
          id="desc"
          v-model="description"
          rows="3"
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <button
        type="submit"
        :disabled="loading"
        class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {{ loading ? 'Creating...' : 'Create Talkgroup' }}
      </button>
    </form>
  </div>
</template>
