import { createClient } from '@/lib/supabase/server'
import { TeacherListClient } from '@/components/teachers/TeacherList'

export default async function TeachersPage() {
  const supabase = createClient()
  const { data: teachers } = await supabase
    .from('teachers')
    .select('*')
    .eq('active', true)
    .order('full_name')
  return <TeacherListClient teachers={teachers ?? []} />
}
