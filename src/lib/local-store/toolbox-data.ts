export type ToolRunStatus = 'success' | 'error' | 'canceled'

export type ToolHistoryEntry = {
  id: string
  toolId: string
  toolTitle: string
  startedAt: string
  finishedAt: string
  durationMs: number
  status: ToolRunStatus
  inputMeta?: {
    fileCount?: number
    totalBytes?: number
    note?: string
  }
  errorMessage?: string
}

export type ToolboxSettings = {
  saveHistory: boolean
  defaultImageQuality: number
  numeralLocale: 'fa-IR' | 'en-US'
}

export type ToolboxData = {
  version: 1
  updatedAt: string
  settings: ToolboxSettings
  history: ToolHistoryEntry[]
}

export type ImportMode = 'all' | 'settings-only' | 'history-only'

const STORAGE_KEY = 'toolbox:data:v1'
const MAX_HISTORY_ITEMS = 500

const defaultData: ToolboxData = {
  version: 1,
  updatedAt: new Date(0).toISOString(),
  settings: {
    saveHistory: true,
    defaultImageQuality: 82,
    numeralLocale: 'fa-IR',
  },
  history: [],
}

function isBrowser() {
  return typeof window !== 'undefined'
}

function nowIso() {
  return new Date().toISOString()
}

function safeParse(json: string | null): unknown {
  if (!json) return null
  try {
    return JSON.parse(json)
  } catch {
    return null
  }
}

function toSafeData(candidate: unknown): ToolboxData {
  if (!candidate || typeof candidate !== 'object') {
    return { ...defaultData, updatedAt: nowIso() }
  }

  const source = candidate as Partial<ToolboxData>
  const settings = source.settings ?? defaultData.settings

  return {
    version: 1,
    updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : nowIso(),
    settings: {
      saveHistory: settings.saveHistory !== false,
      defaultImageQuality:
        typeof settings.defaultImageQuality === 'number' && settings.defaultImageQuality >= 1 && settings.defaultImageQuality <= 100
          ? Math.round(settings.defaultImageQuality)
          : defaultData.settings.defaultImageQuality,
      numeralLocale: settings.numeralLocale === 'en-US' ? 'en-US' : 'fa-IR',
    },
    history: Array.isArray(source.history)
      ? source.history
          .filter((item): item is ToolHistoryEntry => !!item && typeof item === 'object' && typeof (item as ToolHistoryEntry).id === 'string')
          .slice(0, MAX_HISTORY_ITEMS)
      : [],
  }
}

export function getToolboxData(): ToolboxData {
  if (!isBrowser()) return { ...defaultData, updatedAt: nowIso() }
  const raw = safeParse(window.localStorage.getItem(STORAGE_KEY))
  return toSafeData(raw)
}

export function saveToolboxData(data: ToolboxData): ToolboxData {
  const safe = toSafeData(data)
  safe.updatedAt = nowIso()
  if (isBrowser()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(safe))
  }
  return safe
}

export function updateToolboxSettings(patch: Partial<ToolboxSettings>): ToolboxData {
  const current = getToolboxData()
  return saveToolboxData({
    ...current,
    settings: {
      ...current.settings,
      ...patch,
    },
  })
}

export function appendHistoryEntry(entry: ToolHistoryEntry): ToolboxData {
  const current = getToolboxData()
  if (!current.settings.saveHistory) return current

  return saveToolboxData({
    ...current,
    history: [entry, ...current.history].slice(0, MAX_HISTORY_ITEMS),
  })
}

export function clearHistory(): ToolboxData {
  const current = getToolboxData()
  return saveToolboxData({
    ...current,
    history: [],
  })
}

export function clearAllToolboxData(): ToolboxData {
  const reset = { ...defaultData, updatedAt: nowIso() }
  if (isBrowser()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reset))
  }
  return reset
}

export function makeExportPayload(): string {
  return JSON.stringify(getToolboxData(), null, 2)
}

export function importToolboxPayload(payload: string, mode: ImportMode): ToolboxData {
  const parsed = safeParse(payload)
  const imported = toSafeData(parsed)
  const current = getToolboxData()

  if (mode === 'settings-only') {
    return saveToolboxData({ ...current, settings: imported.settings })
  }

  if (mode === 'history-only') {
    const mergedHistory = [...imported.history, ...current.history]
      .reduce<ToolHistoryEntry[]>((acc, item) => {
        if (acc.some((entry) => entry.id === item.id)) return acc
        acc.push(item)
        return acc
      }, [])
      .slice(0, MAX_HISTORY_ITEMS)

    return saveToolboxData({ ...current, history: mergedHistory })
  }

  const mergedAll = {
    ...current,
    settings: imported.settings,
    history: [...imported.history, ...current.history]
      .reduce<ToolHistoryEntry[]>((acc, item) => {
        if (acc.some((entry) => entry.id === item.id)) return acc
        acc.push(item)
        return acc
      }, [])
      .slice(0, MAX_HISTORY_ITEMS),
  }

  return saveToolboxData(mergedAll)
}

export function createHistoryEntry(input: Omit<ToolHistoryEntry, 'id' | 'finishedAt'> & { finishedAt?: string }): ToolHistoryEntry {
  const finishedAt = input.finishedAt ?? nowIso()
  return {
    ...input,
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    finishedAt,
  }
}
