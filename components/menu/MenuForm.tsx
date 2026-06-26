'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatMenuText } from '@/lib/zalo-export/menu'
import type { Menu } from '@/types/database'

const DAYS = [
  { key: 'mon', label: 'Thứ 2' },
  { key: 'tue', label: 'Thứ 3' },
  { key: 'wed', label: 'Thứ 4' },
  { key: 'thu', label: 'Thứ 5' },
  { key: 'fri', label: 'Thứ 6' },
  { key: 'sat', label: 'Thứ 7' },
]

export function MenuForm({ weekStart, existing }: { weekStart: string; existing?: Menu }) {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const initForm = () =>
    Object.fromEntries(
      DAYS.flatMap(({ key }) => [
        [`${key}_breakfast`, (existing?.[`${key}_breakfast` as keyof Menu] as string) ?? ''],
        [`${key}_lunch`, (existing?.[`${key}_lunch` as keyof Menu] as string) ?? ''],
      ])
    )

  const [form, setForm] = useState<Record<string, string>>(initForm)

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  async function handleSave() {
    setLoading(true)
    const data = {
      week_start: weekStart,
      ...Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v || null])),
    }
    await supabase.from('menus').upsert(data, { onConflict: 'week_start' })
    setLoading(false)
    router.refresh()
  }

  function copyZalo() {
    const menuData = {
      id: '', week_start: weekStart, created_at: '',
      ...Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v || null])),
    } as Menu
    navigator.clipboard.writeText(formatMenuText(menuData))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink-900">Menu tuần</h1>
          <p className="text-sm text-ink-400 mt-0.5">Từ {weekStart}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={copyZalo}
            className="rounded-pill border-sky-200 text-sky-700 hover:bg-sky-50">
            {copied ? '✓ Đã copy!' : 'Copy Zalo'}
          </Button>
          <Button onClick={handleSave} disabled={loading}
            className="bg-coral-400 hover:bg-coral-700 text-white rounded-pill font-semibold shadow-coral transition-all hover:-translate-y-px">
            {loading ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[14px] shadow-sm border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-soft border-b border-line">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-ink-700 w-24">Ngày</th>
              <th className="text-left px-4 py-3 font-semibold text-ink-700">Bữa sáng</th>
              <th className="text-left px-4 py-3 font-semibold text-ink-700">Bữa trưa</th>
            </tr>
          </thead>
          <tbody>
            {DAYS.map(({ key, label }) => (
              <tr key={key} className="border-b border-line">
                <td className="px-4 py-2 font-semibold text-ink-700">{label}</td>
                <td className="px-2 py-2">
                  <Input
                    value={form[`${key}_breakfast`]}
                    onChange={set(`${key}_breakfast`)}
                    placeholder="Bữa sáng..."
                    className="text-sm rounded-[8px] border-[1.5px] border-[#DEDEE2] focus:border-sky-500"
                  />
                </td>
                <td className="px-2 py-2">
                  <Input
                    value={form[`${key}_lunch`]}
                    onChange={set(`${key}_lunch`)}
                    placeholder="Bữa trưa..."
                    className="text-sm rounded-[8px] border-[1.5px] border-[#DEDEE2] focus:border-sky-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
