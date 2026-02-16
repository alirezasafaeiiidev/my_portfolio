# معماری

```mermaid
flowchart LR
  Browser-->NextJS[Next.js App]
  NextJS-->API[API Routes]
  API-->DB[(SQLite via Prisma)]
  API-->Redis[(Redis REST - Optional)]
  NextJS-->Metrics[/api/metrics]
```

## اجزا
- Next.js (App Router)
- Prisma + SQLite (قابل ارتقا به Postgres در VPS)
- Endpoint متریک برای پایش

## ملاحظات
- برای ترافیک بالا، SQLite محدود است و بهتر است به Postgres مهاجرت شود.
