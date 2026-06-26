import type { ProgressReport, Goal } from '@/types/database'

export function formatProgressReportText(
  studentName: string,
  month: string,
  reports: ProgressReport[],
  goals: Goal[]
): string {
  const goalMap = Object.fromEntries(goals.map(g => [g.id, g.title]))
  const totalSessions = reports.length

  const goalStats: Record<string, { achieved: number; total: number }> = {}
  for (const g of goals) goalStats[g.id] = { achieved: 0, total: 0 }

  for (const report of reports) {
    for (const result of report.goal_results) {
      if (!goalStats[result.goal_id]) continue
      goalStats[result.goal_id].total++
      if (result.achieved) goalStats[result.goal_id].achieved++
    }
  }

  const notes = reports
    .filter(r => r.notes)
    .slice(-3)
    .map(r => `• ${r.notes}`)
    .join('\n')

  const lines = [
    `📋 BÁO CÁO THÁNG ${month} - ${studentName}`,
    `Số buổi học: ${totalSessions} buổi`,
    '━━━━━━━━━━━━━━',
    'MỤC TIÊU:',
  ]

  for (const g of goals) {
    const stat = goalStats[g.id]
    if (!stat || stat.total === 0) continue
    const icon = stat.achieved / stat.total >= 0.7 ? '✅' : '⏳'
    lines.push(`${icon} ${goalMap[g.id]}: Đạt ${stat.achieved}/${stat.total} buổi`)
  }

  if (notes) {
    lines.push('━━━━━━━━━━━━━━')
    lines.push('NHẬN XÉT GV:')
    lines.push(notes)
  }

  return lines.join('\n')
}
