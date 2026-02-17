'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { appendHistoryEntry, createHistoryEntry } from '@/lib/local-store/toolbox-data'

type ToolRunRecorderProps = {
  toolId: string
  toolTitle: string
}

export function ToolRunRecorder({ toolId, toolTitle }: ToolRunRecorderProps) {
  const [running, setRunning] = useState(false)

  const simulateRun = async (status: 'success' | 'error') => {
    setRunning(true)
    const startedAt = new Date().toISOString()
    await new Promise((resolve) => setTimeout(resolve, 450))

    appendHistoryEntry(
      createHistoryEntry({
        toolId,
        toolTitle,
        startedAt,
        durationMs: 450,
        status,
        errorMessage: status === 'error' ? 'simulated_failure' : undefined,
      }),
    )

    setRunning(false)
  }

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="text-sm font-medium">ثبت اجرای آزمایشی برای History</p>
      <div className="mt-3 flex gap-2">
        <Button type="button" size="sm" disabled={running} onClick={() => simulateRun('success')}>
          ثبت اجرای موفق
        </Button>
        <Button type="button" size="sm" variant="outline" disabled={running} onClick={() => simulateRun('error')}>
          ثبت اجرای خطا
        </Button>
      </div>
    </div>
  )
}
