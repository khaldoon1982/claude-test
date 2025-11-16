import { Metadata } from 'next/metadata'
import { Locale } from '@/lib/i18n/config'
import { getTranslations } from '@/lib/i18n/utils'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Contact | RefurbX',
  description: 'Neem contact op met RefurbX',
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const translations = await getTranslations(locale as Locale)

  return (
    <>
      <Header locale={locale as Locale} translations={translations} />

      <main className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-8 text-5xl font-bold">Contact</h1>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Contact Form */}
              <div className="rounded-lg bg-white p-8 shadow-sm">
                <h2 className="mb-6 text-2xl font-bold">Stuur ons een bericht</h2>

                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-medium">
                      Naam
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium">
                      E-mailadres
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-1 block text-sm font-medium"
                    >
                      Onderwerp
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-1 block text-sm font-medium"
                    >
                      Bericht
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-primary-600 py-3 font-semibold text-white hover:bg-primary-700"
                  >
                    Verstuur bericht
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-xl font-bold">Contactgegevens</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <svg
                        className="h-6 w-6 flex-shrink-0 text-primary-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <div>
                        <p className="font-medium">E-mail</p>
                        <a
                          href="mailto:info@refurbx.nl"
                          className="text-primary-600 hover:underline"
                        >
                          info@refurbx.nl
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <svg
                        className="h-6 w-6 flex-shrink-0 text-primary-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <div>
                        <p className="font-medium">Telefoon</p>
                        <a
                          href="tel:+31201234567"
                          className="text-primary-600 hover:underline"
                        >
                          +31 20 123 4567
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <svg
                        className="h-6 w-6 flex-shrink-0 text-primary-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <div>
                        <p className="font-medium">Adres</p>
                        <p className="text-gray-600">
                          Hoofdstraat 123
                          <br />
                          1234 AB Amsterdam
                          <br />
                          Nederland
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-xl font-bold">Openingstijden</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Maandag - Vrijdag</span>
                      <span className="font-medium">09:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Zaterdag</span>
                      <span className="font-medium">10:00 - 17:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Zondag</span>
                      <span className="font-medium">Gesloten</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-primary-600 p-6 text-white">
                  <h3 className="mb-2 text-xl font-bold">Direct hulp nodig?</h3>
                  <p className="mb-4">
                    Bekijk onze veelgestelde vragen voor snelle antwoorden.
                  </p>
                  <a
                    href={`/${locale}/service/faq`}
                    className="inline-block rounded-lg bg-white px-6 py-2 font-semibold text-primary-600 hover:bg-gray-100"
                  >
                    Naar FAQ
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale as Locale} translations={translations} />
    </>
  )
}
