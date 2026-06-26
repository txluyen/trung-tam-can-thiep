'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScheduleForm } from './ScheduleForm'
import type { Student, Teacher } from '@/types/database'

const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

const sessionColor = {
  banTru: 'bg-pastel-blue border-sky-200 text-sky-700',
  canThiep: 'bg-pastel-blush border-coral-200 text-coral-700',
}

interface ScheduleRow {
  id: string
  date: string
  session_type: string
  start_time: string | null
  end_time: string | null
  students: { full_name: string } | null
  teachers: { full_name: string } | null
}

interface Props {
  schedules: ScheduleRow[]
  students: Pick<Student, 'id' | 'full_name' | 'enrollment_type'>[]
  teachers: Pick<Teacher, 'id' | 'full_name'>[]
  weekStart: string
  today: string
}

export function SchedulesPageClient({ schedules, students, teachers, weekStart, today }: Props) {
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(today)
  const router = useRouter()

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d.toISOString().slice(0, 10)
  })

  function handleSuccess() { setOpen(false); router.refresh() }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink-900">Lịch học tuần</h1>
          <p className="text-sm text-ink-400 mt-0.5">
            {weekStart.slice(8)}/{weekStart.slice(5, 7)} — {days[6].slice(8)}/{days[6].slice(5, 7)}
          </p>
        </div>
        <Button onClick={() => { setSelectedDate(today); setOpen(true) }}
          className="bg-coral-400 hover:bg-coral-700 text-white rounded-pill font-semibold shadow-coral transition-all hover:-translate-y-px">
          + Tạo ca học
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => {
          const daySchedules = schedules.filter(s => s.date === day)
          const isToday = day === today
          return (
            <div key={day}
              className={`bg-white rounded-[14px] border p-2 min-h-36 ${isToday ? 'border-sky-500 shadow-sky' : 'border-line'}`}>
              <div className={`text-xs font-semibold mb-2 ${isToday ? 'text-sky-500' : 'text-ink-400'}`}>
                {DAYS[i]}<br />{day.slice(8)}/{day.slice(5, 7)}
              </div>
              <div className="space-y-1">
                {daySchedules.map(s => (
                  <div key={s.id}
                    className={`text-xs rounded-[8px] border p-1.5 ${sessionColor[s.session_type as keyof typeof sessionColor] ?? 'bg-bg-soft border-line text-ink-700'}`}>
                    <div className="font-semibold truncate">{s.students?.full_name}</div>
                    <div className="text-xs opacity-70 truncate">{s.teachers?.full_name}</div>
                    {s.start_time && (
                      <div className="text-xs opacity-60 mt-0.5">
                        {s.start_time.slice(0, 5)}–{s.end_time?.slice(0, 5)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                className="text-xs text-sky-500 hover:text-sky-700 mt-1 transition-colors"
                onClick={() => { setSelectedDate(day); setOpen(true) }}>
                + Thêm
              </button>
            </div>
          )
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-[20px]">
          <DialogHeader>
            <DialogTitle className="font-heading text-ink-900">Tạo ca học</DialogTitle>
          </DialogHeader>
          <ScheduleForm
            students={students}
            teachers={teachers}
            defaultDate={selectedDate}
            onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
