'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { trackEvent } from '@/lib/analytics/client'
import { useI18n } from '@/lib/i18n-context'

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
  const pathname = usePathname()
  const { language } = useI18n()
  const [step, setStep] = useState<1 | 2>(1)
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
  const viewTrackedRef = useRef(false)

  const locale = useMemo(() => (pathname.startsWith('/en') ? 'en' : 'fa'), [pathname])
  const isFa = language === 'fa'
  const copy = useMemo(
    () => ({
      stepOneTitle: isFa ? '1) اطلاعات پایه' : '1) Basic Information',
      stepTwoTitle: isFa ? '2) جزئیات فنی و ارزیابی' : '2) Technical Assessment',
      stepOneHint: isFa ? 'اطلاعات تماس و سازمان را کامل کنید.' : 'Complete organization and contact details.',
      stepTwoHint: isFa ? 'جزئیات فنی برای ارزیابی دقیق‌تر را وارد کنید.' : 'Provide technical context for a precise assessment.',
      contactName: isFa ? 'نام تماس' : 'Contact Name',
      orgName: isFa ? 'نام سازمان' : 'Organization Name',
      orgEmail: isFa ? 'ایمیل سازمانی' : 'Work Email',
      phone: isFa ? 'شماره تماس' : 'Phone',
      preferredContact: isFa ? 'کانال ترجیحی ارتباط' : 'Preferred Contact Channel',
      prefEmail: isFa ? 'ایمیل' : 'Email',
      prefPhone: isFa ? 'تماس' : 'Phone Call',
      prefTelegram: isFa ? 'تلگرام' : 'Telegram',
      nextStep: isFa ? 'مرحله بعد: جزئیات فنی' : 'Next Step: Technical Details',
      teamSize: isFa ? 'اندازه تیم فنی' : 'Engineering Team Size',
      teamSizePh: isFa ? 'مثلا 12' : 'e.g. 12',
      timeline: isFa ? 'افق زمانی' : 'Timeline',
      timelinePh: isFa ? 'مثلا 30 روز' : 'e.g. 30 days',
      currentStack: isFa ? 'زیرساخت/استک فعلی' : 'Current Infrastructure / Stack',
      criticalRisk: isFa ? 'مهم‌ترین ریسک فعلی' : 'Most Critical Current Risk',
      notes: isFa ? 'توضیحات تکمیلی' : 'Additional Notes',
      attachment: isFa ? 'فایل پیوست (اختیاری)' : 'Attachment (Optional)',
      attachmentHint: isFa
        ? 'حداکثر 5MB. فرمت‌های مجاز: PDF, DOC, DOCX, TXT, PNG, JPG'
        : 'Max 5MB. Allowed formats: PDF, DOC, DOCX, TXT, PNG, JPG',
      budget: isFa ? 'بازه بودجه' : 'Budget Range',
      budgetLow: isFa ? '60 تا 120 میلیون تومان' : '60M to 120M IRR',
      budgetHigh: isFa ? 'بیش از 120 میلیون تومان' : 'Above 120M IRR',
      orgType: isFa ? 'نوع سازمان' : 'Organization Type',
      orgGovernment: isFa ? 'سازمان دولتی/پیمانکاری' : 'Government / Contractor',
      orgPrivate: isFa ? 'شرکت خصوصی' : 'Private Enterprise',
      orgSemiPrivate: isFa ? 'نیمه‌خصوصی' : 'Semi-Private',
      orgStartup: isFa ? 'استارتاپ' : 'Startup',
      back: isFa ? 'بازگشت به مرحله قبل' : 'Back to Previous Step',
      submit: isFa ? 'درخواست ارزیابی ریسک زیرساخت' : 'Request Infrastructure Risk Assessment',
      submitting: isFa ? 'در حال ارسال...' : 'Submitting...',
      submitError: isFa ? 'ارسال ناموفق بود. لطفا مجددا تلاش کنید.' : 'Submission failed. Please try again.',
      stepOneLegend: isFa ? 'مرحله اول اطلاعات پایه' : 'Step 1 basic information',
      stepTwoLegend: isFa ? 'مرحله دوم جزئیات فنی' : 'Step 2 technical details',
    }),
    [isFa]
  )

  useEffect(() => {
    window.localStorage.setItem(draftStorageKey, JSON.stringify(formData))
  }, [formData])

  useEffect(() => {
    if (viewTrackedRef.current) return
    viewTrackedRef.current = true
    void trackEvent({
      name: 'qualification_view',
      category: 'engagement',
      locale,
    })
  }, [locale])

  const onChange = (field: keyof typeof initialState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isStepOneValid =
    formData.contactName.trim().length > 1 &&
    formData.organizationName.trim().length > 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.preferredContact.length > 0
  const progress = step === 1 ? 50 : 100
  const selectClass =
    'h-11 w-full rounded-md border border-input bg-background px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring'

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
        void trackEvent({
          name: 'qualification_submit_failed',
          category: 'conversion',
          locale,
        })
        setStatus('error')
        setSubmitting(false)
        return
      }

      void trackEvent({
        name: 'qualification_submit_success',
        category: 'conversion',
        locale,
      })
      setSubmitting(false)
      setFormData(initialState)
      setAttachment(null)
      setStep(1)
      window.localStorage.removeItem(draftStorageKey)
      router.push(`/${locale}/thank-you?source=lead`)
    } catch {
      void trackEvent({
        name: 'qualification_submit_failed',
        category: 'conversion',
        locale,
      })
      setStatus('error')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border bg-card/90 p-5 md:p-6 shadow-sm">
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

      <div className="space-y-2 rounded-xl border border-border/60 bg-muted/30 p-3">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className={step === 1 ? 'font-semibold text-primary' : 'text-muted-foreground'}>{copy.stepOneTitle}</span>
          <span className="text-muted-foreground">/</span>
          <span className={step === 2 ? 'font-semibold text-primary' : 'text-muted-foreground'}>{copy.stepTwoTitle}</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-background/80 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {step === 1 ? copy.stepOneHint : copy.stepTwoHint}
        </p>
      </div>

      {step === 1 ? (
        <fieldset className="space-y-4 reveal-up">
          <legend className="sr-only">{copy.stepOneLegend}</legend>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactName">{copy.contactName}</Label>
              <Input id="contactName" value={formData.contactName} onChange={(e) => onChange('contactName', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organizationName">{copy.orgName}</Label>
              <Input id="organizationName" value={formData.organizationName} onChange={(e) => onChange('organizationName', e.target.value)} required />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">{copy.orgEmail}</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => onChange('email', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{copy.phone}</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => onChange('phone', e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredContact">{copy.preferredContact}</Label>
            <select
              id="preferredContact"
              className={selectClass}
              value={formData.preferredContact}
              onChange={(e) => onChange('preferredContact', e.target.value)}
            >
              <option value="email">{copy.prefEmail}</option>
              <option value="phone">{copy.prefPhone}</option>
              <option value="telegram">{copy.prefTelegram}</option>
            </select>
          </div>

          <Button
            type="button"
            className="w-full h-11 shine-effect"
            disabled={!isStepOneValid}
            onClick={() => {
              void trackEvent({
                name: 'qualification_step1_submit',
                category: 'conversion',
                locale,
              })
              setStep(2)
            }}
          >
            {copy.nextStep}
          </Button>
        </fieldset>
      ) : (
        <fieldset className="space-y-4 reveal-up">
          <legend className="sr-only">{copy.stepTwoLegend}</legend>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="teamSize">{copy.teamSize}</Label>
              <Input id="teamSize" value={formData.teamSize} onChange={(e) => onChange('teamSize', e.target.value)} placeholder={copy.teamSizePh} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline">{copy.timeline}</Label>
              <Input id="timeline" value={formData.timeline} onChange={(e) => onChange('timeline', e.target.value)} placeholder={copy.timelinePh} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentStack">{copy.currentStack}</Label>
            <Input id="currentStack" value={formData.currentStack} onChange={(e) => onChange('currentStack', e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="criticalRisk">{copy.criticalRisk}</Label>
            <Textarea id="criticalRisk" value={formData.criticalRisk} onChange={(e) => onChange('criticalRisk', e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{copy.notes}</Label>
            <Textarea id="notes" value={formData.notes} onChange={(e) => onChange('notes', e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachment">{copy.attachment}</Label>
            <Input
              id="attachment"
              type="file"
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-muted-foreground">{copy.attachmentHint}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="budgetRange">{copy.budget}</Label>
              <select
                id="budgetRange"
                className={selectClass}
                value={formData.budgetRange}
                onChange={(e) => onChange('budgetRange', e.target.value)}
              >
                <option value="60-120m-irr">{copy.budgetLow}</option>
                <option value="120m-plus-irr">{copy.budgetHigh}</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="organizationType">{copy.orgType}</Label>
              <select
                id="organizationType"
                className={selectClass}
                value={formData.organizationType}
                onChange={(e) => onChange('organizationType', e.target.value)}
              >
                <option value="government_contractor">{copy.orgGovernment}</option>
                <option value="private_enterprise">{copy.orgPrivate}</option>
                <option value="semi_private">{copy.orgSemiPrivate}</option>
                <option value="startup">{copy.orgStartup}</option>
              </select>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <Button type="button" variant="outline" className="h-11 card-hover" onClick={() => setStep(1)} data-testid="qualification-back-button">
              {copy.back}
            </Button>
            <Button type="submit" disabled={submitting} className="w-full h-11 shine-effect">
              {submitting ? copy.submitting : copy.submit}
            </Button>
          </div>

          {status === 'error' ? <p className="text-sm text-red-600">{copy.submitError}</p> : null}
        </fieldset>
      )}
    </form>
  )
}
