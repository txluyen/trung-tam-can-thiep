import type { Menu } from '@/types/database'

const DAYS = [
  { key: 'mon', label: 'T2' },
  { key: 'tue', label: 'T3' },
  { key: 'wed', label: 'T4' },
  { key: 'thu', label: 'T5' },
  { key: 'fri', label: 'T6' },
  { key: 'sat', label: 'T7' },
]

export function formatMenuText(menu: Menu): string {
  const start = new Date(menu.week_start)
  const end = new Date(start)
  end.setDate(end.getDate() + 5)

  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`

  const lines = [`🍱 THỰC ĐƠN TUẦN ${fmt(start)} - ${fmt(end)}`]
  lines.push('━━━━━━━━━━━━━━')

  for (const { key, label } of DAYS) {
    const breakfast = menu[`${key}_breakfast` as keyof Menu] as string | null
    const lunch = menu[`${key}_lunch` as keyof Menu] as string | null
    if (!breakfast && !lunch) continue
    const parts: string[] = []
    if (breakfast) parts.push(`Sáng: ${breakfast}`)
    if (lunch) parts.push(`Trưa: ${lunch}`)
    lines.push(`${label}: ${parts.join(' | ')}`)
  }

  return lines.join('\n')
}
