import { createClient } from '@/lib/supabase/server'
import { AttendanceSheet } from '@/components/attendance/AttendanceSheet'
import { notFound } from 'next/navigation'

export default async function AttendancePage({ params }: { params: { scheduleId: string } }) {
  const supabase = createClient()
  const { data: schedule } = await supabase
    .from('schedules')
    .select('id, date, start_time, end_time, session_type, students(full_name), attendance(*)')
    .eq('id', params.scheduleId)
    .single()

  if (!schedule) notFound()

  const existing = Array.isArray(schedule.attendance)
    ? (schedule.attendance[0] as { student_present: boolean } | undefined) ?? null
    : null

  return (
    <div>
      <h1 className="text-xl font-heading font-bold text-ink-900 mb-1">Chấm công</h1>
      <p className="text-sm text-ink-400 mb-6">
        {schedule.date} • {schedule.start_time?.slice(0, 5)} – {schedule.end_time?.slice(0, 5)}
      </p>
      <AttendanceSheet
        scheduleId={schedule.id}
        studentName={(schedule.students as any)?.full_name ?? ''}
        existingAttendance={existing}
      />
    </div>
  )
}
