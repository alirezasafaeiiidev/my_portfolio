export type WorkerLike = {
  postMessage: (message: unknown, transfer?: Transferable[]) => void
  terminate: () => void
  addEventListener: (type: 'message' | 'error', listener: (event: MessageEvent<unknown>) => void) => void
  removeEventListener: (type: 'message' | 'error', listener: (event: MessageEvent<unknown>) => void) => void
}

export type WorkerRequest<TPayload> = {
  requestId: string
  type: 'execute'
  payload: TPayload
}

export type WorkerProgress<TProgress = unknown> = {
  requestId: string
  type: 'progress'
  progress?: number
  detail?: TProgress
}

export type WorkerResponse<TResult = unknown> =
  | {
      requestId: string
      type: 'result'
      result: TResult
    }
  | {
      requestId: string
      type: 'error'
      error: string
    }

export type WorkerMessage<TResult = unknown, TProgress = unknown> =
  | WorkerProgress<TProgress>
  | WorkerResponse<TResult>
