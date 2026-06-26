import { createClient } from '@/lib/supabase/server'
import { SchedulesPageClient } from '@/components/schedules/WeekView'

function getMondayOfWeek(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d.toISOString().slice(0, 10)
}

export default async function SchedulesPage() {
  const supabase = createClient()
  const today = new Date().toISOString().slice(0, 10)
  const weekStart = getMondayOfWeek()
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)
  const weekEndStr = weekEnd.toISOString().slice(0, 10)

  const [{ data: schedules }, { data: students }, { data: teachers }] = await Promise.all([
    supabase
      .from('schedules')
      .select('id, date, session_type, start_time, end_time, students(full_name), teachers(full_name)')
      .gte('date', weekStart)
      .lte('date', weekEndStr)
      .order('date')
      .order('start_time'),
    supabase.from('students').select('id, full_name, enrollment_type').eq('active', true).order('full_name'),
    supabase.from('teachers').select('id, full_name').eq('active', true).order('full_name'),
  ])

  return (
    <SchedulesPageClient
      schedules={(schedules ?? []) as any}
      students={students ?? []}
      teachers={teachers ?? []}
      weekStart={weekStart}
      today={today} />
  )
}
