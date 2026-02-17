export type FileDescriptor = {
  name: string
  size: number
  pages?: number
  width?: number
  height?: number
}

const MB = 1024 * 1024

export const workerLimits = {
  pdf: {
    maxFiles: 10,
    maxTotalBytes: 50 * MB,
    maxPages: 400,
  },
  image: {
    maxFiles: 8,
    maxTotalBytes: 30 * MB,
    maxDimension: 8000,
  },
} as const

type LimitKind = keyof typeof workerLimits

export function assertWithinLimits(kind: LimitKind, files: FileDescriptor[]) {
  const limit = workerLimits[kind]
  if (!limit) return

  if (files.length === 0) {
    throw new Error('هیچ فایلی انتخاب نشده است.')
  }
  if (files.length > limit.maxFiles) {
    throw new Error(`حداکثر ${limit.maxFiles} فایل برای این ابزار مجاز است.`)
  }
  const total = files.reduce((sum, f) => sum + (f.size || 0), 0)
  if (total > limit.maxTotalBytes) {
    throw new Error('حجم کل فایل‌ها بیش از حد مجاز است.')
  }
  if (kind === 'pdf') {
    const pdfLimit = workerLimits.pdf
    const hasTooManyPages = files.some((f) => (f.pages || 0) > pdfLimit.maxPages)
    if (hasTooManyPages) {
      throw new Error('تعداد صفحات یکی از فایل‌ها بیش از حد مجاز است.')
    }
  }
  if (kind === 'image') {
    const imageLimit = workerLimits.image
    const tooLarge = files.some(
      (f) => (f.width || 0) > imageLimit.maxDimension || (f.height || 0) > imageLimit.maxDimension,
    )
    if (tooLarge) {
      throw new Error('ابعاد یکی از تصاویر از حد مجاز بزرگ‌تر است.')
    }
  }
}
