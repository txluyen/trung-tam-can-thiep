import { createClient } from '@/lib/supabase/server'
import { GoalList } from '@/components/goals/GoalList'
import { notFound } from 'next/navigation'

export default async function GoalsPage({ params }: { params: { studentId: string } }) {
  const supabase = createClient()
  const { data: student } = await supabase
    .from('students').select('*').eq('id', params.studentId).single()
  if (!student) notFound()
  const { data: goals } = await supabase
    .from('goals').select('*').eq('student_id', params.studentId).order('created_at')
  return (
    <GoalList
      goals={goals ?? []}
      studentId={params.studentId}
      studentName={student.full_name}
    />
  )
}
