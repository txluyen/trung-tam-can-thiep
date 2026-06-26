'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Goal } from '@/types/database'

export function GoalList({ goals, studentId, studentName }: {
  goals: Goal[]
  studentId: string
  studentName: string
}) {
  const [newGoal, setNewGoal] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  async function addGoal() {
    if (!newGoal.trim()) return
    setLoading(true)
    await supabase.from('goals').insert({ student_id: studentId, title: newGoal.trim() })
    setNewGoal('')
    setLoading(false)
    router.refresh()
  }

  async function archiveGoal(id: string) {
    await supabase.from('goals').update({ archived: true }).eq('id', id)
    router.refresh()
  }

  const active = goals.filter(g => !g.archived)
  const archived = goals.filter(g => g.archived)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-ink-900">Mục tiêu</h1>
        <p className="text-sm text-ink-400 mt-0.5">{studentName} — {active.length} mục tiêu đang hoạt động</p>
      </div>

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Thêm mục tiêu mới..."
          value={newGoal}
          onChange={e => setNewGoal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addGoal()}
          className="rounded-[12px] border-[1.5px] border-[#DEDEE2] focus:border-sky-500"
        />
        <Button onClick={addGoal} disabled={loading || !newGoal.trim()}
          className="bg-coral-400 hover:bg-coral-700 text-white rounded-pill font-semibold shadow-coral transition-all hover:-translate-y-px whitespace-nowrap">
          + Thêm
        </Button>
      </div>

      <div className="space-y-2 mb-8">
        {active.length === 0 && (
          <p className="text-ink-400 text-center py-6">Chưa có mục tiêu nào. Nhập và nhấn Enter để thêm.</p>
        )}
        {active.map(g => (
          <div key={g.id}
            className="bg-white rounded-[12px] border border-line p-4 flex justify-between items-center shadow-sm hover:shadow-card transition-shadow">
            <span className="text-ink-900 font-medium">{g.title}</span>
            <Button variant="ghost" size="sm"
              className="text-ink-400 hover:text-coral-700 hover:bg-coral-50"
              onClick={() => archiveGoal(g.id)}>
              Lưu trữ
            </Button>
          </div>
        ))}
      </div>

      {archived.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-ink-400 uppercase tracking-wide mb-2">Đã lưu trữ</h2>
          <div className="space-y-1">
            {archived.map(g => (
              <div key={g.id} className="text-ink-400 text-sm py-2 border-b border-line">{g.title}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
