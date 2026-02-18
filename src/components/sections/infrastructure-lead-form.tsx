'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
  website: '',
}

const draftStorageKey = 'infra_lead_form_draft_v1'

export function InfrastructureLeadForm() {
  const router = useRouter()
  const [formData, setFormData] = useState(() => {
    if (typeof window === 'undefined') return initialState
    try {
      const saved = window.localStorage.getItem(draftStorageKey)
      if (!saved) return initialState
      return { ...initialState, ...(JSON.parse(saved) as Partial<typeof initialState>) }
    } catch {
      return initialState
    }
  })
  const [attachment, setAttachment] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'error'>('idle')

  useEffect(() => {
    window.localStorage.setItem(draftStorageKey, JSON.stringify(formData))
  }, [formData])

  const onChange = (field: keyof typeof initialState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus('idle')

    try {
      const payload = new FormData()
      payload.set('contactName', formData.contactName)
      payload.set('organizationName', formData.organizationName)
      payload.set('organizationType', formData.organizationType)
      payload.set('email', formData.email)
      payload.set('phone', formData.phone)
      payload.set('teamSize', formData.teamSize)
      payload.set('currentStack', formData.currentStack)
      payload.set('criticalRisk', formData.criticalRisk)
      payload.set('timeline', formData.timeline)
      payload.set('budgetRange', formData.budgetRange)
      payload.set('preferredContact', formData.preferredContact)
      payload.set('notes', formData.notes)
      payload.set('website', formData.website)
      if (attachment) {
        payload.set('attachment', attachment)
      }

      const response = await fetch('/api/leads', {
        method: 'POST',
        body: payload,
      })

      if (!response.ok) {
        setStatus('error')
        setSubmitting(false)
        return
      }

      setSubmitting(false)
      setFormData(initialState)
      setAttachment(null)
      window.localStorage.removeItem(draftStorageKey)
      router.push('/thank-you?source=lead')
    } catch {
      setStatus('error')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border bg-card p-6">
      <div className="hidden" aria-hidden="true">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={(e) => onChange('website', e.target.value)}
        />
      </div>

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

      <div className="space-y-2">
        <Label htmlFor="attachment">فایل پیوست (اختیاری)</Label>
        <Input
          id="attachment"
          type="file"
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
          onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
        />
        <p className="text-xs text-muted-foreground">
          حداکثر 5MB. فرمت‌های مجاز: PDF, DOC, DOCX, TXT, PNG, JPG
        </p>
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

      {status === 'error' ? <p className="text-sm text-red-600">ارسال ناموفق بود. لطفا مجددا تلاش کنید.</p> : null}
    </form>
  )
}
