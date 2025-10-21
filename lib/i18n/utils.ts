import { Locale } from './config'

type TranslationData = Record<string, any>

const translationCache: Record<Locale, TranslationData> = {
  nl: {},
  en: {},
  ar: {},
}

export async function getTranslations(locale: Locale): Promise<TranslationData> {
  if (Object.keys(translationCache[locale]).length > 0) {
    return translationCache[locale]
  }

  try {
    const translations = await import(
      `@/public/locales/${locale}/common.json`
    )
    translationCache[locale] = translations.default
    return translations.default
  } catch (error) {
    console.error(`Failed to load translations for locale: ${locale}`, error)
    return {}
  }
}

export function createTranslator(translations: TranslationData) {
  return function t(key: string, fallback?: string): string {
    const keys = key.split('.')
    let value: any = translations

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return fallback || key
      }
    }

    return typeof value === 'string' ? value : fallback || key
  }
}

export type Translator = ReturnType<typeof createTranslator>
