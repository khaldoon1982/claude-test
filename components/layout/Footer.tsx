'use client'

import Link from 'next/link'
import { Locale } from '@/lib/i18n/config'

interface FooterProps {
  locale: Locale
  translations: Record<string, any>
}

export default function Footer({ locale, translations }: FooterProps) {
  const t = (key: string) => {
    const keys = key.split('.')
    let value: any = translations
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t('site.name')}</h3>
            <p className="text-sm text-gray-600">{t('site.tagline')}</p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">
              {t('footer.company')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/over-ons`}
                  className="text-sm text-gray-600 hover:text-primary-600"
                >
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/zakelijk`}
                  className="text-sm text-gray-600 hover:text-primary-600"
                >
                  {t('nav.business')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-sm text-gray-600 hover:text-primary-600"
                >
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">
              {t('footer.support')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/service/faq`}
                  className="text-sm text-gray-600 hover:text-primary-600"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/service/retour`}
                  className="text-sm text-gray-600 hover:text-primary-600"
                >
                  Retourbeleid
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/service/garantie`}
                  className="text-sm text-gray-600 hover:text-primary-600"
                >
                  Garantie
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">
              {t('footer.newsletter')}
            </h4>
            <p className="mb-4 text-sm text-gray-600">
              {t('footer.newsletterText')}
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder={t('forms.email')}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                {t('footer.subscribe')}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-600">
              {t('footer.copyright').replace('2025', currentYear.toString())}
            </p>
            <div className="flex gap-4">
              <Link
                href={`/${locale}/privacy`}
                className="text-sm text-gray-600 hover:text-primary-600"
              >
                Privacy Policy
              </Link>
              <Link
                href={`/${locale}/terms`}
                className="text-sm text-gray-600 hover:text-primary-600"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
