import { Device, type IDevice } from './model.js'
import { publishCommand } from './mqtt-client.js'

export class DeviceService {
  async list(query: { page?: number; limit?: number; status?: string; type?: string }) {
    const { page = 1, limit = 20, status, type } = query
    const filter: Record<string, unknown> = {}
    if (status) filter.status = status
    if (type) filter.type = type

    const [devices, total] = await Promise.all([
      Device.find(filter)
        .populate('userId', 'name email')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ lastSeen: -1 }),
      Device.countDocuments(filter),
    ])

    return { devices, total, page, limit }
  }

  async getById(id: string) {
    const device = await Device.findById(id).populate('userId', 'name email')
    if (!device) throw { statusCode: 404, message: 'Device not found' }
    return device
  }

  async create(data: Partial<IDevice>) {
    const existing = await Device.findOne({ imei: data.imei })
    if (existing) throw { statusCode: 409, message: 'Device with this IMEI already exists' }
    return Device.create(data)
  }

  async update(id: string, data: Partial<IDevice>) {
    const device = await Device.findByIdAndUpdate(id, data, { new: true })
    if (!device) throw { statusCode: 404, message: 'Device not found' }
    return device
  }

  async delete(id: string) {
    const device = await Device.findByIdAndUpdate(id, { status: 'inactive' }, { new: true })
    if (!device) throw { statusCode: 404, message: 'Device not found' }
    return device
  }

  async sendCommand(id: string, command: Record<string, unknown>) {
    const device = await Device.findById(id)
    if (!device) throw { statusCode: 404, message: 'Device not found' }
    publishCommand(device.imei, command)
    return { sent: true, imei: device.imei }
  }

  async getStats() {
    const [total, online, offline] = await Promise.all([
      Device.countDocuments(),
      Device.countDocuments({ status: 'online' }),
      Device.countDocuments({ status: 'offline' }),
    ])
    return { total, online, offline, inactive: total - online - offline }
  }
}
