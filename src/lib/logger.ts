type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const REDACT_KEYS = ['password', 'token', 'secret', 'authorization', 'cookie', 'email']

function redactValue(key: string, value: unknown): unknown {
  if (REDACT_KEYS.some((item) => key.toLowerCase().includes(item))) {
    return '[REDACTED]'
  }
  return value
}

function sanitizeContext(context: Record<string, unknown> = {}): Record<string, unknown> {
  return Object.fromEntries(Object.entries(context).map(([key, value]) => [key, redactValue(key, value)]))
}

function write(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    message,
    context: sanitizeContext(context),
  }

  if (level === 'error') {
    console.error(JSON.stringify(payload))
    return
  }
  if (level === 'warn') {
    console.warn(JSON.stringify(payload))
    return
  }
  process.stdout.write(`${JSON.stringify(payload)}\n`)
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => write('debug', message, context),
  info: (message: string, context?: Record<string, unknown>) => write('info', message, context),
  warn: (message: string, context?: Record<string, unknown>) => write('warn', message, context),
  error: (message: string, context?: Record<string, unknown>) => write('error', message, context),
}
