/**
 * Persian Utilities
 * Local utilities for Persian language support (numbers, dates, etc.)
 * No external dependencies - fully self-contained
 */

/**
 * Persian digits mapping
 */
const persianDigits: Record<string, string> = {
  '0': '۰',
  '1': '۱',
  '2': '۲',
  '3': '۳',
  '4': '۴',
  '5': '۵',
  '6': '۶',
  '7': '۷',
  '8': '۸',
  '9': '۹',
}

const englishDigits: Record<string, string> = {
  '۰': '0',
  '۱': '1',
  '۲': '2',
  '۳': '3',
  '۴': '4',
  '۵': '5',
  '۶': '6',
  '۷': '7',
  '۸': '8',
  '۹': '9',
}

/**
 * Convert English/Arabic numerals to Persian numerals
 * @param input - String or number to convert
 * @returns String with Persian digits
 */
export function toPersianDigits(input: string | number): string {
  const str = String(input)
  return str.replace(/[0-9]/g, (digit) => persianDigits[digit] || digit)
}

/**
 * Convert Persian numerals to English numerals
 * @param input - String with Persian digits
 * @returns String with English digits
 */
export function toEnglishDigits(input: string): string {
  return input.replace(/[۰-۹]/g, (digit) => englishDigits[digit] || digit)
}

/**
 * Format a number with thousand separators using Persian digits
 * @param num - Number to format
 * @returns Formatted string with Persian digits and comma separators
 */
export function formatPersianNumber(num: number | string): string {
  const englishNum = typeof num === 'string' ? toEnglishDigits(num) : String(num)
  const numericValue = parseFloat(englishNum)

  if (isNaN(numericValue)) {
    return toPersianDigits(englishNum)
  }

  // Add thousand separators
  const parts = numericValue.toFixed(0).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return toPersianDigits(parts.join('.'))
}

/**
 * Persian months names
 */
const persianMonths = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
]

/**
 * Convert Jalali date string to Persian formatted string
 * @param jalaliDate - Jalali date string in format "YYYY-MM-DD"
 * @param format - Format: 'full', 'short', 'day', or custom
 * @returns Formatted Persian date string
 */
export function formatPersianDate(
  jalaliDate: string,
  format: 'full' | 'short' | 'day' = 'full'
): string {
  const parts = jalaliDate.split('-')
  if (parts.length !== 3) {
    return jalaliDate
  }

  const year = toPersianDigits(parts[0])
  const month = parseInt(parts[1], 10) - 1 // Zero-based index
  const day = toPersianDigits(parts[2])

  const monthName = persianMonths[month] || ''

  switch (format) {
    case 'full':
      return `${day} ${monthName} ${year}`
    case 'short':
      return `${day} ${monthName} ${year}`
    case 'day':
      return `${day} ${monthName}`
    default:
      return `${day} ${monthName} ${year}`
  }
}

/**
 * Accurate Gregorian -> Jalali conversion using built-in Intl Persian calendar.
 * Keeps output stable in UTC to avoid timezone-related off-by-one issues.
 */
export function toJalaliDate(gregorianDate: Date | string): string {
  const date = normalizeDateInput(gregorianDate)
  if (!date) return ''

  const formatter = new Intl.DateTimeFormat('en-u-ca-persian', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  })

  const parts = formatter.formatToParts(date)
  const year = parts.find((part) => part.type === 'year')?.value
  const month = parts.find((part) => part.type === 'month')?.value
  const day = parts.find((part) => part.type === 'day')?.value

  if (!year || !month || !day) {
    return ''
  }

  return `${year}-${month}-${day}`
}

function normalizeDateInput(input: Date | string): Date | null {
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input
  }

  const isoMatch = input.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (isoMatch) {
    const year = Number(isoMatch[1])
    const month = Number(isoMatch[2])
    const day = Number(isoMatch[3])
    const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
    return isNaN(date.getTime()) ? null : date
  }

  const parsed = new Date(input)
  return isNaN(parsed.getTime()) ? null : parsed
}

/**
 * Get current Jalali date as formatted Persian string
 * @param format - Format: 'full', 'short', 'day'
 * @returns Formatted Persian date string
 */
export function getCurrentPersianDate(format: 'full' | 'short' | 'day' = 'full'): string {
  const now = new Date()
  const jalaliDate = toJalaliDate(now)
  return formatPersianDate(jalaliDate, format)
}

/**
 * Format a duration in Persian
 * @param seconds - Duration in seconds
 * @returns Formatted duration string in Persian
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${toPersianDigits(hours)} ساعت و ${toPersianDigits(minutes)} دقیقه`
  } else if (minutes > 0) {
    return `${toPersianDigits(minutes)} دقیقه و ${toPersianDigits(secs)} ثانیه`
  } else {
    return `${toPersianDigits(secs)} ثانیه`
  }
}

/**
 * Format file size in Persian
 * @param bytes - Size in bytes
 * @returns Formatted size string in Persian
 */
export function formatFileSize(bytes: number): string {
  const units = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت', 'ترابایت']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${toPersianDigits(size.toFixed(2))} ${units[unitIndex]}`
}

export function formatLocalizedNumber(value: number | string, locale: 'fa-IR' | 'en-US' = 'fa-IR'): string {
  const normalized = typeof value === 'string' ? Number(toEnglishDigits(value.replace(/,/g, ''))) : value
  if (!Number.isFinite(normalized)) {
    return String(value)
  }

  return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(normalized)
}

export function formatLocalizedDateTime(
  value: Date | string,
  locale: 'fa-IR' | 'en-US' = 'fa-IR',
): string {
  const date = value instanceof Date ? value : new Date(value)
  if (isNaN(date.getTime())) {
    return String(value)
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
