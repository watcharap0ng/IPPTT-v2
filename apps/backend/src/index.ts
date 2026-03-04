import { buildApp } from './app.js'

const start = async () => {
  const app = await buildApp()
  const host = process.env.HOST || '0.0.0.0'
  const port = parseInt(process.env.PORT || '3001', 10)

  try {
    await app.listen({ host, port })
    app.log.info(`Server running at http://${host}:${port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
