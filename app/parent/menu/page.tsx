import { createClient } from '@/lib/supabase/server'

const DAYS = [
  { key: 'mon', label: 'Thứ 2' },
  { key: 'tue', label: 'Thứ 3' },
  { key: 'wed', label: 'Thứ 4' },
  { key: 'thu', label: 'Thứ 5' },
  { key: 'fri', label: 'Thứ 6' },
  { key: 'sat', label: 'Thứ 7' },
]

function getMondayOfWeek() {
  const d = new Date()
  const day = d.getDay()
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1))
  return d.toISOString().slice(0, 10)
}

export default async function ParentMenuPage() {
  const weekStart = getMondayOfWeek()
  const supabase = createClient()
  const { data: menu } = await supabase
    .from('menus')
    .select('*')
    .eq('week_start', weekStart)
    .maybeSingle()

  if (!menu) {
    return (
      <div className="text-center py-12 text-ink-400">
        <p className="text-lg mb-1">Chưa có thực đơn tuần này</p>
        <p className="text-sm">Thực đơn sẽ được cập nhật trước thứ 6 hàng tuần.</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-xl font-heading font-bold text-ink-900 mb-4">Thực đơn tuần này</h1>
      <div className="space-y-3">
        {DAYS.map(({ key, label }) => {
          const breakfast = menu[`${key}_breakfast` as keyof typeof menu] as string | null
          const lunch = menu[`${key}_lunch` as keyof typeof menu] as string | null
          if (!breakfast && !lunch) return null
          return (
            <div key={key} className="bg-white rounded-[14px] border border-line p-4 shadow-sm">
              <div className="font-semibold text-ink-900 mb-2">{label}</div>
              {breakfast && (
                <div className="text-sm text-ink-700">
                  <span className="text-ink-400">Sáng: </span>{breakfast}
                </div>
              )}
              {lunch && (
                <div className="text-sm text-ink-700 mt-0.5">
                  <span className="text-ink-400">Trưa: </span>{lunch}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
