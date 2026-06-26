import { createClient } from '@/lib/supabase/server'
import { GoalList } from '@/components/goals/GoalList'
import { notFound } from 'next/navigation'

export default async function GoalsPage({ params }: { params: { studentId: string } }) {
  const supabase = createClient()
  const [{ data: student }, { data: goals }] = await Promise.all([
    supabase.from('students').select('full_name').eq('id', params.studentId).single(),
    supabase.from('goals').select('*').eq('student_id', params.studentId).order('created_at'),
  ])
  if (!student) notFound()
  return (
    <GoalList
      goals={goals ?? []}
      studentId={params.studentId}
      studentName={student.full_name}
    />
  )
}
