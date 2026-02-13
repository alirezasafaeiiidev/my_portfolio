import Link from 'next/link'
import { brand } from '@/lib/brand'

interface BrandLinkProps {
  locale?: 'fa' | 'en'
  className?: string
}

export function BrandLink({ locale = 'fa', className }: BrandLinkProps) {
  const label = locale === 'fa' ? 'درخواست بررسی فنی' : 'Engineering Review Request'

  return (
    <Link href={brand.urls.engineeringRequest} className={className} target="_blank" rel="noopener noreferrer">
      {label}
    </Link>
  )
}
