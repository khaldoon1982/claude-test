'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Locale } from '@/lib/i18n/config'
import { useCartStore } from '@/lib/store/cartStore'
import { formatCurrency } from '@/lib/utils/currency'

interface CartContentProps {
  locale: Locale
}

export default function CartContent({ locale }: CartContentProps) {
  const [mounted, setMounted] = useState(false)
  const { items, removeItem, updateQuantity, getSubtotal, getVATTotal, getTotal } =
    useCartStore()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <CartSkeleton />
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg bg-white p-12 text-center shadow-sm">
        <svg
          className="mx-auto mb-4 h-24 w-24 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Je winkelwagen is leeg
        </h2>
        <p className="mb-6 text-gray-600">
          Begin met winkelen om producten toe te voegen aan je winkelwagen
        </p>
        <Link
          href={`/${locale}/laptops`}
          className="inline-block rounded-lg bg-primary-600 px-8 py-3 font-semibold text-white hover:bg-primary-700"
        >
          Bekijk laptops
        </Link>
      </div>
    )
  }

  const subtotal = getSubtotal()
  const vat = getVATTotal(21)
  const total = getTotal(21)
  const shippingThreshold = 7500 // €75
  const shippingCost = subtotal >= shippingThreshold ? 0 : 595 // €5.95

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="rounded-lg bg-white shadow-sm">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 border-b border-gray-200 p-6 last:border-b-0"
            >
              {/* Image */}
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                <Image
                  src={item.product.images?.main || '/images/placeholder.png'}
                  alt={item.product.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between">
                  <div>
                    <Link
                      href={`/${locale}/laptops/${item.product.slug}`}
                      className="font-semibold text-gray-900 hover:text-primary-600"
                    >
                      {item.product.title}
                    </Link>
                    {item.product.brand && (
                      <p className="text-sm text-gray-600">
                        {item.product.brand.name}
                      </p>
                    )}
                    <div className="mt-1 flex gap-2 text-xs text-gray-500">
                      {item.product.cpu && (
                        <span>{item.product.cpu.split(' ').slice(-2).join(' ')}</span>
                      )}
                      {item.product.ram_gb && <span>· {item.product.ram_gb}GB</span>}
                      {item.product.storage_gb && (
                        <span>· {item.product.storage_gb}GB</span>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(
                        item.unitPrice * item.quantity,
                        item.product.currency,
                        locale
                      )}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(
                        item.unitPrice,
                        item.product.currency,
                        locale
                      )}{' '}
                      per stuk
                    </p>
                  </div>
                </div>

                {/* Quantity & Remove */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label htmlFor={`qty-${item.productId}`} className="text-sm text-gray-600">
                      Aantal:
                    </label>
                    <select
                      id={`qty-${item.productId}`}
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.productId, parseInt(e.target.value))
                      }
                      className="rounded border border-gray-300 px-3 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      {[...Array(Math.min(item.product.stock, 10))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Verwijderen
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-4">
          <Link
            href={`/${locale}/laptops`}
            className="text-primary-600 hover:text-primary-700"
          >
            ← Verder winkelen
          </Link>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-4 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">Overzicht</h2>

          <div className="space-y-3 border-b border-gray-200 pb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotaal</span>
              <span className="font-semibold">
                {formatCurrency(subtotal, 'EUR', locale)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Verzending</span>
              <span className="font-semibold">
                {shippingCost === 0 ? (
                  <span className="text-green-600">Gratis</span>
                ) : (
                  formatCurrency(shippingCost, 'EUR', locale)
                )}
              </span>
            </div>

            {subtotal < shippingThreshold && (
              <p className="text-xs text-gray-600">
                Nog {formatCurrency(shippingThreshold - subtotal, 'EUR', locale)}{' '}
                tot gratis verzending
              </p>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">BTW (21%)</span>
              <span>{formatCurrency(vat, 'EUR', locale)}</span>
            </div>
          </div>

          <div className="mt-4 flex justify-between border-b border-gray-200 pb-4">
            <span className="text-lg font-bold">Totaal</span>
            <span className="text-2xl font-bold text-primary-600">
              {formatCurrency(total + shippingCost, 'EUR', locale)}
            </span>
          </div>

          <Link
            href={`/${locale}/checkout`}
            className="mt-6 block w-full rounded-lg bg-primary-600 py-3 text-center font-semibold text-white hover:bg-primary-700"
          >
            Afrekenen
          </Link>

          {/* Trust Badges */}
          <div className="mt-6 space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Veilig betalen</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>14 dagen retourrecht</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>12 maanden garantie</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CartSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-lg bg-gray-200" />
          ))}
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="h-96 animate-pulse rounded-lg bg-gray-200" />
      </div>
    </div>
  )
}
