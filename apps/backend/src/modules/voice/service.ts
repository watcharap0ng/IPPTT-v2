import { config } from '../../config/index.js'

const MURMUR_REST_URL = config.murmur.restUrl

async function fetchMurmurRest(path: string) {
  const response = await fetch(`${MURMUR_REST_URL}${path}`)
  if (!response.ok) {
    throw { statusCode: response.status, message: `Murmur REST error: ${response.statusText}` }
  }
  return response.json()
}

export class VoiceService {
  async getServers() {
    return fetchMurmurRest('/api/servers')
  }

  async getChannels(serverId: number) {
    return fetchMurmurRest(`/api/servers/${serverId}/channels`)
  }

  async getUsers(serverId: number) {
    return fetchMurmurRest(`/api/servers/${serverId}/users`)
  }

  async getTree(serverId: number) {
    return fetchMurmurRest(`/api/servers/${serverId}/tree`)
  }

  async getHealth() {
    return fetchMurmurRest('/health')
  }
}
