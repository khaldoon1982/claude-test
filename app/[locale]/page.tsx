import Link from 'next/link'
import { Locale } from '@/lib/i18n/config'
import { getTranslations } from '@/lib/i18n/utils'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const translations = await getTranslations(locale as Locale)

  const t = (key: string) => {
    const keys = key.split('.')
    let value: any = translations
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  return (
    <>
      <Header locale={locale as Locale} translations={translations} />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 to-white py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-5xl font-bold text-gray-900">
                {t('site.tagline')}
              </h1>
              <p className="mb-8 text-xl text-gray-600">
                Ontdek onze collectie refurbished laptops met tot 50% korting.
                Kwaliteit gegarandeerd, snelle levering en 12 maanden garantie.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href={`/${locale}/laptops`}
                  className="rounded-lg bg-primary-600 px-8 py-3 font-semibold text-white hover:bg-primary-700"
                >
                  {t('nav.laptops')}
                </Link>
                <Link
                  href={`/${locale}/deals`}
                  className="rounded-lg border-2 border-primary-600 px-8 py-3 font-semibold text-primary-600 hover:bg-primary-50"
                >
                  {t('nav.deals')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                  <svg
                    className="h-8 w-8 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">12 Maanden Garantie</h3>
                <p className="text-gray-600">
                  Alle laptops worden geleverd met 12 maanden volledige garantie
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                  <svg
                    className="h-8 w-8 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Topkwaliteit</h3>
                <p className="text-gray-600">
                  Alle apparaten worden professioneel getest en schoongemaakt
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                  <svg
                    className="h-8 w-8 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Gratis Verzending</h3>
                <p className="text-gray-600">
                  Gratis verzending bij bestellingen boven €75
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Brands Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Populaire Merken
            </h2>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {['Dell', 'HP', 'Lenovo', 'Apple'].map((brand) => (
                <Link
                  key={brand}
                  href={`/${locale}/brands/${brand.toLowerCase()}`}
                  className="flex items-center justify-center rounded-lg bg-white p-8 shadow-sm hover:shadow-md"
                >
                  <span className="text-2xl font-bold text-gray-700">
                    {brand}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="rounded-2xl bg-primary-600 px-8 py-12 text-center text-white">
              <h2 className="mb-4 text-3xl font-bold">
                Zakelijke oplossingen nodig?
              </h2>
              <p className="mb-8 text-xl">
                Wij bieden speciale prijzen en service voor zakelijke klanten
              </p>
              <Link
                href={`/${locale}/zakelijk`}
                className="inline-block rounded-lg bg-white px-8 py-3 font-semibold text-primary-600 hover:bg-gray-100"
              >
                Meer informatie
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale as Locale} translations={translations} />
    </>
  )
}
