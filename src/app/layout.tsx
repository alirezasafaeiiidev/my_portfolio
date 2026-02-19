import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/seo/json-ld";
import { I18nProvider } from "@/lib/i18n-context";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { FontCdnLoader } from "@/components/layout/font-cdn-loader";
import { generatePersonSchema, generateWebSiteSchema, generateBreadcrumbSchema, generateOrganizationSchema } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-config";
import { brand } from "@/lib/brand";
import { env } from "@/lib/env";
import { cookies, headers } from "next/headers";

const siteUrl = getSiteUrl();
const ownerName = brand.ownerName;
const primaryDescription = brand.positioningFa;
const fontCdnEnabled = env.NEXT_PUBLIC_FONT_CDN_ENABLED === 'true' && Boolean(env.NEXT_PUBLIC_FONT_CDN_URL);
const fontCdnUrl = env.NEXT_PUBLIC_FONT_CDN_URL;

export const metadata: Metadata = {
  title: {
    default: "Alireza Safaei | Production-Grade Web Systems Engineer",
    template: "%s | Alireza Safaei",
  },
  description: primaryDescription,
  keywords: [
    "infrastructure localization",
    "operational resilience",
    "production stability",
    "ci/cd hardening",
    "release governance",
    "disaster recovery planning",
    "ارزیابی ریسک زیرساخت",
    "معماری مقاوم در برابر تحریم",
    "سخت سازی CI/CD",
    "پایداری عملیاتی تولید",
  ],
  authors: [{ name: ownerName, url: siteUrl }],
  creator: ownerName,
  publisher: brand.brandName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    alternateLocale: ['en_US'],
    url: siteUrl,
    siteName: `${brand.brandName} | ${ownerName}`,
    title: 'برنامه بومی‌سازی زیرساخت و تاب‌آوری عملیاتی',
    description: primaryDescription,
    images: [
      {
        url: '/api/og-image',
        height: 630,
        alt: `${ownerName} - Production-Grade Web Systems Engineer`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${ownerName} | Production-Grade Web Systems Engineer`,
    description: primaryDescription,
    images: ['/api/og-image'],
    creator: brand.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: brand.googleVerificationCode,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get('x-csp-nonce') || undefined;
  const langCookie = (await cookies()).get('lang')?.value;
  const lang = langCookie === 'en' ? 'en' : 'fa';
  const dir = lang === 'fa' ? 'rtl' : 'ltr';

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preload" href="/fonts/IRANSansX-Regular-arabic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="alternate" type="application/rss+xml" title="RSS Feed (English)" href="/api/rss?lang=en" />
        <link rel="alternate" type="application/rss+xml" title="خوراک RSS (فارسی)" href="/api/rss?lang=fa" />
      </head>
      <body
        className="antialiased bg-background text-foreground min-h-screen flex flex-col font-sans"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider initialLanguage={lang as 'fa' | 'en'}>
          {/* Skip to main content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
          >
            پرش به محتوای اصلی
          </a>

          {/* Schema.org Structured Data */}
          <JsonLd data={generatePersonSchema()} nonce={nonce} />
          <JsonLd data={generateWebSiteSchema()} nonce={nonce} />
          <JsonLd data={generateOrganizationSchema()} nonce={nonce} />
          <JsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: 'برنامه بومی‌سازی زیرساخت و تاب‌آوری عملیاتی',
              provider: {
                '@type': 'Person',
                name: ownerName,
                url: siteUrl,
              },
              areaServed: 'IR',
              serviceType: 'Infrastructure risk audit, architecture hardening, governance and DR planning',
              offers: {
                '@type': 'Offer',
                priceCurrency: 'IRR',
                priceSpecification: {
                  '@type': 'PriceSpecification',
                  minPrice: '60000000',
                  maxPrice: '120000000',
                  priceCurrency: 'IRR',
                },
              },
            }}
            nonce={nonce}
          />
          <JsonLd data={generateBreadcrumbSchema([
            { name: 'Home', url: siteUrl },
          ])} nonce={nonce} />

          <Header />
          <FontCdnLoader enabled={fontCdnEnabled} href={fontCdnUrl} />
          <main id="main-content" className="flex-1 pb-20 md:pb-0">
            {children}
          </main>
          <Footer />
          <Toaster />
        </I18nProvider>
      </ThemeProvider>
      </body>
    </html>
  );
}
