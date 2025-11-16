import Link from 'next/link'
import Image from 'next/image'
import { ProductWithRelations } from '@/types/product'
import { formatCurrency, formatDiscount } from '@/lib/utils/currency'
import { Locale } from '@/lib/i18n/config'

interface ProductCardProps {
  product: ProductWithRelations
  locale: Locale
}

export default function ProductCard({ product, locale }: ProductCardProps) {
  const hasDiscount = product.compare_at_price_cents &&
    product.compare_at_price_cents > product.price_cents

  const imageUrl = product.images?.main || '/images/placeholder.png'

  return (
    <Link
      href={`/${locale}/laptops/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-2">
          {product.is_featured && (
            <span className="rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
              Featured
            </span>
          )}
          {product.is_outlet && (
            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
              Outlet
            </span>
          )}
          {hasDiscount && (
            <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
              {formatDiscount(product.compare_at_price_cents!, product.price_cents)}
            </span>
          )}
        </div>

        {/* Condition Grade Badge */}
        <div className="absolute bottom-2 right-2">
          <span className="rounded bg-white/90 px-2 py-1 text-xs font-semibold text-gray-900">
            Grade {product.condition_grade}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="mb-1 text-xs font-medium text-gray-500">
            {product.brand.name}
          </p>
        )}

        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-2">
          {product.title}
        </h3>

        {/* Specs */}
        <div className="mb-3 flex flex-wrap gap-2 text-xs text-gray-600">
          {product.cpu && (
            <span className="rounded bg-gray-100 px-2 py-1">
              {product.cpu.split(' ').slice(-2).join(' ')}
            </span>
          )}
          {product.ram_gb && (
            <span className="rounded bg-gray-100 px-2 py-1">
              {product.ram_gb}GB RAM
            </span>
          )}
          {product.storage_gb && (
            <span className="rounded bg-gray-100 px-2 py-1">
              {product.storage_gb}GB {product.storage_type || 'SSD'}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(product.price_cents, product.currency, locale)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              {formatCurrency(product.compare_at_price_cents!, product.currency, locale)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="mt-2">
          {product.stock > 0 ? (
            <p className="text-xs text-green-600">
              ✓ {product.stock} op voorraad
            </p>
          ) : (
            <p className="text-xs text-red-600">Niet op voorraad</p>
          )}
        </div>
      </div>
    </Link>
  )
}
