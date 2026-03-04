import { ProvisionProfile, ProvisionLog } from './model.js'
import { renderTemplate, extractVariables } from './template-engine.js'
import { Device } from '../mqtt/model.js'

export class ProvisionService {
  async listProfiles(query: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = query
    const [profiles, total] = await Promise.all([
      ProvisionProfile.find({ isActive: true })
        .populate('createdBy', 'name email')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      ProvisionProfile.countDocuments({ isActive: true }),
    ])
    return { profiles, total, page, limit }
  }

  async getProfile(id: string) {
    const profile = await ProvisionProfile.findById(id).populate('createdBy', 'name email')
    if (!profile) throw { statusCode: 404, message: 'Profile not found' }
    return { ...profile.toObject(), templateVariables: extractVariables(profile.template) }
  }

  async createProfile(data: any) {
    return ProvisionProfile.create(data)
  }

  async updateProfile(id: string, data: any) {
    const profile = await ProvisionProfile.findByIdAndUpdate(id, data, { new: true })
    if (!profile) throw { statusCode: 404, message: 'Profile not found' }
    return profile
  }

  async deleteProfile(id: string) {
    const profile = await ProvisionProfile.findByIdAndUpdate(id, { isActive: false }, { new: true })
    if (!profile) throw { statusCode: 404, message: 'Profile not found' }
    return profile
  }

  async provisionDevice(profileId: string, deviceImei: string, overrides: Record<string, string> = {}) {
    const profile = await ProvisionProfile.findById(profileId)
    if (!profile) throw { statusCode: 404, message: 'Profile not found' }

    const device = await Device.findOne({ imei: deviceImei })
    if (!device) throw { statusCode: 404, message: 'Device not found' }

    const variables = {
      ...profile.variables,
      ...overrides,
      DEVICE_NAME: device.name,
      DEVICE_IMEI: device.imei,
    }

    try {
      const config = renderTemplate(profile.template, variables)

      await ProvisionLog.create({
        profileId: profile._id,
        deviceImei,
        status: 'success',
        output: config,
      })

      return { config, status: 'success' }
    } catch (err: any) {
      await ProvisionLog.create({
        profileId: profile._id,
        deviceImei,
        status: 'failed',
        output: err.message,
      })

      throw { statusCode: 500, message: 'Provisioning failed' }
    }
  }

  async getLogs(query: { profileId?: string; deviceImei?: string; page?: number; limit?: number }) {
    const { profileId, deviceImei, page = 1, limit = 50 } = query
    const filter: Record<string, unknown> = {}
    if (profileId) filter.profileId = profileId
    if (deviceImei) filter.deviceImei = deviceImei

    const [logs, total] = await Promise.all([
      ProvisionLog.find(filter)
        .populate('profileId', 'name')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      ProvisionLog.countDocuments(filter),
    ])
    return { logs, total, page, limit }
  }
}
