export default defineNuxtPlugin(async () => {
  const { initFromStorage, fetchUser } = useAuth()

  initFromStorage()
  await fetchUser()
})
