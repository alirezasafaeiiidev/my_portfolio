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
 * Persian days of week names (Saturday first)
 */
const persianDays = [
  'شنبه',
  'یک‌شنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه',
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
 * Simple Gregorian to Jalali conversion (self-contained, no external library)
 * This is a simplified implementation. For production, consider using a more robust library.
 * @param gregorianDate - Date object or date string
 * @returns Jalali date string in "YYYY-MM-DD" format
 */
export function toJalaliDate(gregorianDate: Date | string): string {
  const date = typeof gregorianDate === 'string' ? new Date(gregorianDate) : gregorianDate

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return ''
  }

  const gregorianYear = date.getFullYear()
  const gregorianMonth = date.getMonth() + 1 // 1-12
  const gregorianDay = date.getDate()

  // Simplified algorithm for Gregorian to Jalali conversion
  // This is an approximation. For accurate conversions, use a library like jalaali-js
  const gy = gregorianYear - 1600
  const gm = gregorianMonth - 1
  const gd = gregorianDay - 1

  const gDayNo = 365 * gy + Math.floor((gy + 3) / 4) - Math.floor((gy + 99) / 100) +
                 Math.floor((gy + 399) / 400) + Math.floor((367 * gm + 362) / 12) + gd

  let jalaliDayNo = gDayNo - 79

  const jNp = Math.floor(jalaliDayNo / 12053)
  jalaliDayNo %= 12053

  let jy = 979 + 33 * jNp + 4 * Math.floor(jalaliDayNo / 1461)

  jalaliDayNo %= 1461

  if (jalaliDayNo >= 366) {
    jy += Math.floor((jalaliDayNo - 1) / 365)
    jalaliDayNo = (jalaliDayNo - 1) % 365
  }

  let jalaliMonth = 0
  let jalaliDay = jalaliDayNo + 1

  for (let i = 0; i < 11 && jalaliDay > persianDaysInMonth(i, jy); i++) {
    jalaliMonth++
    jalaliDay -= persianDaysInMonth(i, jy)
  }

  const yearStr = String(jy)
  const monthStr = String(jalaliMonth + 1).padStart(2, '0')
  const dayStr = String(jalaliDay).padStart(2, '0')

  return `${yearStr}-${monthStr}-${dayStr}`
}

/**
 * Get number of days in a Persian month
 */
function persianDaysInMonth(month: number, year: number): number {
  if (month <= 6) return 31
  if (month <= 11) return 30
  // Check for leap year (simplified)
  const leapYears = Math.floor((year % 33) / 4)
  return leapYears === 3 ? 30 : 29
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
