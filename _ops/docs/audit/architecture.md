# معماری و جریان‌ها

## ساختار منطقی
- `src/app/*`: صفحات، layout، و API routeها
- `src/lib/*`: env، امنیت، rate-limit، auth، db، logger
- `src/__tests__/*`: تست‌های واحد/یکپارچه API و کتابخانه‌ها

## چرخه درخواست (Request Lifecycle)
1. درخواست وارد `proxy` می‌شود و هدرهای امنیتی/CSP/Cache اعمال می‌شود.
2. برای مسیرهای `admin/*` اعتبار session بررسی می‌شود.
3. API route با `createRequestId` و `withCommonApiHeaders` پاسخ استاندارد تولید می‌کند.
4. برای endpointهای حساس، `checkRateLimit` و اکنون `enforceAdminAccess` اعمال می‌شود.

## جریان احراز هویت
- روش‌ها:
  - Bearer token (`ADMIN_API_TOKEN`)
  - Session cookie امضاشده HMAC (`asdev_admin_session`)
- ورود ادمین در `api/admin/auth/login`، خروج در `logout`، وضعیت در `session`.

## جریان داده
- persistence با Prisma روی SQLite (`prisma/schema.prisma`).
- پیام‌ها/leadها در مدل `ContactMessage` ذخیره می‌شوند.

## تغییر معماری اعمال‌شده
- مسیر عمومی `api/messages` قبلا بدون auth بود؛ اکنون با `enforceAdminAccess` محدود شد.
- endpoint جدید `api/ready` برای readiness و چک DB افزوده شد.

## شواهد
- `src/proxy.ts:70`
- `src/lib/admin-auth.ts:138`
- `src/app/api/messages/route.ts:9`
- `src/app/api/ready/route.ts:7`
- `prisma/schema.prisma:67`

## دیاگرام معماری (Mermaid)
```mermaid
flowchart TD
  U[کاربر] --> P[Proxy/Middleware]
  P --> W[Web صفحات App Router]
  P --> A[API Routes]
  A --> S[لایه امنیت: auth + rate-limit + headers]
  S --> DB[(Prisma + SQLite)]
  A --> M[Metrics/Readiness]
```

```mermaid
sequenceDiagram
  participant C as Client
  participant PX as Proxy
  participant API as /api/messages
  participant AU as enforceAdminAccess
  participant DB as Prisma

  C->>PX: GET /api/messages
  PX->>API: forward + security headers
  API->>AU: validate bearer/session
  alt unauthorized
    AU-->>API: 401/503
    API-->>C: error response
  else authorized
    API->>DB: query messages
    DB-->>API: rows
    API-->>C: 200 + messages
  end
```
