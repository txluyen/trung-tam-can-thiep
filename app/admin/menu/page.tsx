import { createClient } from '@/lib/supabase/server'
import { MenuForm } from '@/components/menu/MenuForm'

function getMondayOfWeek(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d.toISOString().slice(0, 10)
}

export default async function MenuPage({ searchParams }: { searchParams: { week?: string } }) {
  const weekStart = searchParams.week ?? getMondayOfWeek()
  const supabase = createClient()
  const { data: menu } = await supabase
    .from('menus')
    .select('*')
    .eq('week_start', weekStart)
    .maybeSingle()

  return <MenuForm weekStart={weekStart} existing={menu ?? undefined} />
}
