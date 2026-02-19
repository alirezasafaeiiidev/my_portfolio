# Edge Header Verification — 2026-02-19

Verification source: trusted VPS network (`deploy@185.3.124.93`)

## https://alirezasafaeisystems.ir
- status: `200`
- expected headers present:
  - `strict-transport-security`
  - `content-security-policy`
  - `x-frame-options`
  - `referrer-policy`

## https://www.alirezasafaeisystems.ir
- status: `301`
- redirect target: `https://alirezasafaeisystems.ir/`
- `strict-transport-security` present on redirect response.

## https://staging.alirezasafaeisystems.ir
- status: `200`
- expected headers present:
  - `strict-transport-security`
  - `content-security-policy`
  - `x-frame-options`
  - `referrer-policy`

## Summary
- edge-header verification: `PASS`
- canonical redirect policy at edge: `PASS` (`www` -> apex, `?v=12345` -> clean URL)
