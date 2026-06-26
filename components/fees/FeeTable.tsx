'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import type { Fee, Student } from '@/types/database'

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'

type FeeWithStudent = Fee & { students: Pick<Student, 'full_name'> | null }

export function FeeTable({ fees, month }: { fees: FeeWithStudent[]; month: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function generateFees() {
    setLoading(true)
    await fetch('/api/generate-fees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month }),
    })
    setLoading(false)
    router.refresh()
  }

  const total = fees.reduce((sum, f) => sum + f.total_amount, 0)
  const collected = fees.filter(f => f.paid).reduce((sum, f) => sum + f.total_amount, 0)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink-900">Học phí tháng {month}</h1>
          <p className="text-sm text-ink-400 mt-0.5">
            Đã thu: <span className="text-sky-700 font-semibold">{fmt(collected)}</span>
            {' '}/ Tổng: {fmt(total)}
          </p>
        </div>
        <Button onClick={generateFees} disabled={loading}
          className="bg-sky-500 hover:bg-sky-700 text-white rounded-pill font-semibold shadow-sky transition-all hover:-translate-y-px">
          {loading ? 'Đang tính...' : '↻ Tổng kết tháng'}
        </Button>
      </div>

      <div className="bg-white rounded-[14px] shadow-sm border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-soft border-b border-line">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-ink-700">Học sinh</th>
              <th className="text-right px-4 py-3 font-semibold text-ink-700">Bán trú</th>
              <th className="text-right px-4 py-3 font-semibold text-ink-700">Can thiệp</th>
              <th className="text-right px-4 py-3 font-semibold text-ink-700">Tổng</th>
              <th className="text-center px-4 py-3 font-semibold text-ink-700">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {fees.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-400">
                  Chưa có dữ liệu. Nhấn "Tổng kết tháng" để tính học phí.
                </td>
              </tr>
            )}
            {fees.map(f => (
              <tr key={f.id} className="border-b border-line hover:bg-bg-soft transition-colors">
                <td className="px-4 py-3 font-medium text-ink-900">{f.students?.full_name}</td>
                <td className="px-4 py-3 text-right text-ink-700">{fmt(f.banTru_amount)}</td>
                <td className="px-4 py-3 text-right text-ink-400 text-xs">
                  {f.canThiep_sessions} buổi × {fmt(f.canThiep_fee_per_session)}<br />
                  <span className="text-ink-700 text-sm font-medium">= {fmt(f.canThiep_amount)}</span>
                </td>
                <td className="px-4 py-3 text-right font-bold text-ink-900">{fmt(f.total_amount)}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block text-xs px-2 py-1 rounded-pill font-semibold border ${
                    f.paid
                      ? 'bg-pastel-mint text-sky-700 border-sky-200'
                      : 'bg-pastel-blush text-coral-700 border-coral-200'
                  }`}>
                    {f.paid ? 'Đã thu' : 'Chưa thu'}
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
