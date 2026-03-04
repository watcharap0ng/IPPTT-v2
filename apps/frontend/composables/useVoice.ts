interface VoiceServer {
  id: number
  name: string
  running: boolean
  users_online: number
  max_users: number
  port: number
}

interface ChannelTreeNode {
  id: number
  name: string
  parent: number
  children: ChannelTreeNode[]
  users: { session: number; name: string; mute: boolean; deaf: boolean }[]
}

export function useVoice() {
  const config = useRuntimeConfig()
  const { getAuthHeaders } = useAuth()
  const apiBase = config.public.apiBase

  const servers = ref<VoiceServer[]>([])
  const tree = ref<ChannelTreeNode | null>(null)
  const loading = ref(false)
  const error = ref('')

  async function fetchServers() {
    loading.value = true
    error.value = ''
    try {
      const response = await $fetch<{ success: boolean; data: { servers: VoiceServer[] } }>(
        `${apiBase}/api/voice/servers`,
        { headers: getAuthHeaders() }
      )
      servers.value = response.data.servers
    } catch (e: any) {
      error.value = e?.data?.error || 'Failed to fetch servers'
    } finally {
      loading.value = false
    }
  }

  async function fetchTree(serverId: number) {
    loading.value = true
    error.value = ''
    try {
      const response = await $fetch<{ success: boolean; data: { tree: ChannelTreeNode } }>(
        `${apiBase}/api/voice/servers/${serverId}/tree`,
        { headers: getAuthHeaders() }
      )
      tree.value = response.data.tree
    } catch (e: any) {
      error.value = e?.data?.error || 'Failed to fetch channel tree'
    } finally {
      loading.value = false
    }
  }

  return {
    servers,
    tree,
    loading,
    error,
    fetchServers,
    fetchTree,
  }
}
