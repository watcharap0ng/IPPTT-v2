export interface MurmurServer {
  id: number
  name: string
  running: boolean
  users_online: number
  max_users: number
  port: number
}

export interface MurmurChannel {
  id: number
  name: string
  parent: number
  description: string
  temporary: boolean
  position: number
}

export interface MurmurUser {
  session: number
  name: string
  channel: number
  mute: boolean
  deaf: boolean
  selfMute: boolean
  selfDeaf: boolean
  online_secs: number
  idle_secs: number
}

export interface ChannelTreeNode {
  id: number
  name: string
  parent: number
  children: ChannelTreeNode[]
  users: { session: number; name: string; mute: boolean; deaf: boolean }[]
}
