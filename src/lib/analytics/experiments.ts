export type HeroVariant = 'authority' | 'risk'

export function bucketToHeroVariant(bucket: number): HeroVariant {
  return bucket < 50 ? 'authority' : 'risk'
}

export function normalizeBucket(input: number): number {
  if (!Number.isFinite(input)) return 0
  const floored = Math.floor(input)
  if (floored < 0) return 0
  if (floored > 99) return 99
  return floored
}

export function pickDeterministicBucket(seed: string): number {
  if (!seed) return 0
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % 100
}

export function pickHeroVariant(seed: string): HeroVariant {
  return bucketToHeroVariant(pickDeterministicBucket(seed))
}
