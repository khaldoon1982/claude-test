import { ProductWithRelations } from '@/types/product'
import { Locale } from '@/lib/i18n/config'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: ProductWithRelations[]
  locale: Locale
}

export default function ProductGrid({ products, locale }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-gray-600">
          Geen producten gevonden. Probeer andere filters.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  )
}
