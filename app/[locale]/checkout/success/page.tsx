import { Metadata } from 'next/metadata'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Locale } from '@/lib/i18n/config'
import { getTranslations } from '@/lib/i18n/utils'
import { formatCurrency } from '@/lib/utils/currency'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Bestelling Gelukt | RefurbX',
  description: 'Bedankt voor je bestelling!',
}

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ order?: string }>
}) {
  const { locale } = await params
  const { order: orderId } = await searchParams
  const translations = await getTranslations(locale as Locale)
  const supabase = await createClient()

  let order = null
  let orderItems = null

  if (orderId) {
    const { data } = await supabase
      .from('orders')
      .select(
        `
        *,
        items:order_items(*)
      `
      )
      .eq('id', orderId)
      .single()

    order = data
    orderItems = data?.items || []
  }

  return (
    <>
      <Header locale={locale as Locale} translations={translations} />

      <main className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-12 w-12 text-green-600"
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
            </div>

            {/* Success Message */}
            <div className="rounded-lg bg-white p-8 text-center shadow-sm">
              <h1 className="mb-4 text-3xl font-bold text-gray-900">
                Bedankt voor je bestelling!
              </h1>

              {order ? (
                <>
                  <p className="mb-6 text-gray-600">
                    Je bestelling is succesvol geplaatst. We hebben een
                    bevestigingsmail gestuurd naar{' '}
                    <strong>{order.customer_email}</strong>.
                  </p>

                  <div className="mb-6 rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-600">Bestelnummer</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {order.order_number}
                    </p>
                  </div>

                  {/* Order Details */}
                  <div className="mb-6 border-t border-gray-200 pt-6 text-left">
                    <h2 className="mb-4 text-xl font-semibold">Bestelling details</h2>

                    <div className="space-y-3">
                      {orderItems.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm"
                        >
                          <div>
                            <p className="font-medium">{item.product_title}</p>
                            <p className="text-gray-600">Aantal: {item.quantity}</p>
                          </div>
                          <p className="font-semibold">
                            {formatCurrency(item.total_cents, 'EUR', locale)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotaal</span>
                        <span>
                          {formatCurrency(order.subtotal_cents, 'EUR', locale)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Verzending</span>
                        <span>
                          {formatCurrency(order.shipping_cents, 'EUR', locale)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">BTW</span>
                        <span>
                          {formatCurrency(order.vat_total_cents, 'EUR', locale)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-2">
                        <span className="font-bold">Totaal</span>
                        <span className="text-xl font-bold text-primary-600">
                          {formatCurrency(order.total_cents, 'EUR', locale)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* What's Next */}
                  <div className="rounded-lg bg-blue-50 p-4 text-left">
                    <h3 className="mb-2 font-semibold text-blue-900">
                      Wat gebeurt er nu?
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li className="flex gap-2">
                        <span>✓</span>
                        <span>
                          Je ontvangt binnen enkele minuten een bevestigingsmail
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span>✓</span>
                        <span>
                          We verwerken je bestelling binnen 1-2 werkdagen
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span>✓</span>
                        <span>
                          Je ontvangt een track & trace code zodra je bestelling
                          verzonden is
                        </span>
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <p className="text-gray-600">
                  Je bestelling wordt verwerkt. Je ontvangt binnenkort een
                  bevestigingsmail.
                </p>
              )}

              {/* Actions */}
              <div className="mt-8 flex gap-4">
                <Link
                  href={`/${locale}`}
                  className="flex-1 rounded-lg border-2 border-primary-600 px-6 py-3 font-semibold text-primary-600 hover:bg-primary-50"
                >
                  Terug naar home
                </Link>
                {order && order.user_id && (
                  <Link
                    href={`/${locale}/account/bestellingen/${order.id}`}
                    className="flex-1 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700"
                  >
                    Bekijk bestelling
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale as Locale} translations={translations} />
    </>
  )
}
