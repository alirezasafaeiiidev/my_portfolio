import { describe, expect, it } from 'vitest'
import { BatchQueueManager } from '@/lib/queue/batch-queue'

describe('BatchQueueManager', () => {
  it('processes jobs sequentially', async () => {
    const order: string[] = []
    const queue = new BatchQueueManager<string, string>(async (payload, _signal, onProgress) => {
      onProgress(50)
      await new Promise((resolve) => setTimeout(resolve, 10))
      order.push(payload)
      return payload.toUpperCase()
    })

    queue.add('a')
    queue.add('b')

    await new Promise((resolve) => setTimeout(resolve, 80))
    const snapshot = queue.snapshot()

    expect(order).toEqual(['a', 'b'])
    expect(snapshot.jobs.every((job) => job.status === 'success')).toBe(true)
  })

  it('supports canceling pending jobs', async () => {
    const queue = new BatchQueueManager<string, string>(async (payload) => {
      await new Promise((resolve) => setTimeout(resolve, 30))
      return payload
    })

    queue.add('first')
    const second = queue.add('second')
    queue.cancel(second)

    await new Promise((resolve) => setTimeout(resolve, 90))
    const snapshot = queue.snapshot()
    const secondJob = snapshot.jobs.find((job) => job.id === second)

    expect(secondJob?.status).toBe('canceled')
  })

  it('retries failed jobs', async () => {
    let shouldFail = true
    const queue = new BatchQueueManager<string, string>(async (payload) => {
      await new Promise((resolve) => setTimeout(resolve, 10))
      if (shouldFail) {
        shouldFail = false
        throw new Error('boom')
      }
      return payload
    })

    const id = queue.add('retry')
    await new Promise((resolve) => setTimeout(resolve, 40))

    queue.retry(id)
    await new Promise((resolve) => setTimeout(resolve, 70))

    const job = queue.snapshot().jobs.find((item) => item.id === id)
    expect(job?.status).toBe('success')
  })
})
