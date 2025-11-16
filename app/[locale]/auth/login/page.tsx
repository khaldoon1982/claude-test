import { Metadata } from 'next/metadata'
import Link from 'next/link'
import { Locale } from '@/lib/i18n/config'
import { getTranslations } from '@/lib/i18n/utils'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Inloggen | RefurbX',
  description: 'Log in op je RefurbX account',
}

export default async function LoginPage({
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
          <div className="mx-auto max-w-md">
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <h1 className="mb-6 text-center text-3xl font-bold">Inloggen</h1>

              <LoginForm locale={locale as Locale} />

              <div className="mt-6 text-center text-sm text-gray-600">
                Nog geen account?{' '}
                <Link
                  href={`/${locale}/auth/signup`}
                  className="font-medium text-primary-600 hover:text-primary-700"
                >
                  Registreer nu
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale as Locale} translations={translations} />
    </>
  )
}
