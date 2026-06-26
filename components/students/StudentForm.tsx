'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Student } from '@/types/database'

interface Props {
  student?: Student
  onSuccess: () => void
}

const enrollmentOptions = [
  { value: 'banTru', label: 'Bán trú' },
  { value: 'canThiep', label: 'Can thiệp' },
  { value: 'both', label: 'Bán trú + Can thiệp' },
]

export function StudentForm({ student, onSuccess }: Props) {
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
    const supabase = createClient()
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

  const inputClass = "mt-1.5 w-full rounded-[12px] border-[1.5px] border-[#DEDEE2] px-3 py-2.5 text-sm text-ink-900 bg-white focus:outline-none focus:border-sky-400 transition-colors"
  const labelClass = "block text-sm font-semibold text-ink-700"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Thông tin học sinh */}
      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-400">Học sinh</p>

        <div>
          <label className={labelClass}>Họ và tên <span className="text-coral-500">*</span></label>
          <input
            value={form.full_name}
            onChange={set('full_name')}
            required
            placeholder="Nguyễn Văn A"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Ngày sinh</label>
          <input
            type="date"
            value={form.date_of_birth}
            onChange={set('date_of_birth')}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Loại hình <span className="text-coral-500">*</span></label>
          <div className="mt-1.5 flex gap-2">
            {enrollmentOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm(f => ({ ...f, enrollment_type: opt.value }))}
                className={`flex-1 py-2 px-2 rounded-[12px] text-sm font-semibold border-[1.5px] transition-all ${
                  form.enrollment_type === opt.value
                    ? opt.value === 'banTru'
                      ? 'bg-pastel-blue border-sky-400 text-sky-700'
                      : opt.value === 'canThiep'
                      ? 'bg-pastel-blush border-coral-300 text-coral-700'
                      : 'bg-pastel-mint border-sky-300 text-sky-700'
                    : 'bg-white border-[#DEDEE2] text-ink-400 hover:border-sky-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-line" />

      {/* Phụ huynh */}
      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-400">Phụ huynh</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Họ tên</label>
            <input
              value={form.parent_name}
              onChange={set('parent_name')}
              placeholder="Nguyễn Văn B"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Số điện thoại</label>
            <input
              value={form.parent_phone}
              onChange={set('parent_phone')}
              placeholder="0901234567"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <hr className="border-line" />

      {/* Học phí riêng (tuỳ chọn) */}
      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-400">Học phí riêng <span className="normal-case font-normal text-ink-300">(bỏ trống = dùng mặc định)</span></p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Bán trú/tháng (đ)</label>
            <input
              type="number"
              value={form.banTru_monthly_fee}
              onChange={set('banTru_monthly_fee')}
              placeholder="3.000.000"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Can thiệp/buổi (đ)</label>
            <input
              type="number"
              value={form.canThiep_fee_per_session}
              onChange={set('canThiep_fee_per_session')}
              placeholder="150.000"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <hr className="border-line" />

      {/* Ghi chú */}
      <div>
        <label className={labelClass}>Ghi chú</label>
        <textarea
          value={form.notes}
          onChange={set('notes')}
          rows={3}
          placeholder="Lưu ý đặc biệt, tình trạng sức khoẻ..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-coral-400 hover:bg-coral-500 text-white rounded-pill font-semibold py-3 shadow-coral transition-all hover:-translate-y-px disabled:opacity-60"
      >
        {loading ? 'Đang lưu...' : student ? '✓ Cập nhật học sinh' : '+ Thêm học sinh'}
      </Button>
    </form>
  )
}
