import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { calculateTeacherSalary } from '@/lib/calculations/salaries'

function parseMonth(month: string) {
  const [mm, yyyy] = month.split('-')
  const monthStart = `${yyyy}-${mm}-01`
  const lastDay = new Date(Number(yyyy), Number(mm), 0).getDate()
  const monthEnd = `${yyyy}-${mm}-${String(lastDay).padStart(2, '0')}`
  return { monthStart, monthEnd }
}

export async function POST(req: NextRequest) {
  const { month } = await req.json()
  const supabase = createClient()
  const { monthStart, monthEnd } = parseMonth(month)

  const { data: teachers } = await supabase.from('teachers').select('*').eq('active', true)
  if (!teachers) return NextResponse.json({ error: 'Không đủ dữ liệu' }, { status: 400 })

  for (const teacher of teachers) {
    const { count } = await supabase
      .from('attendance')
      .select('*, schedules!inner(teacher_id, session_type, date)', { count: 'exact', head: true })
      .eq('schedules.teacher_id', teacher.id)
      .eq('schedules.session_type', 'canThiep')
      .eq('teacher_present', true)
      .gte('schedules.date', monthStart)
      .lte('schedules.date', monthEnd)

    const calc = calculateTeacherSalary(teacher, count ?? 0)

    await supabase.from('salaries').upsert({
      teacher_id: teacher.id,
      month,
      base_salary: calc.base_salary,
      canThiep_sessions: calc.canThiep_sessions,
      canThiep_bonus_per_session: calc.canThiep_bonus_per_session,
      confirmed: false,
    }, { onConflict: 'teacher_id,month' })
  }

  return NextResponse.json({ success: true })
}
