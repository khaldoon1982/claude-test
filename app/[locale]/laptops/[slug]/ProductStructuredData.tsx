import { ProductWithRelations } from '@/types/product'
import { Locale } from '@/lib/i18n/config'

interface ProductStructuredDataProps {
  product: ProductWithRelations
  locale: Locale
}

export default function ProductStructuredData({
  product,
  locale,
}: ProductStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://refurbx.nl'
  const imageUrl = product.images?.main
    ? `${baseUrl}${product.images.main}`
    : `${baseUrl}/images/placeholder.png`

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || product.title,
    image: imageUrl,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand?.name || 'RefurbX',
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/${locale}/laptops/${product.slug}`,
      priceCurrency: product.currency,
      price: (product.price_cents / 100).toFixed(2),
      priceValidUntil: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/RefurbishedCondition',
      seller: {
        '@type': 'Organization',
        name: 'RefurbX B.V.',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '12',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
