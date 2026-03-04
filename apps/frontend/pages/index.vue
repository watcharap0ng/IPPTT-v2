<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mx-auto max-w-3xl text-center">
      <h1 class="mb-4 text-4xl font-bold tracking-tight">
        IPPTT v2
      </h1>
      <p class="mb-8 text-lg text-muted-foreground">
        IP Push-To-Talk — Voice Communication & IoT Device Management Platform
      </p>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <NuxtLink
          to="/voice"
          class="rounded-lg border p-6 text-left transition-colors hover:bg-accent"
        >
          <h3 class="mb-2 font-semibold">Voice</h3>
          <p class="text-sm text-muted-foreground">Mumble voice server management</p>
        </NuxtLink>
        <NuxtLink
          to="/devices"
          class="rounded-lg border p-6 text-left transition-colors hover:bg-accent"
        >
          <h3 class="mb-2 font-semibold">Devices</h3>
          <p class="text-sm text-muted-foreground">MQTT IoT device control</p>
        </NuxtLink>
        <NuxtLink
          to="/tracking"
          class="rounded-lg border p-6 text-left transition-colors hover:bg-accent"
        >
          <h3 class="mb-2 font-semibold">Tracking</h3>
          <p class="text-sm text-muted-foreground">GPS tracking with Traccar</p>
        </NuxtLink>
        <NuxtLink
          to="/dashboard"
          class="rounded-lg border p-6 text-left transition-colors hover:bg-accent"
        >
          <h3 class="mb-2 font-semibold">Dashboard</h3>
          <p class="text-sm text-muted-foreground">System overview & analytics</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
