import Link from 'next/link'
import { brand } from '@/lib/brand'

interface BrandFooterProps {
  locale?: 'fa' | 'en'
}

export function BrandFooter({ locale = 'fa' }: BrandFooterProps) {
  return (
    <div className="border-t bg-muted/20">
      <div className="container mx-auto px-4 py-3 text-center text-xs text-muted-foreground">
        {locale === 'fa' ? (
          <>
            طراحی و اجرای زیرساخت فنی توسط{' '}
            <Link href={brand.urls.engineeringHub} target="_blank" rel="noopener noreferrer" className="underline">
              {brand.shortNameFa}
            </Link>
          </>
        ) : (
          <>
            Engineering by{' '}
            <Link href={brand.urls.engineeringHub} target="_blank" rel="noopener noreferrer" className="underline">
              {brand.shortNameEn}
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
