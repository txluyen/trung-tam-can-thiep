import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { href: '/admin/dashboard', label: 'Tổng quan' },
  { href: '/admin/students', label: 'Học sinh' },
  { href: '/admin/teachers', label: 'Giáo viên' },
  { href: '/admin/schedules', label: 'Lịch học' },
  { href: '/admin/attendance', label: 'Chấm công' },
  { href: '/admin/fees', label: 'Học phí' },
  { href: '/admin/salaries', label: 'Lương GV' },
  { href: '/admin/progress', label: 'Tiến độ' },
  { href: '/admin/menu', label: 'Menu tuần' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
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
    <div className="flex h-screen">
      <aside className="w-56 bg-ink-900 text-white flex flex-col">
        <div className="p-4 font-heading font-bold text-lg border-b border-white/10 text-sky-300">Open Sky</div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              className="block px-3 py-2 rounded-md hover:bg-white/10 text-sm text-white/80 hover:text-white transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={signOut} className="p-2">
          <button type="submit" className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 rounded-md text-white/60 hover:text-white transition-colors">
            Đăng xuất
          </button>
        </form>
      </aside>
      <main className="flex-1 overflow-auto p-6 bg-bg-soft">{children}</main>
    </div>
  )
}
