export interface SrtEntry {
  index: number
  start: number
  end: number
  text: string
}

/**
 * Parse SRT subtitle format into structured entries.
 * SRT format:
 * 1
 * 00:00:01,000 --> 00:00:04,000
 * Text content here
 *
 * 2
 * ...
 */
export function parseSrt(srtContent: string): SrtEntry[] {
  if (!srtContent.trim()) return []

  const blocks = srtContent.trim().split(/\n\s*\n/)
  const entries: SrtEntry[] = []

  for (const block of blocks) {
    const lines = block.trim().split('\n')
    if (lines.length < 3) continue

    const index = parseInt(lines[0], 10)
    if (isNaN(index)) continue

    const timeLine = lines[1]
    const timeMatch = timeLine.match(
      /(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/
    )
    if (!timeMatch) continue

    const start = timeToSeconds(timeMatch[1], timeMatch[2], timeMatch[3], timeMatch[4])
    const end = timeToSeconds(timeMatch[5], timeMatch[6], timeMatch[7], timeMatch[8])
    const text = lines.slice(2).join('\n').trim()

    entries.push({ index, start, end, text })
  }

  return entries
}

function timeToSeconds(h: string, m: string, s: string, ms: string): number {
  return parseInt(h, 10) * 3600 + parseInt(m, 10) * 60 + parseInt(s, 10) + parseInt(ms, 10) / 1000
}

/**
 * Format seconds to SRT-style timestamp (HH:MM:SS)
 */
export function formatTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
