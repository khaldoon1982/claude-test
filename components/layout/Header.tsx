'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Locale } from '@/lib/i18n/config'

interface HeaderProps {
  locale: Locale
  translations: Record<string, any>
}

export default function Header({ locale, translations }: HeaderProps) {
  const pathname = usePathname()
  const t = (key: string) => {
    const keys = key.split('.')
    let value: any = translations
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  const navItems = [
    { href: `/${locale}`, label: t('nav.home') },
    { href: `/${locale}/laptops`, label: t('nav.laptops') },
    { href: `/${locale}/deals`, label: t('nav.deals') },
    { href: `/${locale}/brands`, label: t('nav.brands') },
    { href: `/${locale}/zakelijk`, label: t('nav.business') },
    { href: `/${locale}/service`, label: t('nav.service') },
    { href: `/${locale}/over-ons`, label: t('nav.about') },
    { href: `/${locale}/contact`, label: t('nav.contact') },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">
              {t('site.name')}
            </span>
          </Link>
        </div>

        <nav className="hidden flex-1 items-center justify-center md:flex">
          <ul className="flex items-center gap-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                    pathname === item.href
                      ? 'text-primary-600'
                      : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <Link
            href={`/${locale}/account`}
            className="text-sm font-medium text-gray-600 transition-colors hover:text-primary-600"
          >
            {t('nav.account')}
          </Link>
          <Link
            href={`/${locale}/winkelwagen`}
            className="flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
            {t('nav.cart')}
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="border-t md:hidden">
        <nav className="container mx-auto px-4 py-4">
          <ul className="grid grid-cols-2 gap-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
