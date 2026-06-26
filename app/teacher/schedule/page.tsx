import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function TeacherSchedulePage() {
  const supabase = createClient()
  const today = new Date().toISOString().slice(0, 10)

  const { data: schedules } = await supabase
    .from('schedules')
    .select('id, date, session_type, start_time, end_time, status, students(full_name), attendance(id)')
    .eq('date', today)
    .order('start_time')

  const dateLabel = new Date(today).toLocaleDateString('vi-VN', {
    weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'
  })

  return (
    <div>
      <h1 className="text-xl font-heading font-bold text-ink-900 mb-1">Lịch hôm nay</h1>
      <p className="text-sm text-ink-400 mb-4">{dateLabel}</p>

      {(!schedules || schedules.length === 0) && (
        <div className="text-center py-12 text-ink-400">
          <p className="text-lg mb-1">Không có ca học hôm nay</p>
          <p className="text-sm">Nghỉ ngơi nào!</p>
        </div>
      )}

      <div className="space-y-3">
        {schedules?.map(s => {
          const hasAttendance = Array.isArray(s.attendance) && s.attendance.length > 0
          const isCanThiep = s.session_type === 'canThiep'
          return (
            <div key={s.id}
              className={`bg-white rounded-[14px] border p-4 shadow-sm ${isCanThiep ? 'border-coral-200' : 'border-sky-200'}`}>
              <div className="font-semibold text-ink-900 text-lg">
                {(s.students as any)?.full_name}
              </div>
              <div className="text-sm text-ink-400 mt-0.5 flex items-center gap-2">
                <span>{s.start_time?.slice(0, 5)} – {s.end_time?.slice(0, 5)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-pill font-semibold ${
                  isCanThiep ? 'bg-pastel-blush text-coral-700' : 'bg-pastel-blue text-sky-700'
                }`}>
                  {isCanThiep ? 'Can thiệp' : 'Bán trú'}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <Link href={`/teacher/attendance/${s.id}`}
                  className={`text-sm px-4 py-2 rounded-pill font-semibold transition-all hover:-translate-y-px ${
                    hasAttendance
                      ? 'bg-pastel-mint text-ink-700 border border-line'
                      : 'bg-sky-500 text-white shadow-sky'
                  }`}>
                  {hasAttendance ? '✓ Đã chấm công' : 'Chấm công'}
                </Link>
                {isCanThiep && (
                  <Link href={`/teacher/progress/${s.id}`}
                    className="text-sm px-4 py-2 rounded-pill font-semibold bg-coral-400 text-white shadow-coral transition-all hover:-translate-y-px">
                    Tiến độ
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
