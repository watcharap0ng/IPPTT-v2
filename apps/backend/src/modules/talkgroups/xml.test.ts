import { describe, it, expect } from 'vitest'
import { generateTalkgroupXml } from './xml-generator.js'
import { parseTalkgroupXml } from './xml-parser.js'

const sampleChannels = [
  { number: 1, name: 'Channel 1', frequency: '145.000', colorCode: 1, timeSlot: 1 },
  { number: 2, name: 'Channel 2', frequency: '146.500', rxFrequency: '146.500', txFrequency: '147.100' },
]

describe('generateTalkgroupXml', () => {
  it('generates valid XML', () => {
    const xml = generateTalkgroupXml('Test Group', sampleChannels)
    expect(xml).toContain('<?xml version="1.0"')
    expect(xml).toContain('<talkgroup name="Test Group">')
    expect(xml).toContain('<channel number="1">')
    expect(xml).toContain('<name>Channel 1</name>')
    expect(xml).toContain('<frequency>145.000</frequency>')
    expect(xml).toContain('<colorCode>1</colorCode>')
    expect(xml).toContain('<channel number="2">')
    expect(xml).toContain('</talkgroup>')
  })

  it('escapes special XML characters', () => {
    const xml = generateTalkgroupXml('Test & <Group>', [
      { number: 1, name: 'Ch "1"' },
    ])
    expect(xml).toContain('Test &amp; &lt;Group&gt;')
    expect(xml).toContain('Ch &quot;1&quot;')
  })

  it('handles empty channels', () => {
    const xml = generateTalkgroupXml('Empty', [])
    expect(xml).toContain('<channels>')
    expect(xml).toContain('</channels>')
    expect(xml).not.toContain('<channel ')
  })
})

describe('parseTalkgroupXml', () => {
  it('parses generated XML back to data', () => {
    const xml = generateTalkgroupXml('Test Group', sampleChannels)
    const result = parseTalkgroupXml(xml)

    expect(result.name).toBe('Test Group')
    expect(result.channels).toHaveLength(2)
    expect(result.channels[0].number).toBe(1)
    expect(result.channels[0].name).toBe('Channel 1')
    expect(result.channels[0].frequency).toBe('145.000')
    expect(result.channels[0].colorCode).toBe(1)
    expect(result.channels[0].timeSlot).toBe(1)
    expect(result.channels[1].number).toBe(2)
    expect(result.channels[1].rxFrequency).toBe('146.500')
    expect(result.channels[1].txFrequency).toBe('147.100')
  })

  it('handles missing optional fields', () => {
    const xml = `<?xml version="1.0"?>
<talkgroup name="Minimal">
  <channels>
    <channel number="1">
      <name>Basic</name>
    </channel>
  </channels>
</talkgroup>`

    const result = parseTalkgroupXml(xml)
    expect(result.name).toBe('Minimal')
    expect(result.channels).toHaveLength(1)
    expect(result.channels[0].name).toBe('Basic')
    expect(result.channels[0].frequency).toBeUndefined()
  })
})

describe('roundtrip', () => {
  it('generate -> parse -> generate produces same output', () => {
    const xml1 = generateTalkgroupXml('Roundtrip', sampleChannels)
    const parsed = parseTalkgroupXml(xml1)
    const xml2 = generateTalkgroupXml(parsed.name, parsed.channels)
    expect(xml2).toBe(xml1)
  })
})
