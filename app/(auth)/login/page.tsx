'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email hoặc mật khẩu không đúng')
      setLoading(false)
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <div className="w-full max-w-sm px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="text-2xl font-heading font-bold text-sky-500">Open Sky</span>
        </div>
        <p className="text-ink-400 text-sm">Hệ thống quản lý trung tâm</p>
      </div>
      <Card className="shadow-card border-line">
        <CardHeader>
          <CardTitle className="text-center font-heading text-ink-900">Đăng nhập</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-ink-700 font-medium text-sm">Email</Label>
              <Input id="email" type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="mt-1 border-line focus:border-sky-500"
                required />
            </div>
            <div>
              <Label htmlFor="password" className="text-ink-700 font-medium text-sm">Mật khẩu</Label>
              <Input id="password" type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 border-line focus:border-sky-500"
                required />
            </div>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <Button type="submit"
              className="w-full bg-coral-400 hover:bg-coral-500 text-white shadow-coral rounded-pill font-semibold"
              disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
