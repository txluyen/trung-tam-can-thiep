'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

interface Props {
  scheduleId: string
  studentName: string
  existingAttendance?: { student_present: boolean } | null
}

export function AttendanceSheet({ scheduleId, studentName, existingAttendance }: Props) {
  const [studentPresent, setStudentPresent] = useState(
    existingAttendance?.student_present ?? true
  )
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(!!existingAttendance)
  const supabase = createClient()
  const router = useRouter()

  async function handleSave() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('attendance').upsert({
      schedule_id: scheduleId,
      student_present: studentPresent,
      teacher_present: true,
      recorded_by: user?.id,
    }, { onConflict: 'schedule_id' })
    setLoading(false)
    setSaved(true)
    router.push('/teacher/schedule')
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[14px] border border-line p-5 shadow-sm">
        <h2 className="font-semibold text-ink-900 mb-4 text-lg">Học sinh: {studentName}</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setStudentPresent(true)}
            className={`flex-1 py-5 rounded-[14px] border-2 text-lg font-semibold transition-all ${
              studentPresent
                ? 'border-sky-500 bg-pastel-mint text-sky-700 shadow-sky'
                : 'border-line bg-bg-soft text-ink-400'
            }`}>
            ✓ Có mặt
          </button>
          <button
            onClick={() => setStudentPresent(false)}
            className={`flex-1 py-5 rounded-[14px] border-2 text-lg font-semibold transition-all ${
              !studentPresent
                ? 'border-coral-500 bg-pastel-blush text-coral-700 shadow-coral'
                : 'border-line bg-bg-soft text-ink-400'
            }`}>
            ✗ Vắng
          </button>
        </div>
      </div>

      {saved && (
        <p className="text-center text-sky-700 font-semibold bg-pastel-mint rounded-[12px] py-3">
          Đã lưu chấm công
        </p>
      )}

      <Button onClick={handleSave} disabled={loading}
        className="w-full py-6 text-lg bg-sky-500 hover:bg-sky-700 text-white rounded-pill shadow-sky font-semibold transition-all hover:-translate-y-px">
        {loading ? 'Đang lưu...' : 'Lưu chấm công'}
      </Button>
    </div>
  )
}
