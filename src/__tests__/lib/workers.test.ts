import { describe, expect, it, vi } from 'vitest'
import { assertWithinLimits, workerLimits } from '@/lib/workers/limits'
import { safeDownloadBlob } from '@/lib/workers/download'
import { WorkerClient } from '@/lib/workers/worker-client'
import type { WorkerLike } from '@/lib/workers/types'

class MockWorker implements WorkerLike {
  private listeners: Record<string, ((event: MessageEvent<unknown>) => void)[]> = { message: [], error: [] }
  terminated = false

  addEventListener(type: 'message' | 'error', listener: (event: MessageEvent<unknown>) => void) {
    this.listeners[type].push(listener)
  }

  removeEventListener(type: 'message' | 'error', listener: (event: MessageEvent<unknown>) => void) {
    this.listeners[type] = this.listeners[type].filter((l) => l !== listener)
  }

  postMessage(message: unknown) {
    const { requestId } = message as { requestId: string }
    const progressEvent = { data: { requestId, type: 'progress', progress: 0.5 } } as MessageEvent
    const resultEvent = { data: { requestId, type: 'result', result: 'done' } } as MessageEvent
    queueMicrotask(() => this.listeners.message.forEach((l) => l(progressEvent)))
    queueMicrotask(() => this.listeners.message.forEach((l) => l(resultEvent)))
  }

  terminate() {
    this.terminated = true
  }
}

describe('worker runtime', () => {
  it('runs worker job with progress and resolves result', async () => {
    const worker = new MockWorker()
    const onProgress = vi.fn()
    const client = new WorkerClient(() => worker, { timeoutMs: 1000 })

    const result = await client.run({ files: [] }, { onProgress })

    expect(result).toBe('done')
    expect(onProgress).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'progress', progress: 0.5, requestId: expect.any(String) }),
    )
    expect(worker.terminated).toBe(true)
  })

  it('aborts when signal is cancelled', async () => {
    const worker = new MockWorker()
    const client = new WorkerClient(() => worker, { timeoutMs: 1000 })
    const controller = new AbortController()
    const promise = client.run({ files: [] }, { signal: controller.signal })
    controller.abort()
    await expect(promise).rejects.toThrow('aborted')
    expect(worker.terminated).toBe(true)
  })
})

describe('worker limits', () => {
  it('throws when exceeding file count', () => {
    const files = Array.from({ length: workerLimits.pdf.maxFiles + 1 }).map((_, idx) => ({
      name: `${idx}.pdf`,
      size: 1024,
    }))
    expect(() => assertWithinLimits('pdf', files)).toThrow()
  })
})

describe('safeDownloadBlob', () => {
  it('revokes object URL after download', () => {
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL')
    const createSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob://test')
    const appendSpy = vi.spyOn(document.body, 'appendChild')
    const removeSpy = vi.spyOn(document.body, 'removeChild')
    const anchor = document.createElement('a')
    const clickSpy = vi.spyOn(anchor, 'click')
    const createElSpy = vi.spyOn(document, 'createElement').mockReturnValue(anchor)

    safeDownloadBlob(new Blob(['hello']), 'test.pdf')

    expect(createSpy).toHaveBeenCalled()
    expect(createElSpy).toHaveBeenCalledWith('a')
    expect(clickSpy).toHaveBeenCalled()
    expect(appendSpy).toHaveBeenCalledWith(anchor)
    expect(removeSpy).toHaveBeenCalledWith(anchor)
    expect(revokeSpy).toHaveBeenCalledWith('blob://test')
  })
})
