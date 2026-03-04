<script setup lang="ts">
interface TreeUser {
  session: number
  name: string
  mute: boolean
  deaf: boolean
}

interface TreeNode {
  id: number
  name: string
  children: TreeNode[]
  users: TreeUser[]
}

const props = defineProps<{
  node: TreeNode
  depth: number
}>()

const expanded = ref(true)
</script>

<template>
  <div :style="{ paddingLeft: `${depth * 16}px` }">
    <div
      class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-accent"
      @click="expanded = !expanded"
    >
      <span class="text-xs text-muted-foreground">
        {{ expanded ? '▼' : '▶' }}
      </span>
      <span class="text-sm font-medium">{{ node.name }}</span>
      <span v-if="node.users.length" class="text-xs text-muted-foreground">
        ({{ node.users.length }})
      </span>
    </div>

    <div v-if="expanded">
      <!-- Users in this channel -->
      <div
        v-for="user in node.users"
        :key="user.session"
        class="flex items-center gap-2 rounded px-2 py-1"
        :style="{ paddingLeft: `${(depth + 1) * 16 + 8}px` }"
      >
        <span class="text-xs">
          {{ user.deaf ? '🔇' : user.mute ? '🔕' : '🎤' }}
        </span>
        <span class="text-sm">{{ user.name }}</span>
      </div>

      <!-- Child channels -->
      <VoiceChannelNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
      />
    </div>
  </div>
</template>
