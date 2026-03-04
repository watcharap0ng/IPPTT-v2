import type { IChannel } from './model.js'

export function generateTalkgroupXml(name: string, channels: IChannel[]): string {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<talkgroup name="${escapeXml(name)}">`,
    '  <channels>',
  ]

  for (const ch of channels) {
    lines.push(`    <channel number="${ch.number}">`)
    lines.push(`      <name>${escapeXml(ch.name)}</name>`)
    if (ch.frequency) lines.push(`      <frequency>${escapeXml(ch.frequency)}</frequency>`)
    if (ch.rxFrequency) lines.push(`      <rxFrequency>${escapeXml(ch.rxFrequency)}</rxFrequency>`)
    if (ch.txFrequency) lines.push(`      <txFrequency>${escapeXml(ch.txFrequency)}</txFrequency>`)
    if (ch.colorCode !== undefined) lines.push(`      <colorCode>${ch.colorCode}</colorCode>`)
    if (ch.timeSlot !== undefined) lines.push(`      <timeSlot>${ch.timeSlot}</timeSlot>`)
    if (ch.contactName) lines.push(`      <contactName>${escapeXml(ch.contactName)}</contactName>`)
    lines.push('    </channel>')
  }

  lines.push('  </channels>')
  lines.push('</talkgroup>')

  return lines.join('\n')
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
