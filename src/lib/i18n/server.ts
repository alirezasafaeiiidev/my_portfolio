import { cookies } from 'next/headers'

export type RequestLanguage = 'fa' | 'en'

export async function getRequestLanguage(): Promise<RequestLanguage> {
  const value = (await cookies()).get('lang')?.value
  return value === 'en' ? 'en' : 'fa'
}

export function isRtl(lang: RequestLanguage): boolean {
  return lang === 'fa'
}
