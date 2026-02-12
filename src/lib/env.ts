import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.enum(['true', 'false']).default('false'),
  NEXT_PUBLIC_ENABLE_WEB_VITALS: z.enum(['true', 'false']).default('false'),
  ADMIN_API_TOKEN: z.string().min(16).optional(),
  ADMIN_USERNAME: z.string().min(3).optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  ADMIN_SESSION_SECRET: z.string().min(32).optional(),
  ADMIN_SESSION_MAX_AGE_SECONDS: z.coerce.number().int().positive().default(60 * 60 * 8),
  REDIS_REST_URL: z.string().url().optional(),
  REDIS_REST_TOKEN: z.string().min(8).optional(),
  API_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  API_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(5),
})

export type AppEnv = z.infer<typeof envSchema>

export function parseEnv(input: Record<string, string | undefined>): AppEnv {
  return envSchema.parse(input)
}

const parsed = parseEnv({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
  NEXT_PUBLIC_ENABLE_WEB_VITALS: process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS,
  ADMIN_API_TOKEN: process.env.ADMIN_API_TOKEN,
  ADMIN_USERNAME: process.env.ADMIN_USERNAME,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
  ADMIN_SESSION_MAX_AGE_SECONDS: process.env.ADMIN_SESSION_MAX_AGE_SECONDS,
  REDIS_REST_URL: process.env.REDIS_REST_URL,
  REDIS_REST_TOKEN: process.env.REDIS_REST_TOKEN,
  API_RATE_LIMIT_WINDOW_MS: process.env.API_RATE_LIMIT_WINDOW_MS,
  API_RATE_LIMIT_MAX_REQUESTS: process.env.API_RATE_LIMIT_MAX_REQUESTS,
})

export const env = parsed
