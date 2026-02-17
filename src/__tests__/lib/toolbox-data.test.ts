import { beforeEach, describe, expect, it } from 'vitest'
import {
  appendHistoryEntry,
  clearHistory,
  createHistoryEntry,
  getToolboxData,
  importToolboxPayload,
  makeExportPayload,
  updateToolboxSettings,
} from '@/lib/local-store/toolbox-data'

describe('toolbox-data local store', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('stores settings and history entries', () => {
    updateToolboxSettings({ defaultImageQuality: 75, numeralLocale: 'en-US' })
    appendHistoryEntry(
      createHistoryEntry({
        toolId: 'pdf-merge',
        toolTitle: 'PDF Merge',
        startedAt: new Date().toISOString(),
        durationMs: 120,
        status: 'success',
      }),
    )

    const data = getToolboxData()
    expect(data.settings.defaultImageQuality).toBe(75)
    expect(data.settings.numeralLocale).toBe('en-US')
    expect(data.history.length).toBe(1)
  })

  it('exports and imports settings-only correctly', () => {
    updateToolboxSettings({ numeralLocale: 'en-US' })
    const payload = makeExportPayload()

    updateToolboxSettings({ numeralLocale: 'fa-IR' })
    importToolboxPayload(payload, 'settings-only')

    const data = getToolboxData()
    expect(data.settings.numeralLocale).toBe('en-US')
  })

  it('clears history without deleting settings', () => {
    appendHistoryEntry(
      createHistoryEntry({
        toolId: 'image-resize',
        toolTitle: 'Resize',
        startedAt: new Date().toISOString(),
        durationMs: 50,
        status: 'error',
      }),
    )

    clearHistory()
    const data = getToolboxData()
    expect(data.history).toHaveLength(0)
    expect(data.settings.saveHistory).toBe(true)
  })
})
