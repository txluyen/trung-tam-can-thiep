'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Student } from '@/types/database'

interface Props {
  student?: Student
  onSuccess: () => void
}

export function StudentForm({ student, onSuccess }: Props) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    full_name: student?.full_name ?? '',
    date_of_birth: student?.date_of_birth ?? '',
    enrollment_type: student?.enrollment_type ?? 'both',
    parent_name: student?.parent_name ?? '',
    parent_phone: student?.parent_phone ?? '',
    banTru_monthly_fee: student?.banTru_monthly_fee?.toString() ?? '',
    canThiep_fee_per_session: student?.canThiep_fee_per_session?.toString() ?? '',
    notes: student?.notes ?? '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const data = {
      full_name: form.full_name,
      date_of_birth: form.date_of_birth || null,
      enrollment_type: form.enrollment_type as Student['enrollment_type'],
      parent_name: form.parent_name || null,
      parent_phone: form.parent_phone || null,
      banTru_monthly_fee: form.banTru_monthly_fee ? Number(form.banTru_monthly_fee) : null,
      canThiep_fee_per_session: form.canThiep_fee_per_session ? Number(form.canThiep_fee_per_session) : null,
      notes: form.notes || null,
      active: true,
    }
    if (student) {
      await supabase.from('students').update(data).eq('id', student.id)
    } else {
      await supabase.from('students').insert(data)
    }
    setLoading(false)
    onSuccess()
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-ink-900 font-semibold text-sm">Họ tên *</Label>
        <Input value={form.full_name} onChange={set('full_name')} required
          className="mt-1 rounded-[12px] border-[1.5px] border-[#DEDEE2] focus:border-sky-500" />
      </div>
      <div>
        <Label className="text-ink-900 font-semibold text-sm">Ngày sinh</Label>
        <Input type="date" value={form.date_of_birth} onChange={set('date_of_birth')}
          className="mt-1 rounded-[12px] border-[1.5px] border-[#DEDEE2] focus:border-sky-500" />
      </div>
      <div>
        <Label className="text-ink-900 font-semibold text-sm">Loại hình *</Label>
        <Select value={form.enrollment_type}
          onValueChange={v => setForm(f => ({ ...f, enrollment_type: v }))}>
          <SelectTrigger className="mt-1 rounded-[12px] border-[1.5px] border-[#DEDEE2]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="banTru">Bán trú</SelectItem>
            <SelectItem value="canThiep">Can thiệp</SelectItem>
            <SelectItem value="both">Cả hai</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-ink-900 font-semibold text-sm">Phụ huynh</Label>
          <Input value={form.parent_name} onChange={set('parent_name')}
            className="mt-1 rounded-[12px] border-[1.5px] border-[#DEDEE2] focus:border-sky-500" />
        </div>
        <div>
          <Label className="text-ink-900 font-semibold text-sm">SĐT phụ huynh</Label>
          <Input value={form.parent_phone} onChange={set('parent_phone')}
            className="mt-1 rounded-[12px] border-[1.5px] border-[#DEDEE2] focus:border-sky-500" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-ink-900 font-semibold text-sm">Học phí bán trú/tháng</Label>
          <p className="text-xs text-ink-400 mb-1">Để trống = dùng mặc định</p>
          <Input type="number" value={form.banTru_monthly_fee} onChange={set('banTru_monthly_fee')}
            className="rounded-[12px] border-[1.5px] border-[#DEDEE2] focus:border-sky-500" />
        </div>
        <div>
          <Label className="text-ink-900 font-semibold text-sm">Học phí CT/buổi</Label>
          <p className="text-xs text-ink-400 mb-1">Để trống = dùng mặc định</p>
          <Input type="number" value={form.canThiep_fee_per_session} onChange={set('canThiep_fee_per_session')}
            className="rounded-[12px] border-[1.5px] border-[#DEDEE2] focus:border-sky-500" />
        </div>
      </div>
      <div>
        <Label className="text-ink-900 font-semibold text-sm">Ghi chú</Label>
        <Textarea value={form.notes} onChange={set('notes')}
          className="mt-1 rounded-[12px] border-[1.5px] border-[#DEDEE2] focus:border-sky-500" />
      </div>
      <Button type="submit" disabled={loading}
        className="w-full bg-sky-500 hover:bg-sky-700 text-white rounded-pill font-semibold shadow-sky transition-all hover:-translate-y-px">
        {loading ? 'Đang lưu...' : student ? 'Cập nhật' : 'Thêm học sinh'}
      </Button>
    </form>
  )
}
