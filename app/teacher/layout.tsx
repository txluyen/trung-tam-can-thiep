import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  async function signOut() {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-bg-soft">
      <header className="bg-sky-500 text-white px-4 py-3 flex justify-between items-center shadow-sky sticky top-0 z-10">
        <span className="font-heading font-bold text-white tracking-wide">Open Sky</span>
        <nav className="flex gap-4 text-sm">
          <Link href="/teacher/schedule" className="text-white/80 hover:text-white transition-colors">Lịch dạy</Link>
        </nav>
        <form action={signOut}>
          <button type="submit" className="text-sm text-white/70 hover:text-white transition-colors">
            Đăng xuất
          </button>
        </form>
      </header>
      <main className="max-w-lg mx-auto p-4 pb-8">{children}</main>
    </div>
  )
}
