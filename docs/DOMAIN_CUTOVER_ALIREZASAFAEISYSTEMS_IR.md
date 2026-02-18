# Domain Cutover Runbook (asdev-portfolio)

هدف: سوییچ کامل پورتفولیو به دامنه جدید `alirezasafaeisystems.ir` با حداقل ریسک و بدون downtime محسوس.

تاریخ تهیه: 2026-02-18

## 1) Precheck (خارج از سرور)

```bash
dig +short NS alirezasafaeisystems.ir
dig +short A alirezasafaeisystems.ir
dig +short A www.alirezasafaeisystems.ir
curl -I http://alirezasafaeisystems.ir
curl -I https://alirezasafaeisystems.ir
```

انتظار:
- NS روی Arvan (`g.ns.arvancdn.ir`, `o.ns.arvancdn.ir`)
- A به IP درست سرور
- HTTP پاسخ بدهد
- اگر HTTPS خطای certificate mismatch داشت، مرحله SSL لازم است.

## 2) Precheck روی VPS

```bash
sudo nginx -t
sudo systemctl status nginx --no-pager
sudo ss -ltnp | rg ':3002|:3003|:80|:443'
```

## 3) اعمال کانفیگ جدید دامنه

از داخل ریپو روی VPS:

```bash
cd /var/www/asdev-portfolio
git pull --ff-only
bash scripts/deploy/validate-cohosting-config.sh ops/nginx/asdev-cohosting.conf
```

اعمال Nginx:

```bash
sudo cp ops/nginx/asdev-cohosting.conf /etc/nginx/sites-available/asdev-cohosting.conf
sudo ln -sfn /etc/nginx/sites-available/asdev-cohosting.conf /etc/nginx/sites-enabled/asdev-cohosting.conf
sudo nginx -t
sudo systemctl reload nginx
```

## 4) صدور SSL برای دامنه جدید

نکته: چون staging جداست، دو گواهی صادر کن:

```bash
# production + www
sudo certbot certonly --nginx \
  -d alirezasafaeisystems.ir \
  -d www.alirezasafaeisystems.ir

# staging
sudo certbot certonly --nginx \
  -d staging.alirezasafaeisystems.ir
```

اگر `certbot` نصب نبود:

```bash
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx
```

## 5) Verify نهایی TLS/HTTP

```bash
sudo nginx -t
sudo systemctl reload nginx

curl -I https://alirezasafaeisystems.ir
curl -I https://www.alirezasafaeisystems.ir
curl -I https://staging.alirezasafaeisystems.ir

echo | openssl s_client -connect alirezasafaeisystems.ir:443 -servername alirezasafaeisystems.ir 2>/dev/null | openssl x509 -noout -subject -issuer -dates -ext subjectAltName
```

انتظار:
- HTTPS بدون خطای certificate
- SAN شامل `alirezasafaeisystems.ir` و `www.alirezasafaeisystems.ir`
- هدر `Strict-Transport-Security` روی پاسخ 200/301

## 6) اپلیکیشن (SEO/Base URL)

روی سرویس production، مقدار env جدید:

```bash
NEXT_PUBLIC_SITE_URL=https://alirezasafaeisystems.ir
```

پس از تغییر:

```bash
pnpm install --frozen-lockfile
pnpm run build
pm2 restart all
```

## 7) Smoke checks

```bash
curl -I https://alirezasafaeisystems.ir/robots.txt
curl -I https://alirezasafaeisystems.ir/sitemap.xml
curl -I https://alirezasafaeisystems.ir/admin/login
```

## 8) Rollback فوری (در صورت مشکل)

```bash
sudo cp /etc/nginx/sites-available/asdev-cohosting.conf /etc/nginx/sites-available/asdev-cohosting.conf.bak.$(date +%F-%H%M)
# restore from last known good config
sudo nginx -t && sudo systemctl reload nginx
```

اگر مشکل از TLS دامنه جدید بود، موقتاً فقط HTTP نگه ندار؛
بهتر است گواهی صحیح را سریع صادر و reload انجام شود.
