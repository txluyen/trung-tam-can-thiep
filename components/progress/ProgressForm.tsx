'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { Goal } from '@/types/database'

interface Props {
  scheduleId: string
  studentId: string
  teacherId: string
  date: string
  goals: Goal[]
  existing?: { goal_results: { goal_id: string; achieved: boolean }[]; notes: string | null }
}

export function ProgressForm({ studentId, teacherId, date, goals, existing }: Props) {
  const [results, setResults] = useState<Record<string, boolean>>(
    Object.fromEntries(
      existing?.goal_results.map(r => [r.goal_id, r.achieved]) ??
      goals.map(g => [g.id, false])
    )
  )
  const [notes, setNotes] = useState(existing?.notes ?? '')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  async function handleSave() {
    setLoading(true)
    const goal_results = goals.map(g => ({ goal_id: g.id, achieved: results[g.id] ?? false }))
    await supabase.from('progress_reports').upsert({
      student_id: studentId,
      teacher_id: teacherId,
      date,
      goal_results,
      notes: notes || null,
    }, { onConflict: 'student_id,date,teacher_id' })
    setLoading(false)
    setSaved(true)
    router.push('/teacher/schedule')
  }

  if (goals.length === 0) {
    return (
      <p className="text-ink-400 text-center py-8">
        Chưa có mục tiêu nào được tạo cho học sinh này.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {goals.map(g => (
          <div key={g.id} className="bg-white rounded-[14px] border border-line p-4 shadow-sm">
            <p className="font-medium text-ink-900 mb-3">{g.title}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setResults(r => ({ ...r, [g.id]: true }))}
                className={`flex-1 py-3 rounded-[12px] border-2 font-semibold transition-all ${
                  results[g.id]
                    ? 'border-sky-500 bg-pastel-mint text-sky-700'
                    : 'border-line bg-bg-soft text-ink-400'
                }`}>
                ✓ Đạt
              </button>
              <button
                onClick={() => setResults(r => ({ ...r, [g.id]: false }))}
                className={`flex-1 py-3 rounded-[12px] border-2 font-semibold transition-all ${
                  !results[g.id]
                    ? 'border-coral-400 bg-pastel-blush text-coral-700'
                    : 'border-line bg-bg-soft text-ink-400'
                }`}>
                ⏳ Chưa đạt
              </button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="text-sm font-semibold text-ink-900">Ghi chú của giáo viên</label>
        <Textarea
          className="mt-1 rounded-[12px] border-[1.5px] border-[#DEDEE2] focus:border-sky-500"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Nhận xét ngắn về buổi học..."
          rows={3}
        />
      </div>

      {saved && (
        <p className="text-center text-sky-700 font-semibold bg-pastel-mint rounded-[12px] py-3">
          Đã lưu tiến độ!
        </p>
      )}

      <Button onClick={handleSave} disabled={loading}
        className="w-full py-6 text-lg bg-coral-400 hover:bg-coral-700 text-white rounded-pill shadow-coral font-semibold transition-all hover:-translate-y-px">
        {loading ? 'Đang lưu...' : 'Lưu tiến độ'}
      </Button>
    </div>
  )
}
