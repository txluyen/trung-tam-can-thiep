'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TeacherForm } from './TeacherForm'
import type { Teacher } from '@/types/database'

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'

export function TeacherListClient({ teachers }: { teachers: Teacher[] }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Teacher | undefined>()
  const router = useRouter()

  function handleSuccess() {
    setOpen(false)
    setEditing(undefined)
    router.refresh()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink-900">Giáo viên</h1>
          <p className="text-sm text-ink-400 mt-0.5">{teachers.length} giáo viên đang làm việc</p>
        </div>
        <Button onClick={() => { setEditing(undefined); setOpen(true) }}
          className="bg-coral-400 hover:bg-coral-700 text-white rounded-pill font-semibold shadow-coral transition-all hover:-translate-y-px">
          + Thêm giáo viên
        </Button>
      </div>

      <div className="bg-white rounded-[14px] shadow-sm border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-soft border-b border-line">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-ink-700">Họ tên</th>
              <th className="text-left px-4 py-3 font-semibold text-ink-700">Email</th>
              <th className="text-left px-4 py-3 font-semibold text-ink-700">SĐT</th>
              <th className="text-left px-4 py-3 font-semibold text-ink-700">Lương cứng</th>
              <th className="text-left px-4 py-3 font-semibold text-ink-700">Phụ cấp/ca CT</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {teachers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-400">
                  Chưa có giáo viên nào. Nhấn "+ Thêm giáo viên" để bắt đầu.
                </td>
              </tr>
            )}
            {teachers.map(t => (
              <tr key={t.id} className="border-b border-line hover:bg-bg-soft transition-colors">
                <td className="px-4 py-3 font-medium text-ink-900">{t.full_name}</td>
                <td className="px-4 py-3 text-ink-400">{t.email ?? '—'}</td>
                <td className="px-4 py-3 text-ink-400">{t.phone ?? '—'}</td>
                <td className="px-4 py-3 text-ink-700 font-medium">{fmt(t.base_salary)}</td>
                <td className="px-4 py-3 text-ink-700">{fmt(t.canThiep_bonus_per_session)}</td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm"
                    className="text-sky-700 hover:text-sky-500 hover:bg-sky-50"
                    onClick={() => { setEditing(t); setOpen(true) }}>
                    Sửa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-[20px]">
          <DialogHeader>
            <DialogTitle className="font-heading text-ink-900">
              {editing ? 'Sửa thông tin giáo viên' : 'Thêm giáo viên mới'}
            </DialogTitle>
          </DialogHeader>
          <TeacherForm teacher={editing} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
