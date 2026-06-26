'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import type { Salary, Teacher } from '@/types/database'

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'

type SalaryWithTeacher = Salary & { teachers: Pick<Teacher, 'full_name'> | null }

export function SalaryTable({ salaries, month }: { salaries: SalaryWithTeacher[]; month: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function generateSalaries() {
    setLoading(true)
    await fetch('/api/generate-salaries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month }),
    })
    setLoading(false)
    router.refresh()
  }

  const totalSalary = salaries.reduce((sum, s) => sum + s.total_salary, 0)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink-900">Lương giáo viên tháng {month}</h1>
          <p className="text-sm text-ink-400 mt-0.5">
            Tổng chi: <span className="text-coral-700 font-semibold">{fmt(totalSalary)}</span>
          </p>
        </div>
        <Button onClick={generateSalaries} disabled={loading}
          className="bg-sky-500 hover:bg-sky-700 text-white rounded-pill font-semibold shadow-sky transition-all hover:-translate-y-px">
          {loading ? 'Đang tính...' : '↻ Tổng kết tháng'}
        </Button>
      </div>

      <div className="bg-white rounded-[14px] shadow-sm border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-soft border-b border-line">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-ink-700">Giáo viên</th>
              <th className="text-right px-4 py-3 font-semibold text-ink-700">Lương cứng</th>
              <th className="text-right px-4 py-3 font-semibold text-ink-700">Phụ cấp CT</th>
              <th className="text-right px-4 py-3 font-semibold text-ink-700">Tổng lương</th>
              <th className="text-center px-4 py-3 font-semibold text-ink-700">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {salaries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-400">
                  Chưa có dữ liệu. Nhấn "Tổng kết tháng" để tính lương.
                </td>
              </tr>
            )}
            {salaries.map(s => (
              <tr key={s.id} className="border-b border-line hover:bg-bg-soft transition-colors">
                <td className="px-4 py-3 font-medium text-ink-900">{s.teachers?.full_name}</td>
                <td className="px-4 py-3 text-right text-ink-700">{fmt(s.base_salary)}</td>
                <td className="px-4 py-3 text-right text-ink-400 text-xs">
                  {s.canThiep_sessions} ca × {fmt(s.canThiep_bonus_per_session)}<br />
                  <span className="text-ink-700 text-sm font-medium">= {fmt(s.canThiep_bonus)}</span>
                </td>
                <td className="px-4 py-3 text-right font-bold text-ink-900">{fmt(s.total_salary)}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block text-xs px-2 py-1 rounded-pill font-semibold border ${
                    s.confirmed
                      ? 'bg-pastel-mint text-sky-700 border-sky-200'
                      : 'bg-pastel-cream text-ink-700 border-line'
                  }`}>
                    {s.confirmed ? 'Đã xác nhận' : 'Chờ xác nhận'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
