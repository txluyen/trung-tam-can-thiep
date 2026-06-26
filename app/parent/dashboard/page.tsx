import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

function getCurrentMonth() {
  const d = new Date()
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`
}

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'

const enrollmentLabel: Record<string, string> = {
  banTru: 'Bán trú',
  canThiep: 'Can thiệp',
  both: 'Bán trú + Can thiệp',
}

export default async function ParentDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: role } = await supabase
    .from('user_roles')
    .select('student_id')
    .eq('user_id', user.id)
    .single()

  if (!role?.student_id) {
    return (
      <p className="text-center py-12 text-ink-400">
        Tài khoản chưa được liên kết với học sinh. Liên hệ trung tâm để được hỗ trợ.
      </p>
    )
  }

  const studentId = role.student_id
  const currentMonth = getCurrentMonth()

  const { data: student } = await supabase
    .from('students').select('*').eq('id', studentId).single()
  const { data: fee } = await supabase
    .from('fees').select('*').eq('student_id', studentId).eq('month', currentMonth).maybeSingle()
  const [{ data: reports }, { data: goals }] = await Promise.all([
    supabase.from('progress_reports').select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false })
      .limit(5),
    supabase.from('goals').select('*').eq('student_id', studentId).eq('archived', false),
  ])

  const goalMap = Object.fromEntries((goals ?? []).map(g => [g.id, g.title]))

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-[14px] border border-line p-4 shadow-sm">
        <h1 className="text-xl font-heading font-bold text-ink-900">{student?.full_name}</h1>
        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-pill bg-pastel-blue text-sky-700 font-semibold border border-sky-200">
          {enrollmentLabel[student?.enrollment_type ?? ''] ?? ''}
        </span>
      </div>

      {fee && (
        <div className="bg-white rounded-[14px] border border-line p-4 shadow-sm">
          <h2 className="font-semibold text-ink-900 mb-3">Học phí tháng {currentMonth}</h2>
          <div className="space-y-1.5 text-sm">
            {fee.banTru_amount > 0 && (
              <div className="flex justify-between text-ink-700">
                <span>Bán trú</span>
                <span>{fmt(fee.banTru_amount)}</span>
              </div>
            )}
            {fee.canThiep_sessions > 0 && (
              <div className="flex justify-between text-ink-700">
                <span>Can thiệp ({fee.canThiep_sessions} buổi)</span>
                <span>{fmt(fee.canThiep_amount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-ink-900 border-t border-line pt-2 mt-2">
              <span>Tổng cộng</span>
              <span>{fmt(fee.total_amount)}</span>
            </div>
          </div>
          <span className={`inline-block mt-3 text-xs px-2 py-1 rounded-pill font-semibold border ${
            fee.paid
              ? 'bg-pastel-mint text-sky-700 border-sky-200'
              : 'bg-pastel-blush text-coral-700 border-coral-200'
          }`}>
            {fee.paid ? '✓ Đã đóng' : 'Chưa đóng'}
          </span>
        </div>
      )}

      <div className="bg-white rounded-[14px] border border-line p-4 shadow-sm">
        <h2 className="font-semibold text-ink-900 mb-3">Tiến độ gần đây</h2>
        {(reports ?? []).length === 0 && (
          <p className="text-ink-400 text-sm">Chưa có báo cáo nào.</p>
        )}
        {(reports ?? []).map(r => (
          <div key={r.id} className="border-b border-line pb-3 mb-3 last:border-0 last:mb-0">
            <div className="text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">{r.date}</div>
            {r.goal_results.map((gr: { goal_id: string; achieved: boolean }) => (
              <div key={gr.goal_id} className="text-sm flex items-center gap-2 py-0.5">
                <span>{gr.achieved ? '✅' : '⏳'}</span>
                <span className="text-ink-700">{goalMap[gr.goal_id] ?? 'Mục tiêu'}</span>
              </div>
            ))}
            {r.notes && (
              <p className="text-sm text-ink-400 mt-1.5 italic">"{r.notes}"</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
