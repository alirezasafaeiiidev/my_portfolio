import { describe, expect, it, vi } from 'vitest'

describe('logger', () => {
  it('writes info/debug to stdout and redacts sensitive context keys', async () => {
    const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    const { logger } = await import('@/lib/logger')
    logger.info('hello', {
      email: 'user@example.com',
      token: 'secret-token',
      authorization: 'Bearer xyz',
      cookie: 'a=b',
      safeKey: 'ok',
    })

    expect(errorSpy).not.toHaveBeenCalled()
    expect(warnSpy).not.toHaveBeenCalled()
    expect(stdoutSpy).toHaveBeenCalledTimes(1)

    const line = String(stdoutSpy.mock.calls[0]?.[0] ?? '')
    const payload = JSON.parse(line.trim())
    expect(payload.level).toBe('info')
    expect(payload.message).toBe('hello')
    expect(payload.context.email).toBe('[REDACTED]')
    expect(payload.context.token).toBe('[REDACTED]')
    expect(payload.context.authorization).toBe('[REDACTED]')
    expect(payload.context.cookie).toBe('[REDACTED]')
    expect(payload.context.safeKey).toBe('ok')
  })

  it('routes warn/error levels to console warn/error', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    const { logger } = await import('@/lib/logger')
    logger.warn('warn msg', { reason: 'x' })
    logger.error('err msg', { secret: 'y' })

    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(errorSpy).toHaveBeenCalledTimes(1)

    const warnPayload = JSON.parse(String(warnSpy.mock.calls[0]?.[0] ?? ''))
    expect(warnPayload.level).toBe('warn')
    expect(warnPayload.context.reason).toBe('x')

    const errPayload = JSON.parse(String(errorSpy.mock.calls[0]?.[0] ?? ''))
    expect(errPayload.level).toBe('error')
    expect(errPayload.context.secret).toBe('[REDACTED]')
  })
})
