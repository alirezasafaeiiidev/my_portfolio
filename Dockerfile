FROM oven/bun:1.3.9 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install

FROM deps AS builder
WORKDIR /app
COPY . .
RUN bun run db:generate && bun run build

FROM oven/bun:1.3.9 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN (groupadd --system --gid 1001 nodejs || addgroup -g 1001 -S nodejs) \
  && (useradd --system --uid 1001 --gid 1001 nextjs || adduser -S -D -u 1001 -G nodejs nextjs)

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/db ./db

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=5 \
  CMD bun -e "fetch('http://127.0.0.1:3000/api').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["bun", "server.js"]
