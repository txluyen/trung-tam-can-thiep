'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Student, Teacher } from '@/types/database'

interface Props {
  students: Pick<Student, 'id' | 'full_name' | 'enrollment_type'>[]
  teachers: Pick<Teacher, 'id' | 'full_name'>[]
  defaultDate?: string
  onSuccess: () => void
}

export function ScheduleForm({ students, teachers, defaultDate, onSuccess }: Props) {
  const supabase = createClient()
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-ink-900 font-semibold text-sm">Ngày *</Label>
        <Input type="date" value={form.date}
          onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required
          className="mt-1 rounded-[12px] border-[1.5px] border-[#DEDEE2] focus:border-sky-500" />
      </div>
      <div>
        <Label className="text-ink-900 font-semibold text-sm">Học sinh *</Label>
        <Select value={form.student_id} onValueChange={v => setForm(f => ({ ...f, student_id: v }))}>
          <SelectTrigger className="mt-1 rounded-[12px] border-[1.5px] border-[#DEDEE2]">
            <SelectValue placeholder="Chọn học sinh" />
          </SelectTrigger>
          <SelectContent>
            {students.map(s => <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-ink-900 font-semibold text-sm">Giáo viên *</Label>
        <Select value={form.teacher_id} onValueChange={v => setForm(f => ({ ...f, teacher_id: v }))}>
          <SelectTrigger className="mt-1 rounded-[12px] border-[1.5px] border-[#DEDEE2]">
            <SelectValue placeholder="Chọn giáo viên" />
          </SelectTrigger>
          <SelectContent>
            {teachers.map(t => <SelectItem key={t.id} value={t.id}>{t.full_name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-ink-900 font-semibold text-sm">Loại ca *</Label>
        <Select value={form.session_type} onValueChange={v => setForm(f => ({ ...f, session_type: v }))}>
          <SelectTrigger className="mt-1 rounded-[12px] border-[1.5px] border-[#DEDEE2]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="banTru">Bán trú</SelectItem>
            <SelectItem value="canThiep">Can thiệp</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-ink-900 font-semibold text-sm">Giờ bắt đầu</Label>
          <Input type="time" value={form.start_time}
            onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))}
            className="mt-1 rounded-[12px] border-[1.5px] border-[#DEDEE2] focus:border-sky-500" />
        </div>
        <div>
          <Label className="text-ink-900 font-semibold text-sm">Giờ kết thúc</Label>
          <Input type="time" value={form.end_time}
            onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))}
            className="mt-1 rounded-[12px] border-[1.5px] border-[#DEDEE2] focus:border-sky-500" />
        </div>
      </div>
      <Button type="submit" disabled={loading || !form.student_id || !form.teacher_id}
        className="w-full bg-sky-500 hover:bg-sky-700 text-white rounded-pill font-semibold shadow-sky transition-all hover:-translate-y-px">
        {loading ? 'Đang lưu...' : 'Tạo ca học'}
      </Button>
    </form>
  )
}
