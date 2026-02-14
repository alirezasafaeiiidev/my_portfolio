import { env } from '@/lib/env'

const DEFAULT_GITHUB_URL = 'https://github.com/alirezasafaeiiidev'
const DEFAULT_CONTACT_EMAIL = 'hello@alirezasafaeidev.ir'
const DEFAULT_POSITIONING_EN =
  'Alireza Safaei — Production-Grade Web Systems Consultant | Architecture & CI/CD Hardening | Helping SaaS Founders Reach Real Production Stability'
const DEFAULT_POSITIONING_FA =
  'علیرضا صفایی — مشاور سیستم‌های وب Production-Grade | معماری و سخت‌سازی CI/CD | کمک به رسیدن SaaSها به پایداری واقعی در تولید'

export const brand = {
  ownerName: env.NEXT_PUBLIC_OWNER_NAME || 'Alireza Safaei',
  brandName: env.NEXT_PUBLIC_BRAND_NAME || 'ASDEV',
  twitterHandle: env.NEXT_PUBLIC_TWITTER_HANDLE || undefined,
  githubUrl: env.NEXT_PUBLIC_GITHUB_URL || DEFAULT_GITHUB_URL,
  linkedinUrl: env.NEXT_PUBLIC_LINKEDIN_URL || '',
  twitterUrl: env.NEXT_PUBLIC_TWITTER_URL || '',
  contactEmail: env.NEXT_PUBLIC_CONTACT_EMAIL || DEFAULT_CONTACT_EMAIL,
  googleVerificationCode: env.NEXT_PUBLIC_GOOGLE_VERIFICATION_CODE || undefined,
  positioningEn: env.NEXT_PUBLIC_POSITIONING_EN || DEFAULT_POSITIONING_EN,
  positioningFa: env.NEXT_PUBLIC_POSITIONING_FA || DEFAULT_POSITIONING_FA,
} as const
