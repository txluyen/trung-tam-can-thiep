'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { StudentForm } from './StudentForm'
import type { Student } from '@/types/database'

const enrollmentLabel: Record<Student['enrollment_type'], string> = {
  banTru: 'Bán trú',
  canThiep: 'Can thiệp',
  both: 'Cả hai',
}

const enrollmentColor: Record<Student['enrollment_type'], string> = {
  banTru: 'bg-pastel-blue text-sky-700 border-sky-200',
  canThiep: 'bg-pastel-blush text-coral-700 border-coral-200',
  both: 'bg-pastel-mint text-ink-700 border-line',
}

export function StudentListClient({ students }: { students: Student[] }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Student | undefined>()
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
          <h1 className="text-2xl font-heading font-bold text-ink-900">Học sinh</h1>
          <p className="text-sm text-ink-400 mt-0.5">{students.length} học sinh đang học</p>
        </div>
        <Button onClick={() => { setEditing(undefined); setOpen(true) }}
          className="bg-coral-400 hover:bg-coral-700 text-white rounded-pill font-semibold shadow-coral transition-all hover:-translate-y-px">
          + Thêm học sinh
        </Button>
      </div>

      <div className="bg-white rounded-[14px] shadow-sm border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-soft border-b border-line">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-ink-700">Họ tên</th>
              <th className="text-left px-4 py-3 font-semibold text-ink-700">Loại hình</th>
              <th className="text-left px-4 py-3 font-semibold text-ink-700">Phụ huynh</th>
              <th className="text-left px-4 py-3 font-semibold text-ink-700">SĐT</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-400">
                  Chưa có học sinh nào. Nhấn "+ Thêm học sinh" để bắt đầu.
                </td>
              </tr>
            )}
            {students.map(s => (
              <tr key={s.id} className="border-b border-line hover:bg-bg-soft transition-colors">
                <td className="px-4 py-3 font-medium text-ink-900">{s.full_name}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-pill text-xs font-semibold border ${enrollmentColor[s.enrollment_type]}`}>
                    {enrollmentLabel[s.enrollment_type]}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-700">{s.parent_name ?? '—'}</td>
                <td className="px-4 py-3 text-ink-400">{s.parent_phone ?? '—'}</td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm"
                    className="text-sky-700 hover:text-sky-500 hover:bg-sky-50"
                    onClick={() => { setEditing(s); setOpen(true) }}>
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
              {editing ? 'Sửa thông tin học sinh' : 'Thêm học sinh mới'}
            </DialogTitle>
          </DialogHeader>
          <StudentForm student={editing} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
