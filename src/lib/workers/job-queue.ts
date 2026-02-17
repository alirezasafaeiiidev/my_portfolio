type Job<T> = () => Promise<T>

export class WorkerJobQueue {
  private running = false
  private queue: Job<unknown>[] = []

  enqueue<T>(job: Job<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await job()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      this.next()
    })
  }

  private async next() {
    if (this.running) return
    const job = this.queue.shift()
    if (!job) return
    this.running = true
    try {
      await job()
    } finally {
      this.running = false
      if (this.queue.length > 0) {
        this.next()
      }
    }
  }

  clear() {
    this.queue = []
  }
}
