'use client'

import React, { useState, useEffect, ReactNode } from 'react'
import { Language, translations } from './i18n/translations'

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = React.createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  // Keep the first client render identical to SSR output to avoid hydration mismatch.
  const [language, setLanguage] = useState<Language>('fa')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('language') as Language | null
      if ((saved === 'en' || saved === 'fa') && saved !== language) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client sync from persisted preference
        setLanguage(saved)
      }
    } catch {
      // Ignore storage access failures and keep default language.
    }
  }, [language])

  // Set initial language and direction
  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr'
  }, [language])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
    }
  }

  const t = (key: string): string => {
    if (!key || typeof key !== 'string') {
      return key
    }

    if (!translations[language]) {
      return key
    }

    const keys = key.split('.')
    let value: unknown = translations[language]

    // Navigate through nested keys
    for (const k of keys) {
      if (typeof value === 'object' && value !== null && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        // If any key in the path doesn't exist, stop and return key
        // This ensures we don't return partial translations
        return key
      }
    }

    return typeof value === 'string' ? value : key
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = React.useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

export { translations }
