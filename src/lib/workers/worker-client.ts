import type { WorkerLike, WorkerMessage, WorkerProgress, WorkerRequest, WorkerResponse } from './types'

export type WorkerClientOptions = {
  timeoutMs?: number
}

export type WorkerRunOptions<TProgress = unknown> = {
  onProgress?: (progress: WorkerProgress<TProgress>) => void
  signal?: AbortSignal
}

export class WorkerClient<TPayload = unknown, TResult = unknown, TProgress = unknown> {
  private readonly factory: () => WorkerLike
  private readonly timeoutMs?: number

  constructor(factory: () => WorkerLike, options: WorkerClientOptions = {}) {
    this.factory = factory
    this.timeoutMs = options.timeoutMs
  }

  run(payload: TPayload, options: WorkerRunOptions<TProgress> = {}): Promise<TResult> {
    const worker = this.factory()
    const requestId =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`
    const request: WorkerRequest<TPayload> = { requestId, type: 'execute', payload }

    let resolved = false
    let timeoutHandle: NodeJS.Timeout | undefined

    const cleanup = () => {
      if (timeoutHandle) clearTimeout(timeoutHandle)
      worker.removeEventListener('message', onMessage)
      worker.removeEventListener('error', onError)
      worker.terminate()
    }

    const onError = (error: MessageEvent<unknown>) => {
      if (resolved) return
      resolved = true
      cleanup()
      const message = typeof error.data === 'string' ? error.data : 'worker_error'
      returnPromise.reject(new Error(message))
    }

    const onMessage = (event: MessageEvent<unknown>) => {
      const data = event.data as WorkerMessage<TResult, TProgress> | undefined
      if (!data || data.requestId !== requestId) return

      if (data.type === 'progress') {
        options.onProgress?.(data)
        return
      }

      if (resolved) return
      resolved = true
      cleanup()

      if (data.type === 'result') {
        returnPromise.resolve(data.result as TResult)
      } else {
        const message = data.error || 'worker_error'
        returnPromise.reject(new Error(message))
      }
    }

    const returnPromise = (() => {
      let resolveFn!: (value: TResult | PromiseLike<TResult>) => void
      let rejectFn!: (reason?: unknown) => void
      const p = new Promise<TResult>((resolve, reject) => {
        resolveFn = resolve
        rejectFn = reject
      })
      const extended = p as Promise<TResult> & { resolve: typeof resolveFn; reject: typeof rejectFn }
      extended.resolve = resolveFn
      extended.reject = rejectFn
      return extended
    })()

    worker.addEventListener('message', onMessage)
    worker.addEventListener('error', onError)

    if (options.signal) {
      const abortHandler = () => {
        if (resolved) return
        resolved = true
        cleanup()
        returnPromise.reject(new Error('aborted'))
      }
      if (options.signal.aborted) {
        abortHandler()
        return returnPromise
      }
      options.signal.addEventListener('abort', abortHandler, { once: true })
    }

    if (this.timeoutMs) {
      timeoutHandle = setTimeout(() => {
        if (resolved) return
        resolved = true
        cleanup()
        returnPromise.reject(new Error('timeout'))
      }, this.timeoutMs)
    }

    worker.postMessage(request)
    return returnPromise
  }
}
