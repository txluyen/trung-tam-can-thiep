'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import type { Student, Teacher } from '@/types/database'

interface Props {
  students: Pick<Student, 'id' | 'full_name' | 'enrollment_type'>[]
  teachers: Pick<Teacher, 'id' | 'full_name'>[]
  defaultDate?: string
  onSuccess: () => void
}

const SESSION_TYPES = [
  { value: 'canThiep', label: 'Can thiệp', activeClass: 'bg-pastel-blush border-coral-300 text-coral-700' },
  { value: 'banTru', label: 'Bán trú', activeClass: 'bg-pastel-blue border-sky-400 text-sky-700' },
]

export function ScheduleForm({ students, teachers, defaultDate, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    date: defaultDate ?? new Date().toISOString().slice(0, 10),
    student_id: '',
    teacher_id: '',
    session_type: 'canThiep',
    start_time: '08:00',
    end_time: '09:00',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.student_id || !form.teacher_id) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('schedules').insert({
      date: form.date,
      student_id: form.student_id,
      teacher_id: form.teacher_id,
      session_type: form.session_type as 'banTru' | 'canThiep',
      start_time: form.start_time,
      end_time: form.end_time,
      status: 'scheduled',
    })
    setLoading(false)
    onSuccess()
  }

  const inputClass = "mt-1.5 w-full rounded-[12px] border-[1.5px] border-[#DEDEE2] px-3 py-2.5 text-sm text-ink-900 bg-white focus:outline-none focus:border-sky-400 transition-colors"
  const labelClass = "block text-sm font-semibold text-ink-700"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Ngày */}
      <div>
        <label className={labelClass}>Ngày <span className="text-coral-500">*</span></label>
        <input
          type="date"
          value={form.date}
          onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
          required
          className={inputClass}
        />
      </div>

      <hr className="border-line" />

      {/* Loại ca — toggle */}
      <div>
        <label className={labelClass}>Loại ca <span className="text-coral-500">*</span></label>
        <div className="mt-1.5 flex gap-3">
          {SESSION_TYPES.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm(f => ({ ...f, session_type: opt.value }))}
              className={`flex-1 py-2.5 rounded-[12px] text-sm font-semibold border-[1.5px] transition-all ${
                form.session_type === opt.value
                  ? opt.activeClass
                  : 'bg-white border-[#DEDEE2] text-ink-400 hover:border-sky-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-line" />

      {/* Học sinh & Giáo viên */}
      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-400">Người tham gia</p>

        <div>
          <label className={labelClass}>Học sinh <span className="text-coral-500">*</span></label>
          <select
            value={form.student_id}
            onChange={e => setForm(f => ({ ...f, student_id: e.target.value }))}
            required
            className={inputClass}
          >
            <option value="">— Chọn học sinh —</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.full_name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Giáo viên <span className="text-coral-500">*</span></label>
          <select
            value={form.teacher_id}
            onChange={e => setForm(f => ({ ...f, teacher_id: e.target.value }))}
            required
            className={inputClass}
          >
            <option value="">— Chọn giáo viên —</option>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>{t.full_name}</option>
            ))}
          </select>
        </div>
      </div>

      <hr className="border-line" />

      {/* Giờ */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-3">Thời gian</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Bắt đầu</label>
            <input
              type="time"
              value={form.start_time}
              onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Kết thúc</label>
            <input
              type="time"
              value={form.end_time}
              onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading || !form.student_id || !form.teacher_id}
        className="w-full bg-coral-400 hover:bg-coral-500 text-white rounded-pill font-semibold py-3 shadow-coral transition-all hover:-translate-y-px disabled:opacity-60"
      >
        {loading ? 'Đang lưu...' : '+ Tạo ca học'}
      </Button>
    </form>
  )
}
