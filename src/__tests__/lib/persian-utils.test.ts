/**
 * Tests for Persian Utilities
 * Testing critical utilities for Persian language support
 */

import { describe, it, expect } from 'vitest'
import {
  toPersianDigits,
  toEnglishDigits,
  formatPersianNumber,
  formatPersianDate,
  toJalaliDate,
  formatDuration,
  formatFileSize,
} from '@/lib/persian-utils'

describe('toPersianDigits', () => {
  it('should convert English digits to Persian digits', () => {
    expect(toPersianDigits('0')).toBe('۰')
    expect(toPersianDigits('1')).toBe('۱')
    expect(toPersianDigits('9')).toBe('۹')
    expect(toPersianDigits('123')).toBe('۱۲۳')
    expect(toPersianDigits('2024')).toBe('۲۰۲۴')
  })

  it('should handle numbers', () => {
    expect(toPersianDigits(123)).toBe('۱۲۳')
    expect(toPersianDigits(0)).toBe('۰')
    expect(toPersianDigits(2024)).toBe('۲۰۲۴')
  })

  it('should preserve non-digit characters', () => {
    expect(toPersianDigits('Phone: 123-456')).toBe('Phone: ۱۲۳-۴۵۶')
    expect(toPersianDigits('Date: 2024/01/15')).toBe('Date: ۲۰۲۴/۰۱/۱۵')
  })

  it('should handle empty strings', () => {
    expect(toPersianDigits('')).toBe('')
  })

  it('should handle strings without digits', () => {
    expect(toPersianDigits('Hello World')).toBe('Hello World')
  })
})

describe('toEnglishDigits', () => {
  it('should convert Persian digits to English digits', () => {
    expect(toEnglishDigits('۰')).toBe('0')
    expect(toEnglishDigits('۱')).toBe('1')
    expect(toEnglishDigits('۹')).toBe('9')
    expect(toEnglishDigits('۱۲۳')).toBe('123')
    expect(toEnglishDigits('۲۰۲۴')).toBe('2024')
  })

  it('should preserve non-digit characters', () => {
    expect(toEnglishDigits('شماره: ۱۲۳-۴۵۶')).toBe('شماره: 123-456')
    expect(toEnglishDigits('تاریخ: ۱۴۰۲/۱۰/۲۴')).toBe('تاریخ: 1402/10/24')
  })

  it('should handle empty strings', () => {
    expect(toEnglishDigits('')).toBe('')
  })

  it('should handle strings without Persian digits', () => {
    expect(toEnglishDigits('Hello World')).toBe('Hello World')
  })
})

describe('formatPersianNumber', () => {
  it('should format small numbers', () => {
    expect(formatPersianNumber(123)).toBe('۱۲۳')
    expect(formatPersianNumber('456')).toBe('۴۵۶')
  })

  it('should format numbers with thousand separators', () => {
    expect(formatPersianNumber(1000)).toBe('۱,۰۰۰')
    expect(formatPersianNumber(10000)).toBe('۱۰,۰۰۰')
    expect(formatPersianNumber(100000)).toBe('۱۰۰,۰۰۰')
    expect(formatPersianNumber(1000000)).toBe('۱,۰۰۰,۰۰۰')
  })

  it('should format large numbers', () => {
    expect(formatPersianNumber(1234567890)).toBe('۱,۲۳۴,۵۶۷,۸۹۰')
  })

  it('should handle decimal numbers', () => {
    expect(formatPersianNumber(1234.56)).toBe('۱,۲۳۵') // Rounded
    expect(formatPersianNumber('1234.56')).toBe('۱,۲۳۵') // Rounded
  })

  it('should handle strings with digits', () => {
    expect(formatPersianNumber('1234567')).toBe('۱,۲۳۴,۵۶۷')
  })

  it('should handle invalid numbers', () => {
    expect(formatPersianNumber(NaN)).toBe('NaN')
    expect(formatPersianNumber('invalid')).toBe('invalid')
  })
})

describe('formatPersianDate', () => {
  it('should format Jalali date in full format', () => {
    expect(formatPersianDate('1403-01-15', 'full')).toBe('۱۵ فروردین ۱۴۰۳')
    expect(formatPersianDate('1403-06-31', 'full')).toBe('۳۱ شهریور ۱۴۰۳')
    expect(formatPersianDate('1403-12-29', 'full')).toBe('۲۹ اسفند ۱۴۰۳')
  })

  it('should format Jalali date in short format', () => {
    expect(formatPersianDate('1403-01-15', 'short')).toBe('۱۵ فروردین ۱۴۰۳')
  })

  it('should format Jalali date in day format', () => {
    expect(formatPersianDate('1403-01-15', 'day')).toBe('۱۵ فروردین')
  })

  it('should handle invalid date formats', () => {
    expect(formatPersianDate('invalid', 'full')).toBe('invalid')
    expect(formatPersianDate('1403', 'full')).toBe('1403')
  })

  it('should handle out-of-range months', () => {
    // Month 13 is out of range (0-11 in array), will be undefined
    expect(formatPersianDate('1403-13-15', 'full')).toBe('۱۵  ۱۴۰۳')
  })
})

describe('toJalaliDate', () => {
  it('should convert known Gregorian dates to Jalali', () => {
    const date = new Date('2024-03-20')
    const jalali = toJalaliDate(date)
    // March 20, 2024 is approximately Nowruz (Persian New Year)
    expect(jalali).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('should convert Date object', () => {
    const date = new Date('2024-01-01')
    const jalali = toJalaliDate(date)
    expect(jalali).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('should convert date string', () => {
    const jalali = toJalaliDate('2024-06-15')
    expect(jalali).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('should handle invalid dates', () => {
    expect(toJalaliDate('invalid')).toBe('')
    expect(toJalaliDate(new Date('invalid'))).toBe('')
  })

  it('should return valid year range', () => {
    const date = new Date()
    const jalali = toJalaliDate(date)
    const year = parseInt(jalali.split('-')[0])
    expect(year).toBeGreaterThan(1300)
    expect(year).toBeLessThan(1500)
  })
})

describe('formatDuration', () => {
  it('should format seconds', () => {
    expect(formatDuration(30)).toBe('۳۰ ثانیه')
    expect(formatDuration(59)).toBe('۵۹ ثانیه')
  })

  it('should format minutes and seconds', () => {
    expect(formatDuration(90)).toBe('۱ دقیقه و ۳۰ ثانیه')
    expect(formatDuration(150)).toBe('۲ دقیقه و ۳۰ ثانیه')
  })

  it('should format hours and minutes', () => {
    expect(formatDuration(3600)).toBe('۱ ساعت و ۰ دقیقه')
    expect(formatDuration(3660)).toBe('۱ ساعت و ۱ دقیقه')
    expect(formatDuration(7260)).toBe('۲ ساعت و ۱ دقیقه')
  })

  it('should format large durations', () => {
    expect(formatDuration(86400)).toBe('۲۴ ساعت و ۰ دقیقه')
  })

  it('should format zero seconds', () => {
    expect(formatDuration(0)).toBe('۰ ثانیه')
  })
})

describe('formatFileSize', () => {
  it('should format bytes', () => {
    expect(formatFileSize(100)).toBe('۱۰۰.۰۰ بایت')
    expect(formatFileSize(512)).toBe('۵۱۲.۰۰ بایت')
  })

  it('should format kilobytes', () => {
    expect(formatFileSize(1024)).toBe('۱.۰۰ کیلوبایت')
    expect(formatFileSize(1536)).toBe('۱.۵۰ کیلوبایت')
    expect(formatFileSize(5120)).toBe('۵.۰۰ کیلوبایت')
  })

  it('should format megabytes', () => {
    expect(formatFileSize(1048576)).toBe('۱.۰۰ مگابایت')
    expect(formatFileSize(5242880)).toBe('۵.۰۰ مگابایت')
  })

  it('should format gigabytes', () => {
    expect(formatFileSize(1073741824)).toBe('۱.۰۰ گیگابایت')
    expect(formatFileSize(5368709120)).toBe('۵.۰۰ گیگابایت')
  })

  it('should format terabytes', () => {
    expect(formatFileSize(1099511627776)).toBe('۱.۰۰ ترابایت')
  })

  it('should format zero bytes', () => {
    expect(formatFileSize(0)).toBe('۰.۰۰ بایت')
  })
})

describe('round-trip conversions', () => {
  it('should maintain data integrity through digit conversions', () => {
    const original = '1234567890'
    const persian = toPersianDigits(original)
    const back = toEnglishDigits(persian)
    expect(back).toBe(original)
  })

  it('should handle mixed digit conversions', () => {
    const original = '2024-12-31'
    const persian = toPersianDigits(original)
    const back = toEnglishDigits(persian)
    expect(back).toBe(original)
  })
})
