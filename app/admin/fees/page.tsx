import { createClient } from '@/lib/supabase/server'
import { FeeTable } from '@/components/fees/FeeTable'

function getCurrentMonth() {
  const d = new Date()
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`
}

export default async function FeesPage({
  searchParams,
}: {
  searchParams: { month?: string }
}) {
  const month = searchParams.month ?? getCurrentMonth()
  const supabase = createClient()
  const { data: fees } = await supabase
    .from('fees')
    .select('*, students(full_name)')
    .eq('month', month)
    .order('created_at')

  return <FeeTable fees={(fees ?? []) as any} month={month} />
}
