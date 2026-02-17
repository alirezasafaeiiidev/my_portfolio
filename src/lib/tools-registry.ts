export type ToolCategory = {
  id: 'pdf' | 'image' | 'text'
  path: string
  titleFa: string
  descriptionFa: string
}

export type Tool = {
  id: string
  slug: string
  category: ToolCategory['id']
  titleFa: string
  descriptionFa: string
  keywords: string[]
  indexable: boolean
  lastModified: string
  faqs?: { question: string; answer: string }[]
}

export const toolCategories: ToolCategory[] = [
  {
    id: 'pdf',
    path: '/pdf-tools',
    titleFa: 'ابزارهای PDF',
    descriptionFa: 'ادغام و آماده‌سازی فایل‌های PDF برای ارسال و آرشیو.',
  },
  {
    id: 'image',
    path: '/image-tools',
    titleFa: 'ابزارهای تصویر',
    descriptionFa: 'فشرده‌سازی و تغییر اندازه تصاویر برای وب و پیام‌رسان‌ها.',
  },
  {
    id: 'text',
    path: '/text-tools',
    titleFa: 'ابزارهای متن',
    descriptionFa: 'فرمت و پاکسازی متون فارسی/انگلیسی.',
  },
]

export const tools: Tool[] = [
  {
    id: 'pdf-merge',
    slug: '/tools/pdf-merge',
    category: 'pdf',
    titleFa: 'ادغام PDF',
    descriptionFa: 'چند فایل PDF را به یک خروجی تمیز و کم‌حجم تبدیل کن.',
    keywords: ['pdf', 'merge', 'ادغام', 'پرینت'],
    indexable: true,
    lastModified: '2026-02-17',
    faqs: [
      {
        question: 'آیا فایل‌ها به سرور آپلود می‌شوند؟',
        answer: 'خیر، ادغام PDF به صورت کامل داخل مرورگر انجام می‌شود و فایلی به سرور ارسال نمی‌شود.',
      },
      {
        question: 'حداکثر حجم چقدر است؟',
        answer: 'تا زمان فعال شدن پردازنده worker محدودیت پیشنهادی 50 مگابایت است.',
      },
    ],
  },
  {
    id: 'image-compress',
    slug: '/tools/image-compress',
    category: 'image',
    titleFa: 'فشرده‌سازی تصویر',
    descriptionFa: 'حجم تصویر را بدون افت محسوس کیفیت برای ارسال سریع کاهش بده.',
    keywords: ['image', 'compress', 'فشرده سازی'],
    indexable: true,
    lastModified: '2026-02-17',
    faqs: [
      {
        question: 'خروجی برای پیام‌رسان‌ها بهینه می‌شود؟',
        answer: 'بله، پروفایل پیش‌فرض برای ارسال در پیام‌رسان‌های رایج ایران تنظیم می‌شود.',
      },
    ],
  },
  {
    id: 'image-resize',
    slug: '/tools/image-resize',
    category: 'image',
    titleFa: 'تغییر اندازه تصویر',
    descriptionFa: 'ابعاد تصویر را دقیق به ابعاد هدف تغییر بده (px یا نسبت).',
    keywords: ['image', 'resize', 'تغییر اندازه'],
    indexable: true,
    lastModified: '2026-02-17',
  },
]

export const popularTools = tools.filter((tool) => tool.indexable).slice(0, 3)

export function toolsByCategory(categoryId: ToolCategory['id']) {
  return tools.filter((tool) => tool.category === categoryId)
}
