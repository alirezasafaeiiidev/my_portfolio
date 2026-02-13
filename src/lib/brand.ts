import { env } from '@/lib/env'

const DEFAULT_OWNER_NAME = 'Portfolio Owner'
const DEFAULT_BRAND_NAME = 'ASDEV Portfolio'
const DEFAULT_GITHUB_URL = 'https://github.com/alirezasafaeiiidev'
const DEFAULT_LINKEDIN_URL = 'https://linkedin.com'
const DEFAULT_TWITTER_URL = 'https://x.com'
const DEFAULT_CONTACT_EMAIL = 'contact@portfolio.example.com'

export const brand = {
  ownerName: env.NEXT_PUBLIC_OWNER_NAME || DEFAULT_OWNER_NAME,
  brandName: env.NEXT_PUBLIC_BRAND_NAME || DEFAULT_BRAND_NAME,
  twitterHandle: env.NEXT_PUBLIC_TWITTER_HANDLE || undefined,
  githubUrl: env.NEXT_PUBLIC_GITHUB_URL || DEFAULT_GITHUB_URL,
  linkedinUrl: env.NEXT_PUBLIC_LINKEDIN_URL || DEFAULT_LINKEDIN_URL,
  twitterUrl: env.NEXT_PUBLIC_TWITTER_URL || DEFAULT_TWITTER_URL,
  contactEmail: env.NEXT_PUBLIC_CONTACT_EMAIL || DEFAULT_CONTACT_EMAIL,
  googleVerificationCode: env.NEXT_PUBLIC_GOOGLE_VERIFICATION_CODE || undefined,
} as const
