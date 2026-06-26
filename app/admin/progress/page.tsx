import { createClient } from '@/lib/supabase/server'
import { ProgressExportClient } from '@/components/progress/ProgressView'

function getCurrentMonth() {
  const d = new Date()
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`
}

export default async function AdminProgressPage({
  searchParams,
}: {
  searchParams: { month?: string }
}) {
  const month = searchParams.month ?? getCurrentMonth()
  const supabase = createClient()

  const [{ data: students }, { data: goals }] = await Promise.all([
    supabase.from('students').select('id, full_name').eq('active', true).order('full_name'),
    supabase.from('goals').select('*').eq('archived', false),
  ])

  return (
    <ProgressExportClient
      students={students ?? []}
      allGoals={goals ?? []}
      month={month}
    />
  )
}
