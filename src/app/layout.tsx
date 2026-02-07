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

export const metadata: Metadata = {
  title: {
    default: "پورتفولیو - توسعه‌دهنده فول‌استک | Portfolio - Full Stack Developer",
    template: "%s | پورتفولیو",
  },
  description: "Full Stack Developer with expertise in Next.js, TypeScript, React, and modern web development. Building scalable, performant web applications with best practices.",
  keywords: ["portfolio", "full stack developer", "Next.js", "TypeScript", "React", "web development", "frontend", "backend", "پورتفولیو", "توسعه‌دهنده فول‌استک", "توسعه وب"],
  authors: [{ name: "Your Name", url: "https://yourportfolio.com" }],
  creator: "Your Name",
  publisher: "Your Name",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yourportfolio.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en': 'https://yourportfolio.com/en',
      'fa': 'https://yourportfolio.com/fa',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['fa_IR'],
    url: 'https://yourportfolio.com',
    siteName: 'Portfolio | پورتفولیو',
    title: 'Portfolio - Full Stack Developer | پورتفولیو - توسعه‌دهنده فول‌استک',
    description: 'Full Stack Developer with expertise in Next.js, TypeScript, React, and modern web development. Building scalable, performant web applications.',
    images: [
      {
        url: '/api/og-image',
        width: 1200,
        height: 630,
        alt: 'Portfolio - Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio - Full Stack Developer | پورتفولیو',
    description: 'Full Stack Developer with expertise in Next.js, TypeScript, React, and modern web development.',
    images: ['/api/og-image'],
    creator: '@yourusername',
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
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
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
          <JsonLd data={generatePersonSchema()} />
          <JsonLd data={generateWebSiteSchema()} />
          <JsonLd data={generateOrganizationSchema()} />
          <JsonLd data={generateBreadcrumbSchema([
            { name: 'Home', url: 'https://yourportfolio.com' },
          ])} />

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
