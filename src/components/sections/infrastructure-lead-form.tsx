'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const initialState = {
  contactName: '',
  organizationName: '',
  organizationType: 'government_contractor',
  email: '',
  phone: '',
  teamSize: '',
  currentStack: '',
  criticalRisk: '',
  timeline: '',
  budgetRange: '60-120m-irr',
  preferredContact: 'email',
  notes: '',
}

export function InfrastructureLeadForm() {
  const [formData, setFormData] = useState(initialState)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const onChange = (field: keyof typeof initialState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus('idle')

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        setStatus('error')
        setSubmitting(false)
        return
      }

      setStatus('success')
      setSubmitting(false)
      setFormData(initialState)
    } catch {
      setStatus('error')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border bg-card p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contactName">نام تماس</Label>
          <Input id="contactName" value={formData.contactName} onChange={(e) => onChange('contactName', e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="organizationName">نام سازمان</Label>
          <Input id="organizationName" value={formData.organizationName} onChange={(e) => onChange('organizationName', e.target.value)} required />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">ایمیل سازمانی</Label>
          <Input id="email" type="email" value={formData.email} onChange={(e) => onChange('email', e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">شماره تماس</Label>
          <Input id="phone" value={formData.phone} onChange={(e) => onChange('phone', e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="teamSize">اندازه تیم فنی</Label>
          <Input id="teamSize" value={formData.teamSize} onChange={(e) => onChange('teamSize', e.target.value)} placeholder="مثلا 12" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timeline">افق زمانی</Label>
          <Input id="timeline" value={formData.timeline} onChange={(e) => onChange('timeline', e.target.value)} placeholder="مثلا 30 روز" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="currentStack">زیرساخت/استک فعلی</Label>
        <Input id="currentStack" value={formData.currentStack} onChange={(e) => onChange('currentStack', e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="criticalRisk">مهم‌ترین ریسک فعلی</Label>
        <Textarea id="criticalRisk" value={formData.criticalRisk} onChange={(e) => onChange('criticalRisk', e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">توضیحات تکمیلی</Label>
        <Textarea id="notes" value={formData.notes} onChange={(e) => onChange('notes', e.target.value)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="budgetRange">بازه بودجه</Label>
          <select
            id="budgetRange"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            value={formData.budgetRange}
            onChange={(e) => onChange('budgetRange', e.target.value)}
          >
            <option value="60-120m-irr">60 تا 120 میلیون تومان</option>
            <option value="120m-plus-irr">بیش از 120 میلیون تومان</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferredContact">کانال ترجیحی ارتباط</Label>
          <select
            id="preferredContact"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            value={formData.preferredContact}
            onChange={(e) => onChange('preferredContact', e.target.value)}
          >
            <option value="email">ایمیل</option>
            <option value="phone">تماس</option>
            <option value="telegram">تلگرام</option>
          </select>
        </div>
      </div>

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? 'در حال ارسال...' : 'درخواست ارزیابی ریسک زیرساخت'}
      </Button>

      {status === 'success' ? <p className="text-sm text-green-600">درخواست ثبت شد. به‌زودی با شما تماس می‌گیریم.</p> : null}
      {status === 'error' ? <p className="text-sm text-red-600">ارسال ناموفق بود. لطفا مجددا تلاش کنید.</p> : null}
    </form>
  )
}
