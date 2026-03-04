import type { IChannel } from './model.js'

export function parseTalkgroupXml(xml: string): { name: string; channels: IChannel[] } {
  // Simple XML parser for talkgroup format
  const nameMatch = xml.match(/<talkgroup\s+name="([^"]*)"/)
  const name = nameMatch ? nameMatch[1] : 'Imported'

  const channels: IChannel[] = []
  const channelRegex = /<channel\s+number="(\d+)">([\s\S]*?)<\/channel>/g

  let match
  while ((match = channelRegex.exec(xml)) !== null) {
    const number = parseInt(match[1], 10)
    const content = match[2]

    channels.push({
      number,
      name: extractTag(content, 'name') || `Channel ${number}`,
      frequency: extractTag(content, 'frequency'),
      rxFrequency: extractTag(content, 'rxFrequency'),
      txFrequency: extractTag(content, 'txFrequency'),
      colorCode: extractTagNum(content, 'colorCode'),
      timeSlot: extractTagNum(content, 'timeSlot'),
      contactName: extractTag(content, 'contactName'),
    })
  }

  return { name, channels }
}

function extractTag(content: string, tag: string): string | undefined {
  const match = content.match(new RegExp(`<${tag}>(.*?)</${tag}>`))
  return match ? match[1] : undefined
}

function extractTagNum(content: string, tag: string): number | undefined {
  const val = extractTag(content, tag)
  return val !== undefined ? parseInt(val, 10) : undefined
}
