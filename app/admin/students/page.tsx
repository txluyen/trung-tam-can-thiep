import { createClient } from '@/lib/supabase/server'
import { StudentListClient } from '@/components/students/StudentList'

export default async function StudentsPage() {
  const supabase = createClient()
  const { data: students } = await supabase
    .from('students')
    .select('*')
    .eq('active', true)
    .order('full_name')
  return <StudentListClient students={students ?? []} />
}
