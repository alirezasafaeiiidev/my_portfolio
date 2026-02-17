export type BatchJobStatus = 'pending' | 'running' | 'success' | 'error' | 'canceled'

export type BatchJob<TPayload = unknown, TResult = unknown> = {
  id: string
  payload: TPayload
  status: BatchJobStatus
  progress: number
  result?: TResult
  error?: string
  createdAt: string
  updatedAt: string
}

export type BatchQueueSnapshot<TPayload = unknown, TResult = unknown> = {
  jobs: BatchJob<TPayload, TResult>[]
  running: boolean
}

export type BatchProcessor<TPayload, TResult> = (
  payload: TPayload,
  signal: AbortSignal,
  onProgress: (progress: number) => void,
) => Promise<TResult>

export class BatchQueueManager<TPayload, TResult> {
  private jobs: BatchJob<TPayload, TResult>[] = []
  private running = false
  private listeners = new Set<(snapshot: BatchQueueSnapshot<TPayload, TResult>) => void>()
  private currentAbort: AbortController | null = null
  private readonly processor: BatchProcessor<TPayload, TResult>

  constructor(processor: BatchProcessor<TPayload, TResult>) {
    this.processor = processor
  }

  subscribe(listener: (snapshot: BatchQueueSnapshot<TPayload, TResult>) => void) {
    this.listeners.add(listener)
    listener(this.snapshot())
    return () => {
      this.listeners.delete(listener)
    }
  }

  add(payload: TPayload): string {
    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`
    const now = new Date().toISOString()
    this.jobs.push({
      id,
      payload,
      status: 'pending',
      progress: 0,
      createdAt: now,
      updatedAt: now,
    })
    this.emit()
    this.runNext()
    return id
  }

  cancel(jobId: string) {
    const job = this.jobs.find((item) => item.id === jobId)
    if (!job) return

    if (job.status === 'running' && this.currentAbort) {
      this.currentAbort.abort()
    }

    if (job.status === 'pending') {
      job.status = 'canceled'
      job.updatedAt = new Date().toISOString()
      this.emit()
    }
  }

  retry(jobId: string) {
    const job = this.jobs.find((item) => item.id === jobId)
    if (!job) return
    if (job.status !== 'error' && job.status !== 'canceled') return

    job.status = 'pending'
    job.progress = 0
    job.error = undefined
    job.updatedAt = new Date().toISOString()
    this.emit()
    this.runNext()
  }

  clearCompleted() {
    this.jobs = this.jobs.filter((job) => job.status === 'pending' || job.status === 'running')
    this.emit()
  }

  snapshot(): BatchQueueSnapshot<TPayload, TResult> {
    return {
      jobs: [...this.jobs],
      running: this.running,
    }
  }

  private emit() {
    const snapshot = this.snapshot()
    this.listeners.forEach((listener) => listener(snapshot))
  }

  private async runNext() {
    if (this.running) return
    const next = this.jobs.find((job) => job.status === 'pending')
    if (!next) return

    this.running = true
    this.currentAbort = new AbortController()
    next.status = 'running'
    next.updatedAt = new Date().toISOString()
    this.emit()

    try {
      const result = await this.processor(next.payload, this.currentAbort.signal, (progress) => {
        next.progress = Math.max(0, Math.min(100, Math.round(progress)))
        next.updatedAt = new Date().toISOString()
        this.emit()
      })
      next.status = 'success'
      next.progress = 100
      next.result = result
      next.updatedAt = new Date().toISOString()
    } catch (error) {
      if (this.currentAbort.signal.aborted) {
        next.status = 'canceled'
      } else {
        next.status = 'error'
        next.error = error instanceof Error ? error.message : 'queue_error'
      }
      next.updatedAt = new Date().toISOString()
    } finally {
      this.running = false
      this.currentAbort = null
      this.emit()
      this.runNext()
    }
  }
}
