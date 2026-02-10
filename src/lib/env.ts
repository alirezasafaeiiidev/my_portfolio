import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_ENABLE_WEB_VITALS: z.enum(['true', 'false']).default('false'),
  ADMIN_API_TOKEN: z.string().min(16).optional(),
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
  NEXT_PUBLIC_ENABLE_WEB_VITALS: process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS,
  ADMIN_API_TOKEN: process.env.ADMIN_API_TOKEN,
  API_RATE_LIMIT_WINDOW_MS: process.env.API_RATE_LIMIT_WINDOW_MS,
  API_RATE_LIMIT_MAX_REQUESTS: process.env.API_RATE_LIMIT_MAX_REQUESTS,
})

export const env = parsed

