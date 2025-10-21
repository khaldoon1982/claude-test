export const locales = ['nl', 'en', 'ar'] as const
export const defaultLocale = 'nl' as const

export type Locale = (typeof locales)[number]

export const localeNames: Record<Locale, string> = {
  nl: 'Nederlands',
  en: 'English',
  ar: 'العربية',
}

export const localeFlags: Record<Locale, string> = {
  nl: '🇳🇱',
  en: '🇬🇧',
  ar: '🇸🇦',
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

export function getLocaleDirection(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr'
}
