'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProductWithRelations } from '@/types/product'
import { Locale } from '@/lib/i18n/config'
import { useCartStore } from '@/lib/store/cartStore'

interface AddToCartButtonProps {
  product: ProductWithRelations
  locale: Locale
  disabled?: boolean
}

export default function AddToCartButton({
  product,
  locale,
  disabled,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = async () => {
    setIsAdding(true)

    try {
      await addItem({
        productId: product.id,
        product: product,
        quantity: 1,
        unitPrice: product.price_cents,
      })

      // Show success and redirect to cart
      router.push(`/${locale}/winkelwagen`)
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Er is een fout opgetreden. Probeer het opnieuw.')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-gray-300"
    >
      {isAdding ? (
        <>
          <svg
            className="h-5 w-5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Toevoegen...
        </>
      ) : (
        <>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          In winkelwagen
        </>
      )}
    </button>
  )
}
