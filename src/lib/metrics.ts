interface ApiMetricsState {
  totalResponses: number
  successResponses: number
  errorResponses: number
  byStatus: Map<number, number>
}

const metricsState: ApiMetricsState = {
  totalResponses: 0,
  successResponses: 0,
  errorResponses: 0,
  byStatus: new Map<number, number>(),
}

export function recordApiResponse(statusCode: number) {
  metricsState.totalResponses += 1
  metricsState.byStatus.set(statusCode, (metricsState.byStatus.get(statusCode) ?? 0) + 1)
  if (statusCode >= 500) {
    metricsState.errorResponses += 1
  } else if (statusCode < 400) {
    metricsState.successResponses += 1
  }
}

export function getApiMetricsSnapshot() {
  return {
    totalResponses: metricsState.totalResponses,
    successResponses: metricsState.successResponses,
    errorResponses: metricsState.errorResponses,
    byStatus: Array.from(metricsState.byStatus.entries()).sort(([left], [right]) => left - right),
    processUptimeSeconds: Math.floor(process.uptime()),
  }
}

export function renderPrometheusMetrics(): string {
  const snapshot = getApiMetricsSnapshot()
  const lines: string[] = []

  lines.push('# HELP portfolio_api_requests_total Total API responses observed.')
  lines.push('# TYPE portfolio_api_requests_total counter')
  lines.push(`portfolio_api_requests_total ${snapshot.totalResponses}`)

  lines.push('# HELP portfolio_api_success_total Successful API responses (<400).')
  lines.push('# TYPE portfolio_api_success_total counter')
  lines.push(`portfolio_api_success_total ${snapshot.successResponses}`)

  lines.push('# HELP portfolio_api_errors_total Server API errors (>=500).')
  lines.push('# TYPE portfolio_api_errors_total counter')
  lines.push(`portfolio_api_errors_total ${snapshot.errorResponses}`)

  lines.push('# HELP portfolio_api_responses_by_status_total API responses by status code.')
  lines.push('# TYPE portfolio_api_responses_by_status_total counter')
  for (const [status, count] of snapshot.byStatus) {
    lines.push(`portfolio_api_responses_by_status_total{status="${status}"} ${count}`)
  }

  lines.push('# HELP portfolio_process_uptime_seconds Process uptime in seconds.')
  lines.push('# TYPE portfolio_process_uptime_seconds gauge')
  lines.push(`portfolio_process_uptime_seconds ${snapshot.processUptimeSeconds}`)

  return `${lines.join('\n')}\n`
}
