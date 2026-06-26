import { createClient } from '@/lib/supabase/server'
import { SalaryTable } from '@/components/salaries/SalaryTable'

function getCurrentMonth() {
  const d = new Date()
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`
}

export default async function SalariesPage({
  searchParams,
}: {
  searchParams: { month?: string }
}) {
  const month = searchParams.month ?? getCurrentMonth()
  const supabase = createClient()
  const { data: salaries } = await supabase
    .from('salaries')
    .select('*, teachers(full_name)')
    .eq('month', month)
    .order('created_at')

  return <SalaryTable salaries={(salaries ?? []) as any} month={month} />
}
