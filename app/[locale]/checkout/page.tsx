import { Metadata } from 'next/metadata'
import { redirect } from 'next/navigation'
import { Locale } from '@/lib/i18n/config'
import { getTranslations } from '@/lib/i18n/utils'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CheckoutForm from './CheckoutForm'

export const metadata: Metadata = {
  title: 'Afrekenen | RefurbX',
  description: 'Rond je bestelling veilig af',
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const translations = await getTranslations(locale as Locale)
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user's addresses if logged in
  let addresses = null
  if (user) {
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })

    addresses = data
  }

  return (
    <>
      <Header locale={locale as Locale} translations={translations} />

      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="mb-8 text-4xl font-bold">Afrekenen</h1>

          <CheckoutForm
            locale={locale as Locale}
            user={user}
            savedAddresses={addresses || []}
          />
        </div>
      </main>

      <Footer locale={locale as Locale} translations={translations} />
    </>
  )
}
