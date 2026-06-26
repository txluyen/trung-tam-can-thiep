import { createClient } from '@/lib/supabase/server'

function getToday() {
  return new Date().toISOString().slice(0, 10)
}

const sessionLabel: Record<string, string> = {
  banTru: 'Bán trú',
  canThiep: 'Can thiệp',
}

export default async function AdminAttendancePage({
  searchParams,
}: {
  searchParams: { date?: string }
}) {
  const supabase = createClient()
  const date = searchParams.date ?? getToday()

  const { data: records } = await supabase
    .from('schedules')
    .select('id, date, session_type, start_time, students(full_name), teachers(full_name), attendance(*)')
    .eq('date', date)
    .order('start_time')

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-ink-900 mb-6">Chấm công</h1>

      <form method="get" className="flex items-center gap-3 mb-6">
        <input
          type="date"
          name="date"
          defaultValue={date}
          className="border border-[#DEDEE2] rounded-[10px] px-3 py-2 text-sm text-ink-700 focus:outline-none focus:border-sky-400"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-sky-500 text-white text-sm font-semibold rounded-pill shadow-sky hover:bg-sky-600 transition-colors"
        >
          Xem
        </button>
      </form>

      {(!records || records.length === 0) ? (
        <div className="bg-white rounded-[14px] border border-line p-8 text-center text-ink-400">
          Không có lịch học nào ngày {date}.
        </div>
      ) : (
        <div className="bg-white rounded-[14px] border border-line overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-soft border-b border-line">
                <th className="text-left px-4 py-3 text-ink-500 font-semibold">Giờ</th>
                <th className="text-left px-4 py-3 text-ink-500 font-semibold">Học sinh</th>
                <th className="text-left px-4 py-3 text-ink-500 font-semibold">Giáo viên</th>
                <th className="text-left px-4 py-3 text-ink-500 font-semibold">Loại</th>
                <th className="text-left px-4 py-3 text-ink-500 font-semibold">HS có mặt</th>
                <th className="text-left px-4 py-3 text-ink-500 font-semibold">GV có mặt</th>
              </tr>
            </thead>
            <tbody>
              {records.map((s) => {
                const att = Array.isArray(s.attendance) ? s.attendance[0] : null
                return (
                  <tr key={s.id} className="border-b border-line last:border-0 hover:bg-bg-soft transition-colors">
                    <td className="px-4 py-3 text-ink-700 font-mono">
                      {(s.start_time as string)?.slice(0, 5)}
                    </td>
                    <td className="px-4 py-3 text-ink-900 font-medium">
                      {(s.students as any)?.full_name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-ink-700">
                      {(s.teachers as any)?.full_name ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-pill font-semibold border ${
                        s.session_type === 'canThiep'
                          ? 'bg-pastel-blush text-coral-700 border-coral-200'
                          : 'bg-pastel-blue text-sky-700 border-sky-200'
                      }`}>
                        {sessionLabel[s.session_type as string] ?? s.session_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {att == null ? (
                        <span className="text-ink-300 text-xs">Chưa chấm</span>
                      ) : att.student_present ? (
                        <span className="text-sky-600 font-semibold">✓ Có mặt</span>
                      ) : (
                        <span className="text-coral-500 font-semibold">✗ Vắng</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {att == null ? (
                        <span className="text-ink-300 text-xs">Chưa chấm</span>
                      ) : att.teacher_present ? (
                        <span className="text-sky-600 font-semibold">✓ Có mặt</span>
                      ) : (
                        <span className="text-coral-500 font-semibold">✗ Vắng</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
