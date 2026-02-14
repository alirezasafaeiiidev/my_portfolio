import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { WebVitals } from "@/components/analytics/web-vitals";
import { ServiceWorkerProvider } from "@/components/service-worker/client-provider";
import { I18nProvider } from "@/lib/i18n-context";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { generatePersonSchema, generateWebSiteSchema, generateBreadcrumbSchema, generateOrganizationSchema } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-config";
import { brand } from "@/lib/brand";
import { headers } from "next/headers";

const siteUrl = getSiteUrl();
const ownerName = brand.ownerName;
const primaryDescription = brand.positioningEn;

export const metadata: Metadata = {
  title: {
    default: "Alireza Safaei | Production-Grade Web Systems Consultant",
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
    title: 'Infrastructure Localization & Operational Resilience Program',
    description: primaryDescription,
    images: [
      {
        url: '/api/og-image',
        height: 630,
        alt: `${ownerName} - Production-Grade Web Systems Consultant`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${ownerName} | Production-Grade Web Systems Consultant`,
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

  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="alternate" type="application/rss+xml" title="RSS Feed (English)" href="/api/rss?lang=en" />
        <link rel="alternate" type="application/rss+xml" title="خوراک RSS (فارسی)" href="/api/rss?lang=fa" />
        {/* Font preload for performance */}
        <link rel="preload" href="/fonts/IRANSansX-Regular.ttf" as="font" type="font/ttf" crossOrigin="" />
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
          <I18nProvider>
          <ServiceWorkerProvider />
          <WebVitals />

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
              name: 'Infrastructure Localization & Operational Resilience Program',
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
          <main id="main-content" className="flex-1 pb-20 md:pb-0">
            {children}
          </main>
          <Footer />
          <BottomNav />
          <Toaster />
        </I18nProvider>
      </ThemeProvider>
      </body>
    </html>
  );
}
