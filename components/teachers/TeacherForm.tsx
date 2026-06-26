'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Teacher } from '@/types/database'

interface Props {
  teacher?: Teacher
  onSuccess: () => void
}

export function TeacherForm({ teacher, onSuccess }: Props) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    full_name: teacher?.full_name ?? '',
    email: teacher?.email ?? '',
    phone: teacher?.phone ?? '',
    base_salary: teacher?.base_salary?.toString() ?? '',
    canThiep_bonus_per_session: teacher?.canThiep_bonus_per_session?.toString() ?? '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const data = {
      full_name: form.full_name,
      email: form.email || null,
      phone: form.phone || null,
      base_salary: Number(form.base_salary),
      canThiep_bonus_per_session: Number(form.canThiep_bonus_per_session),
      active: true,
    }
    if (teacher) {
      await supabase.from('teachers').update(data).eq('id', teacher.id)
    } else {
      await supabase.from('teachers').insert({ ...data, user_id: null })
    }
    setLoading(false)
    onSuccess()
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-ink-900 font-semibold text-sm">Họ tên *</Label>
        <Input value={form.full_name} onChange={set('full_name')} required
          className="mt-1 rounded-[12px] border-[1.5px] border-[#DEDEE2] focus:border-sky-500" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-ink-900 font-semibold text-sm">Email</Label>
          <Input type="email" value={form.email} onChange={set('email')}
            className="mt-1 rounded-[12px] border-[1.5px] border-[#DEDEE2] focus:border-sky-500" />
        </div>
        <div>
          <Label className="text-ink-900 font-semibold text-sm">SĐT</Label>
          <Input value={form.phone} onChange={set('phone')}
            className="mt-1 rounded-[12px] border-[1.5px] border-[#DEDEE2] focus:border-sky-500" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-ink-900 font-semibold text-sm">Lương cứng/tháng *</Label>
          <Input type="number" value={form.base_salary} onChange={set('base_salary')} required
            className="mt-1 rounded-[12px] border-[1.5px] border-[#DEDEE2] focus:border-sky-500" />
        </div>
        <div>
          <Label className="text-ink-900 font-semibold text-sm">Phụ cấp/ca CT *</Label>
          <Input type="number" value={form.canThiep_bonus_per_session}
            onChange={set('canThiep_bonus_per_session')} required
            className="mt-1 rounded-[12px] border-[1.5px] border-[#DEDEE2] focus:border-sky-500" />
        </div>
      </div>
      <Button type="submit" disabled={loading}
        className="w-full bg-sky-500 hover:bg-sky-700 text-white rounded-pill font-semibold shadow-sky transition-all hover:-translate-y-px">
        {loading ? 'Đang lưu...' : teacher ? 'Cập nhật' : 'Thêm giáo viên'}
      </Button>
    </form>
  )
}
