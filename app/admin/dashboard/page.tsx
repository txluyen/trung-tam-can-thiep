import { createClient } from '@/lib/supabase/server'

function getCurrentMonth() {
  const d = new Date()
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`
}

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'

export default async function DashboardPage() {
  const supabase = createClient()
  const today = new Date().toISOString().slice(0, 10)
  const currentMonth = getCurrentMonth()

  const [
    { count: presentToday },
    { count: totalStudents },
    { data: fees },
    { count: totalTeachers },
  ] = await Promise.all([
    supabase
      .from('attendance')
      .select('*, schedules!inner(date)', { count: 'exact', head: true })
      .eq('schedules.date', today)
      .eq('student_present', true),
    supabase.from('students').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('fees').select('total_amount, paid').eq('month', currentMonth),
    supabase.from('teachers').select('*', { count: 'exact', head: true }).eq('active', true),
  ])

  const totalFees = (fees ?? []).reduce((s, f) => s + f.total_amount, 0)
  const collectedFees = (fees ?? []).filter(f => f.paid).reduce((s, f) => s + f.total_amount, 0)
  const uncollected = totalFees - collectedFees

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-ink-900 mb-6">Tổng quan</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-pastel-blue rounded-[14px] border border-sky-200 p-4 shadow-sm">
          <div className="text-sm text-sky-700 font-semibold">Có mặt hôm nay</div>
          <div className="text-4xl font-heading font-bold text-sky-700 mt-1">
            {presentToday ?? 0}
            <span className="text-lg text-ink-400 font-sans">/{totalStudents ?? 0}</span>
          </div>
          <div className="text-xs text-sky-700 mt-1">học sinh</div>
        </div>

        <div className="bg-pastel-blush rounded-[14px] border border-coral-200 p-4 shadow-sm">
          <div className="text-sm text-coral-700 font-semibold">Chưa thu tháng {currentMonth}</div>
          <div className="text-2xl font-heading font-bold text-coral-700 mt-1">{fmt(uncollected)}</div>
          <div className="text-xs text-ink-400 mt-1">/ tổng {fmt(totalFees)}</div>
        </div>

        <div className="bg-pastel-mint rounded-[14px] border border-line p-4 shadow-sm">
          <div className="text-sm text-ink-700 font-semibold">Đã thu tháng {currentMonth}</div>
          <div className="text-2xl font-heading font-bold text-ink-900 mt-1">{fmt(collectedFees)}</div>
        </div>

        <div className="bg-pastel-cream rounded-[14px] border border-line p-4 shadow-sm">
          <div className="text-sm text-ink-700 font-semibold">Giáo viên</div>
          <div className="text-4xl font-heading font-bold text-ink-900 mt-1">{totalTeachers ?? 0}</div>
        </div>
      </div>

      <div className="bg-pastel-cream border border-[#e8d9a0] rounded-[14px] p-4">
        <h2 className="font-semibold text-ink-900 mb-2">Nhắc việc</h2>
        <ul className="text-sm text-ink-700 space-y-1.5">
          <li>• Lên menu tuần tới trước thứ 6</li>
          <li>• Xuất báo cáo tiến độ cuối tháng gửi phụ huynh qua Zalo</li>
          <li>• Xác nhận bảng lương trước ngày 5 tháng sau</li>
        </ul>
      </div>
    </div>
  )
}
