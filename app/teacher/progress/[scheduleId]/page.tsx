import { createClient } from '@/lib/supabase/server'
import { ProgressForm } from '@/components/progress/ProgressForm'
import { notFound } from 'next/navigation'

export default async function TeacherProgressPage({ params }: { params: { scheduleId: string } }) {
  const supabase = createClient()
  const { data: schedule } = await supabase
    .from('schedules')
    .select('id, date, student_id, teacher_id, students(full_name)')
    .eq('id', params.scheduleId)
    .single()

  if (!schedule) notFound()

  const [{ data: goals }, { data: existing }] = await Promise.all([
    supabase.from('goals').select('*')
      .eq('student_id', schedule.student_id)
      .eq('archived', false)
      .order('created_at'),
    supabase.from('progress_reports')
      .select('goal_results, notes')
      .eq('student_id', schedule.student_id)
      .eq('date', schedule.date)
      .eq('teacher_id', schedule.teacher_id)
      .maybeSingle(),
  ])

  return (
    <div>
      <h1 className="text-xl font-heading font-bold text-ink-900 mb-1">Cập nhật tiến độ</h1>
      <p className="text-sm text-ink-400 mb-6">
        {(schedule.students as any)?.full_name} • {schedule.date}
      </p>
      <ProgressForm
        scheduleId={params.scheduleId}
        studentId={schedule.student_id}
        teacherId={schedule.teacher_id}
        date={schedule.date}
        goals={goals ?? []}
        existing={existing ?? undefined}
      />
    </div>
  )
}
