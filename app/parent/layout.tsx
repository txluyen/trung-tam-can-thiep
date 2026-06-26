import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ParentLayout({ children }: { children: React.ReactNode }) {
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
    <div className="min-h-screen bg-bg-soft pb-20">
      <header className="bg-sky-500 text-white px-4 py-3 sticky top-0 z-10 shadow-sky">
        <span className="font-heading font-bold tracking-wide">Open Sky</span>
      </header>
      <main className="max-w-lg mx-auto p-4">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-line flex shadow-card">
        <Link href="/parent/dashboard"
          className="flex-1 py-3 text-center text-sm text-ink-700 hover:text-sky-500 transition-colors font-medium">
          Con tôi
        </Link>
        <Link href="/parent/menu"
          className="flex-1 py-3 text-center text-sm text-ink-700 hover:text-sky-500 transition-colors font-medium">
          Menu tuần
        </Link>
        <form action={signOut} className="flex-1">
          <button type="submit"
            className="w-full py-3 text-center text-sm text-ink-400 hover:text-coral-700 transition-colors font-medium">
            Đăng xuất
          </button>
        </form>
      </nav>
    </div>
  )
}
