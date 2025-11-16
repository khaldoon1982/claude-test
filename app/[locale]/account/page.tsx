import { Metadata } from 'next/metadata'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Locale } from '@/lib/i18n/config'
import { getTranslations } from '@/lib/i18n/utils'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Mijn Account | RefurbX',
  description: 'Beheer je RefurbX account',
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const translations = await getTranslations(locale as Locale)
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/auth/login`)
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch recent orders
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <>
      <Header locale={locale as Locale} translations={translations} />

      <main className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <h1 className="mb-8 text-4xl font-bold">Mijn Account</h1>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="mb-6">
                    <p className="text-sm text-gray-600">Ingelogd als</p>
                    <p className="font-semibold">{user.email}</p>
                  </div>

                  <nav className="space-y-2">
                    <Link
                      href={`/${locale}/account`}
                      className="block rounded-lg bg-primary-50 px-4 py-2 font-medium text-primary-600"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href={`/${locale}/account/bestellingen`}
                      className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Mijn Bestellingen
                    </Link>
                    <Link
                      href={`/${locale}/account/adressen`}
                      className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Adressen
                    </Link>
                    <Link
                      href={`/${locale}/account/profiel`}
                      className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profiel
                    </Link>
                  </nav>
                </div>
              </aside>

              {/* Main Content */}
              <div className="space-y-6 lg:col-span-2">
                {/* Welcome */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h2 className="mb-2 text-2xl font-bold">
                    Welkom terug,{' '}
                    {profile?.first_name || user.email?.split('@')[0]}!
                  </h2>
                  <p className="text-gray-600">
                    Bekijk je bestellingen en beheer je accountgegevens.
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="rounded-lg bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-600">Totaal besteld</p>
                    <p className="text-3xl font-bold text-primary-600">
                      {orders?.length || 0}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-600">Openstaand</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {orders?.filter((o) => o.status === 'processing').length || 0}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-600">Afgerond</p>
                    <p className="text-3xl font-bold text-green-600">
                      {orders?.filter((o) => o.status === 'delivered').length || 0}
                    </p>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Recente Bestellingen</h2>
                    <Link
                      href={`/${locale}/account/bestellingen`}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Bekijk alle →
                    </Link>
                  </div>

                  {orders && orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0"
                        >
                          <div>
                            <p className="font-semibold">{order.order_number}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(order.created_at).toLocaleDateString('nl-NL')}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                order.status === 'delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'processing'
                                    ? 'bg-orange-100 text-orange-800'
                                    : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-gray-600">
                      <p className="mb-4">Je hebt nog geen bestellingen geplaatst.</p>
                      <Link
                        href={`/${locale}/laptops`}
                        className="inline-block rounded-lg bg-primary-600 px-6 py-2 font-semibold text-white hover:bg-primary-700"
                      >
                        Start met winkelen
                      </Link>
                    </div>
                  )}
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
