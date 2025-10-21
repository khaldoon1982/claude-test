import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locales, isValidLocale, getLocaleDirection } from '@/lib/i18n/config'
import '../globals.css'

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: {
    default: 'RefurbX - Refurbished Laptops van Topkwaliteit',
    template: '%s | RefurbX',
  },
  description:
    'Koop refurbished laptops van topkwaliteit bij RefurbX. Dell, HP, Lenovo en meer. Gratis verzending vanaf €75. 12 maanden garantie.',
  keywords: [
    'refurbished laptops',
    'tweedehands laptops',
    'Dell laptop',
    'HP laptop',
    'Lenovo laptop',
    'zakelijke laptops',
  ],
  authors: [{ name: 'RefurbX' }],
  creator: 'RefurbX',
  publisher: 'RefurbX',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://refurbx.nl'),
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: 'https://refurbx.nl',
    siteName: 'RefurbX',
    title: 'RefurbX - Refurbished Laptops van Topkwaliteit',
    description:
      'Koop refurbished laptops van topkwaliteit bij RefurbX. Dell, HP, Lenovo en meer.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RefurbX - Refurbished Laptops',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RefurbX - Refurbished Laptops van Topkwaliteit',
    description:
      'Koop refurbished laptops van topkwaliteit bij RefurbX. Dell, HP, Lenovo en meer.',
    images: ['/twitter-image.jpg'],
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
    google: 'your-google-site-verification',
  },
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  const direction = getLocaleDirection(locale)

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
