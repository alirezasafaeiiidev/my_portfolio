'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BatchQueueManager, type BatchJob } from '@/lib/queue/batch-queue'
import { appendHistoryEntry, createHistoryEntry } from '@/lib/local-store/toolbox-data'
import { formatLocalizedNumber, formatLocalizedDateTime } from '@/lib/persian-utils'

type FilePayload = {
  fileName: string
  size: number
}

type FileResult = {
  compressedBytes: number
}

function createDemoManager() {
  return new BatchQueueManager<FilePayload, FileResult>(async (payload, signal, onProgress) => {
    for (let progress = 10; progress <= 100; progress += 10) {
      if (signal.aborted) {
        throw new Error('aborted')
      }
      await new Promise((resolve) => setTimeout(resolve, 80))
      onProgress(progress)
    }

    return {
      compressedBytes: Math.max(1024, Math.floor(payload.size * 0.7)),
    }
  })
}

export function BatchQueueDemo() {
  const manager = useMemo(() => createDemoManager(), [])
  const [jobs, setJobs] = useState<BatchJob<FilePayload, FileResult>[]>([])
  const persistedJobIds = useRef(new Set<string>())

  useEffect(() => manager.subscribe((snapshot) => setJobs(snapshot.jobs)), [manager])

  const onFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? [])
    selected.forEach((file) => manager.add({ fileName: file.name, size: file.size }))
  }

  useEffect(() => {
    jobs
      .filter((job) => job.status === 'success')
      .forEach((job) => {
        if (persistedJobIds.current.has(job.id)) return
        persistedJobIds.current.add(job.id)
        appendHistoryEntry(
          createHistoryEntry({
            toolId: 'image-compress',
            toolTitle: 'فشرده‌سازی تصویر (صف batch)',
            startedAt: job.createdAt,
            durationMs: Math.max(0, new Date(job.updatedAt).getTime() - new Date(job.createdAt).getTime()),
            status: 'success',
            inputMeta: {
              fileCount: 1,
              totalBytes: job.payload.size,
              note: `output=${job.result?.compressedBytes ?? 0}`,
            },
          }),
        )
      })
  }, [jobs])

  return (
    <div className="space-y-4 rounded-xl border border-border bg-background p-4">
      <div>
        <h2 className="text-lg font-semibold">Batch Queue (P2-02)</h2>
        <p className="text-sm text-muted-foreground">
          پردازش فایل‌ها به ترتیب انجام می‌شود؛ هر آیتم قابلیت Cancel/Retry دارد.
        </p>
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={onFilesSelected}
        className="block w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
      />

      <ul className="space-y-2">
        {jobs.map((job) => (
          <li key={job.id} className="rounded-lg border border-border p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">{job.payload.fileName}</p>
              <Badge variant={job.status === 'error' ? 'destructive' : 'secondary'}>{job.status}</Badge>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              size: {formatLocalizedNumber(job.payload.size, 'fa-IR')} bytes
              {' • '}
              time: {formatLocalizedDateTime(job.updatedAt, 'fa-IR')}
            </p>

            <div className="mt-2 h-2 w-full overflow-hidden rounded bg-muted">
              <div className="h-full bg-primary transition-all" style={{ width: `${job.progress}%` }} />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => manager.cancel(job.id)}
                disabled={job.status !== 'running' && job.status !== 'pending'}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => manager.retry(job.id)}
                disabled={job.status !== 'error' && job.status !== 'canceled'}
              >
                Retry
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {jobs.length > 0 && (
        <Button type="button" variant="ghost" onClick={() => manager.clearCompleted()}>
          پاکسازی آیتم‌های کامل‌شده
        </Button>
      )}
    </div>
  )
}
