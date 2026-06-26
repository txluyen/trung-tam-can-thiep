import type { Metadata } from 'next'
import { Bitter, Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'

const bitter = Bitter({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
})

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Open Sky — Quản Lý Trung Tâm',
  description: 'Hệ thống quản lý trung tâm can thiệp sớm Open Sky',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Open Sky' },
  viewport: { width: 'device-width', initialScale: 1, maximumScale: 1 },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${bitter.variable} ${beVietnamPro.variable} font-sans text-ink-700 antialiased`}>
        {children}
      </body>
    </html>
  )
}
