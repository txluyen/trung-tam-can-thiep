'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatProgressReportText } from '@/lib/zalo-export/progress-report'
import type { Student, Goal, ProgressReport } from '@/types/database'

function parseMonth(month: string) {
  const [mm, yyyy] = month.split('-')
  const monthStart = `${yyyy}-${mm}-01`
  const lastDay = new Date(Number(yyyy), Number(mm), 0).getDate()
  const monthEnd = `${yyyy}-${mm}-${String(lastDay).padStart(2, '0')}`
  return { monthStart, monthEnd }
}

export function ProgressExportClient({
  students,
  allGoals,
  month,
}: {
  students: Pick<Student, 'id' | 'full_name'>[]
  allGoals: Goal[]
  month: string
}) {
  const [selectedId, setSelectedId] = useState('')
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function generateReport(studentId: string) {
    setLoading(true)
    const student = students.find(s => s.id === studentId)
    if (!student) { setLoading(false); return }

    const { monthStart, monthEnd } = parseMonth(month)
    const { data: reports } = await supabase
      .from('progress_reports')
      .select('*')
      .eq('student_id', studentId)
      .gte('date', monthStart)
      .lte('date', monthEnd)

    const goals = allGoals.filter(g => g.student_id === studentId)
    setText(
      formatProgressReportText(
        student.full_name,
        month,
        (reports ?? []) as ProgressReport[],
        goals
      )
    )
    setLoading(false)
  }

  function copyZalo() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-ink-900">Xuất báo cáo tiến độ</h1>
        <p className="text-sm text-ink-400 mt-0.5">Tháng {month}</p>
      </div>

      <div className="flex gap-3 mb-6">
        <Select
          value={selectedId}
          onValueChange={v => { setSelectedId(v); generateReport(v) }}>
          <SelectTrigger className="w-72 rounded-[12px] border-[1.5px] border-[#DEDEE2]">
            <SelectValue placeholder="Chọn học sinh" />
          </SelectTrigger>
          <SelectContent>
            {students.map(s => (
              <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading && <p className="text-ink-400">Đang tạo báo cáo...</p>}

      {text && (
        <div className="bg-white rounded-[14px] border border-line p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-ink-900">Nội dung copy vào Zalo</h2>
            <Button variant="outline" size="sm" onClick={copyZalo}
              className="rounded-pill border-sky-200 text-sky-700 hover:bg-sky-50">
              {copied ? '✓ Đã copy!' : 'Copy'}
            </Button>
          </div>
          <pre className="text-sm whitespace-pre-wrap bg-bg-soft rounded-[8px] p-3 font-mono text-ink-700">
            {text}
          </pre>
        </div>
      )}
    </div>
  )
}
