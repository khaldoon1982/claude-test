import { Metadata } from 'next/metadata'
import { Locale } from '@/lib/i18n/config'
import { getTranslations } from '@/lib/i18n/utils'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartContent from './CartContent'

export const metadata: Metadata = {
  title: 'Winkelwagen | RefurbX',
  description: 'Bekijk je winkelwagen en rond je bestelling af.',
}

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const translations = await getTranslations(locale as Locale)

  return (
    <>
      <Header locale={locale as Locale} translations={translations} />

      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="mb-8 text-4xl font-bold">Winkelwagen</h1>
          <CartContent locale={locale as Locale} />
        </div>
      </main>

      <Footer locale={locale as Locale} translations={translations} />
    </>
  )
}
