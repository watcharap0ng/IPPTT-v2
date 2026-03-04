import { Talkgroup, type ITalkgroup } from './model.js'
import { generateTalkgroupXml } from './xml-generator.js'
import { parseTalkgroupXml } from './xml-parser.js'

export class TalkgroupService {
  async list(query: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = query
    const [talkgroups, total] = await Promise.all([
      Talkgroup.find({ isActive: true })
        .populate('createdBy', 'name email')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Talkgroup.countDocuments({ isActive: true }),
    ])
    return { talkgroups, total, page, limit }
  }

  async getById(id: string) {
    const talkgroup = await Talkgroup.findById(id).populate('createdBy', 'name email')
    if (!talkgroup) throw { statusCode: 404, message: 'Talkgroup not found' }
    return talkgroup
  }

  async create(data: Partial<ITalkgroup>) {
    return Talkgroup.create(data)
  }

  async update(id: string, data: Partial<ITalkgroup>) {
    const talkgroup = await Talkgroup.findByIdAndUpdate(id, data, { new: true })
    if (!talkgroup) throw { statusCode: 404, message: 'Talkgroup not found' }
    return talkgroup
  }

  async delete(id: string) {
    const talkgroup = await Talkgroup.findByIdAndUpdate(id, { isActive: false }, { new: true })
    if (!talkgroup) throw { statusCode: 404, message: 'Talkgroup not found' }
    return talkgroup
  }

  async exportXml(id: string) {
    const talkgroup = await Talkgroup.findById(id)
    if (!talkgroup) throw { statusCode: 404, message: 'Talkgroup not found' }
    return generateTalkgroupXml(talkgroup.name, talkgroup.channels)
  }

  async importXml(xml: string, createdBy: string) {
    const { name, channels } = parseTalkgroupXml(xml)
    return Talkgroup.create({ name, channels, createdBy })
  }
}
