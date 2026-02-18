import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AdminLoginForm } from '@/components/admin/admin-login-form'

export const metadata: Metadata = {
  title: 'Admin Login',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-muted/30">
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  )
}
