import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { calculateStudentFee } from '@/lib/calculations/fees'

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

  const [{ data: students }, { data: settings }] = await Promise.all([
    supabase.from('students').select('*').eq('active', true),
    supabase.from('center_settings').select('*').single(),
  ])

  if (!students || !settings) {
    return NextResponse.json({ error: 'Không đủ dữ liệu' }, { status: 400 })
  }

  const results = []
  for (const student of students) {
    const { count } = await supabase
      .from('attendance')
      .select('*, schedules!inner(student_id, session_type, date)', { count: 'exact', head: true })
      .eq('schedules.student_id', student.id)
      .eq('schedules.session_type', 'canThiep')
      .eq('student_present', true)
      .gte('schedules.date', monthStart)
      .lte('schedules.date', monthEnd)

    const calc = calculateStudentFee(student, settings, count ?? 0)

    await supabase.from('fees').upsert({
      student_id: student.id,
      month,
      banTru_amount: calc.banTru_amount,
      canThiep_sessions: calc.canThiep_sessions,
      canThiep_fee_per_session: calc.canThiep_fee_per_session,
      paid: false,
    }, { onConflict: 'student_id,month' })

    results.push({ student: student.full_name, total: calc.total_amount })
  }

  return NextResponse.json({ success: true, results })
}
