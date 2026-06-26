'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import type { Teacher } from '@/types/database'

interface Props {
  teacher?: Teacher
  onSuccess: () => void
}

export function TeacherForm({ teacher, onSuccess }: Props) {
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
    const supabase = createClient()
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

  const inputClass = "mt-1.5 w-full rounded-[12px] border-[1.5px] border-[#DEDEE2] px-3 py-2.5 text-sm text-ink-900 bg-white focus:outline-none focus:border-sky-400 transition-colors"
  const labelClass = "block text-sm font-semibold text-ink-700"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Thông tin cá nhân */}
      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-400">Thông tin giáo viên</p>

        <div>
          <label className={labelClass}>Họ và tên <span className="text-coral-500">*</span></label>
          <input
            value={form.full_name}
            onChange={set('full_name')}
            required
            placeholder="Nguyễn Thị B"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="gv@opensky.vn"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Số điện thoại</label>
            <input
              value={form.phone}
              onChange={set('phone')}
              placeholder="0901234567"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <hr className="border-line" />

      {/* Lương */}
      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-400">Lương & phụ cấp</p>

        <div>
          <label className={labelClass}>Lương cứng/tháng (đ) <span className="text-coral-500">*</span></label>
          <input
            type="number"
            value={form.base_salary}
            onChange={set('base_salary')}
            required
            placeholder="8.000.000"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Phụ cấp/buổi can thiệp (đ) <span className="text-coral-500">*</span></label>
          <p className="text-xs text-ink-400 mt-0.5">Cộng thêm mỗi buổi CT giáo viên có mặt</p>
          <input
            type="number"
            value={form.canThiep_bonus_per_session}
            onChange={set('canThiep_bonus_per_session')}
            required
            placeholder="50.000"
            className={inputClass}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-coral-400 hover:bg-coral-500 text-white rounded-pill font-semibold py-3 shadow-coral transition-all hover:-translate-y-px disabled:opacity-60"
      >
        {loading ? 'Đang lưu...' : teacher ? '✓ Cập nhật giáo viên' : '+ Thêm giáo viên'}
      </Button>
    </form>
  )
}
