'use client'

import { FormEvent, useState } from 'react'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export default function EngineeringRequestPage() {
  const [state, setState] = useState<SubmitState>('idle')
  const [requestId, setRequestId] = useState('')
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
    hpField: '',
  })

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setState('submitting')
    setError('')

    try {
      const response = await fetch('/api/engineering-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = (await response.json()) as { success?: boolean; requestId?: string; message?: string }
      if (!response.ok || !data.success) {
        setState('error')
        setError(data.message || 'Submission failed')
        return
      }
      setRequestId(data.requestId || '')
      setState('success')
    } catch {
      setState('error')
      setError('Network error')
    }
  }

  return (
    <main className="container mx-auto px-4 py-20 max-w-3xl">
      <div className="space-y-3 mb-8">
        <h1 className="text-3xl font-bold">Engineering Request</h1>
        <p className="text-muted-foreground">Share your scope and goals. You will receive a request ID after submission.</p>
      </div>

      {state === 'success' ? (
        <div className="rounded-xl border p-6 space-y-2">
          <h2 className="text-xl font-semibold">Request Submitted</h2>
          <p className="text-sm text-muted-foreground">Request ID: {requestId}</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border p-6">
          <input
            type="text"
            name="hpField"
            value={form.hpField}
            onChange={(e) => setForm({ ...form, hpField: e.target.value })}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />
          <div className="grid md:grid-cols-2 gap-4">
            <input required className="border rounded-md px-3 py-2 bg-transparent" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input required type="email" className="border rounded-md px-3 py-2 bg-transparent" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="border rounded-md px-3 py-2 bg-transparent" placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            <input className="border rounded-md px-3 py-2 bg-transparent" placeholder="Website (optional)" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
            <input required className="border rounded-md px-3 py-2 bg-transparent" placeholder="Project type" value={form.projectType} onChange={(e) => setForm({ ...form, projectType: e.target.value })} />
            <input className="border rounded-md px-3 py-2 bg-transparent" placeholder="Budget range" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
            <input className="border rounded-md px-3 py-2 bg-transparent md:col-span-2" placeholder="Timeline" value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} />
          </div>
          <textarea required className="border rounded-md px-3 py-2 bg-transparent min-h-40 w-full" placeholder="Project context and requirements" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />

          {state === 'error' && <p className="text-sm text-destructive">{error}</p>}

          <button disabled={state === 'submitting'} className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm disabled:opacity-60">
            {state === 'submitting' ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      )}
    </main>
  )
}

