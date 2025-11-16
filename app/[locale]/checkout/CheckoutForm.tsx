'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Locale } from '@/lib/i18n/config'
import { useCartStore } from '@/lib/store/cartStore'
import { formatCurrency } from '@/lib/utils/currency'
import { Address } from '@/types/order'
import { User } from '@supabase/supabase-js'

const checkoutSchema = z.object({
  email: z.string().email('Ongeldig e-mailadres'),
  firstName: z.string().min(2, 'Minimaal 2 tekens'),
  lastName: z.string().min(2, 'Minimaal 2 tekens'),
  phone: z.string().min(10, 'Ongeldig telefoonnummer'),
  address: z.string().min(5, 'Adres is verplicht'),
  city: z.string().min(2, 'Plaats is verplicht'),
  postalCode: z.string().regex(/^\d{4}\s?[A-Z]{2}$/i, 'Ongeldige postcode'),
  country: z.string().default('NL'),
  shippingMethod: z.enum(['standard', 'express']),
  paymentMethod: z.enum(['ideal', 'creditcard']),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'Je moet akkoord gaan met de voorwaarden',
  }),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

interface CheckoutFormProps {
  locale: Locale
  user: User | null
  savedAddresses: Address[]
}

export default function CheckoutForm({
  locale,
  user,
  savedAddresses,
}: CheckoutFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { items, getSubtotal, getVATTotal, getTotal, clearCart } = useCartStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: 'NL',
      shippingMethod: 'standard',
      paymentMethod: 'ideal',
      email: user?.email || '',
    },
  })

  const shippingMethod = watch('shippingMethod')
  const subtotal = getSubtotal()
  const vat = getVATTotal(21)
  const shippingCost = shippingMethod === 'express' ? 995 : 595
  const total = subtotal + vat + shippingCost

  useEffect(() => {
    setMounted(true)
  }, [])

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      alert('Je winkelwagen is leeg')
      return
    }

    setIsSubmitting(true)

    try {
      // Create order via API
      const response = await fetch(`/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          subtotal,
          vat,
          shipping: shippingCost,
          total,
          locale,
        }),
      })

      const result = await response.json()

      if (result.error) {
        alert(result.error)
        setIsSubmitting(false)
        return
      }

      // Clear cart and redirect to payment
      if (result.paymentUrl) {
        clearCart()
        window.location.href = result.paymentUrl
      } else {
        router.push(`/${locale}/checkout/success?order=${result.orderId}`)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Er is een fout opgetreden. Probeer het opnieuw.')
      setIsSubmitting(false)
    }
  }

  if (!mounted) {
    return <div>Laden...</div>
  }

  if (items.length === 0) {
    router.push(`/${locale}/winkelwagen`)
    return null
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-3">
      {/* Left Column - Forms */}
      <div className="space-y-6 lg:col-span-2">
        {/* Contact Information */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">Contactgegevens</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">
                E-mailadres *
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="mb-1 block text-sm font-medium">
                  Voornaam *
                </label>
                <input
                  {...register('firstName')}
                  type="text"
                  id="firstName"
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="mb-1 block text-sm font-medium">
                  Achternaam *
                </label>
                <input
                  {...register('lastName')}
                  type="text"
                  id="lastName"
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium">
                Telefoonnummer *
              </label>
              <input
                {...register('phone')}
                type="tel"
                id="phone"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">Verzendadres</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="address" className="mb-1 block text-sm font-medium">
                Adres *
              </label>
              <input
                {...register('address')}
                type="text"
                id="address"
                placeholder="Straat en huisnummer"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="postalCode" className="mb-1 block text-sm font-medium">
                  Postcode *
                </label>
                <input
                  {...register('postalCode')}
                  type="text"
                  id="postalCode"
                  placeholder="1234 AB"
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="city" className="mb-1 block text-sm font-medium">
                  Plaats *
                </label>
                <input
                  {...register('city')}
                  type="text"
                  id="city"
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Method */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">Verzendmethode</h2>

          <div className="space-y-3">
            <label className="flex cursor-pointer items-center justify-between rounded border-2 border-gray-200 p-4 hover:border-primary-500">
              <div className="flex items-center gap-3">
                <input
                  {...register('shippingMethod')}
                  type="radio"
                  value="standard"
                  className="h-4 w-4 text-primary-600"
                />
                <div>
                  <p className="font-medium">Standaard verzending</p>
                  <p className="text-sm text-gray-600">3-5 werkdagen</p>
                </div>
              </div>
              <span className="font-semibold">€5,95</span>
            </label>

            <label className="flex cursor-pointer items-center justify-between rounded border-2 border-gray-200 p-4 hover:border-primary-500">
              <div className="flex items-center gap-3">
                <input
                  {...register('shippingMethod')}
                  type="radio"
                  value="express"
                  className="h-4 w-4 text-primary-600"
                />
                <div>
                  <p className="font-medium">Express verzending</p>
                  <p className="text-sm text-gray-600">1-2 werkdagen</p>
                </div>
              </div>
              <span className="font-semibold">€9,95</span>
            </label>
          </div>
        </div>

        {/* Payment Method */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">Betaalmethode</h2>

          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-3 rounded border-2 border-gray-200 p-4 hover:border-primary-500">
              <input
                {...register('paymentMethod')}
                type="radio"
                value="ideal"
                className="h-4 w-4 text-primary-600"
              />
              <span className="font-medium">iDEAL</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded border-2 border-gray-200 p-4 hover:border-primary-500">
              <input
                {...register('paymentMethod')}
                type="radio"
                value="creditcard"
                className="h-4 w-4 text-primary-600"
              />
              <span className="font-medium">Creditcard</span>
            </label>
          </div>
        </div>

        {/* Terms */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <label className="flex items-start gap-3">
            <input
              {...register('agreeToTerms')}
              type="checkbox"
              className="mt-1 h-4 w-4 rounded text-primary-600"
            />
            <span className="text-sm">
              Ik ga akkoord met de{' '}
              <a href={`/${locale}/terms`} className="text-primary-600 hover:underline">
                algemene voorwaarden
              </a>{' '}
              en het{' '}
              <a href={`/${locale}/privacy`} className="text-primary-600 hover:underline">
                privacybeleid
              </a>
            </span>
          </label>
          {errors.agreeToTerms && (
            <p className="mt-2 text-sm text-red-600">{errors.agreeToTerms.message}</p>
          )}
        </div>
      </div>

      {/* Right Column - Order Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-4 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">Besteloverzicht</h2>

          <div className="mb-4 max-h-60 space-y-3 overflow-y-auto border-b border-gray-200 pb-4">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3">
                <div className="text-sm">
                  <p className="font-medium">{item.product.title}</p>
                  <p className="text-gray-600">Aantal: {item.quantity}</p>
                </div>
                <p className="ml-auto text-sm font-semibold">
                  {formatCurrency(item.unitPrice * item.quantity, 'EUR', locale)}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-b border-gray-200 pb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotaal</span>
              <span>{formatCurrency(subtotal, 'EUR', locale)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Verzending</span>
              <span>{formatCurrency(shippingCost, 'EUR', locale)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">BTW (21%)</span>
              <span>{formatCurrency(vat, 'EUR', locale)}</span>
            </div>
          </div>

          <div className="mt-4 flex justify-between">
            <span className="text-lg font-bold">Totaal</span>
            <span className="text-2xl font-bold text-primary-600">
              {formatCurrency(total, 'EUR', locale)}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-lg bg-primary-600 py-3 font-semibold text-white hover:bg-primary-700 disabled:bg-gray-300"
          >
            {isSubmitting ? 'Verwerken...' : 'Bestelling afronden'}
          </button>
        </div>
      </div>
    </form>
  )
}
