interface AuthUser {
  id: string
  email: string
  name: string
  role: string
}

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
}

const authState = reactive<AuthState>({
  user: null,
  accessToken: null,
  refreshToken: null,
})

export function useAuth() {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  const isAuthenticated = computed(() => !!authState.accessToken)
  const user = computed(() => authState.user)

  async function login(email: string, password: string) {
    const response = await $fetch<{ success: boolean; data: any }>(`${apiBase}/api/auth/login`, {
      method: 'POST',
      body: { email, password },
    })

    if (response.success) {
      authState.user = response.data.user
      authState.accessToken = response.data.accessToken
      authState.refreshToken = response.data.refreshToken

      if (import.meta.client) {
        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('refreshToken', response.data.refreshToken)
      }
    }

    return response
  }

  async function register(data: { email: string; password: string; name: string }) {
    const response = await $fetch<{ success: boolean; data: any }>(`${apiBase}/api/auth/register`, {
      method: 'POST',
      body: data,
    })

    if (response.success) {
      authState.user = response.data.user
      authState.accessToken = response.data.accessToken
      authState.refreshToken = response.data.refreshToken

      if (import.meta.client) {
        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('refreshToken', response.data.refreshToken)
      }
    }

    return response
  }

  async function refresh() {
    if (!authState.refreshToken) return false

    try {
      const response = await $fetch<{ success: boolean; data: any }>(`${apiBase}/api/auth/refresh`, {
        method: 'POST',
        body: { refreshToken: authState.refreshToken },
      })

      if (response.success) {
        authState.user = response.data.user
        authState.accessToken = response.data.accessToken
        authState.refreshToken = response.data.refreshToken

        if (import.meta.client) {
          localStorage.setItem('accessToken', response.data.accessToken)
          localStorage.setItem('refreshToken', response.data.refreshToken)
        }
        return true
      }
    } catch {
      logout()
    }
    return false
  }

  async function fetchUser() {
    if (!authState.accessToken) return null

    try {
      const response = await $fetch<{ success: boolean; data: any }>(`${apiBase}/api/auth/me`, {
        headers: { Authorization: `Bearer ${authState.accessToken}` },
      })

      if (response.success) {
        authState.user = response.data
      }
      return response.data
    } catch {
      // Token expired — try refresh
      const refreshed = await refresh()
      if (refreshed) return fetchUser()
      return null
    }
  }

  function logout() {
    authState.user = null
    authState.accessToken = null
    authState.refreshToken = null

    if (import.meta.client) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }

  function initFromStorage() {
    if (import.meta.client) {
      authState.accessToken = localStorage.getItem('accessToken')
      authState.refreshToken = localStorage.getItem('refreshToken')
    }
  }

  function getAuthHeaders() {
    return authState.accessToken
      ? { Authorization: `Bearer ${authState.accessToken}` }
      : {}
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    refresh,
    fetchUser,
    logout,
    initFromStorage,
    getAuthHeaders,
  }
}
