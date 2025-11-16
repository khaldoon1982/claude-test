import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Locale } from '@/lib/i18n/config'
import { getTranslations } from '@/lib/i18n/utils'
import { formatCurrency } from '@/lib/utils/currency'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AddToCartButton from './AddToCartButton'
import ProductStructuredData from './ProductStructuredData'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select(
      `
      *,
      brand:brands(*),
      category:categories(*)
    `
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!product) {
    return {
      title: 'Product niet gevonden',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://refurbx.nl'
  const productUrl = `${baseUrl}/${locale}/laptops/${product.slug}`
  const imageUrl = product.images?.main
    ? `${baseUrl}${product.images.main}`
    : `${baseUrl}/images/placeholder.png`

  return {
    title: product.meta_title || `${product.title} | RefurbX`,
    description:
      product.meta_description ||
      `Koop de ${product.title} refurbished bij RefurbX. ${product.brand?.name || ''} laptop met ${product.ram_gb}GB RAM en ${product.storage_gb}GB opslag. 12 maanden garantie.`,
    openGraph: {
      title: product.title,
      description: product.description || product.title,
      url: productUrl,
      siteName: 'RefurbX',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description || product.title,
      images: [imageUrl],
    },
    alternates: {
      canonical: productUrl,
      languages: {
        nl: `${baseUrl}/nl/laptops/${product.slug}`,
        en: `${baseUrl}/en/laptops/${product.slug}`,
        ar: `${baseUrl}/ar/laptops/${product.slug}`,
      },
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { locale, slug } = await params
  const translations = await getTranslations(locale as Locale)
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select(
      `
      *,
      brand:brands(*),
      category:categories(*)
    `
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!product) {
    notFound()
  }

  const hasDiscount =
    product.compare_at_price_cents &&
    product.compare_at_price_cents > product.price_cents

  const imageUrl = product.images?.main || '/images/placeholder.png'
  const gallery = product.images?.gallery || []

  return (
    <>
      <ProductStructuredData product={product} locale={locale as Locale} />
      <Header locale={locale as Locale} translations={translations} />

      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600">
            <Link href={`/${locale}`} className="hover:text-primary-600">
              Home
            </Link>
            <span>/</span>
            <Link href={`/${locale}/laptops`} className="hover:text-primary-600">
              Laptops
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.title}</span>
          </nav>

          {/* Product Content */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Images */}
            <div>
              <div className="sticky top-4">
                {/* Main Image */}
                <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />

                  {/* Badges */}
                  <div className="absolute left-4 top-4 flex flex-col gap-2">
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
                  </div>

                  {/* Condition */}
                  <div className="absolute bottom-4 right-4">
                    <span className="rounded bg-white/90 px-3 py-1.5 text-sm font-semibold text-gray-900">
                      Grade {product.condition_grade}
                    </span>
                  </div>
                </div>

                {/* Gallery */}
                {gallery.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {gallery.map((img: string, idx: number) => (
                      <div
                        key={idx}
                        className="relative aspect-square overflow-hidden rounded bg-gray-100"
                      >
                        <Image
                          src={img}
                          alt={`${product.title} ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 25vw, 12.5vw"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Brand */}
              {product.brand && (
                <p className="mb-2 text-sm font-medium text-gray-500">
                  {product.brand.name}
                </p>
              )}

              {/* Title */}
              <h1 className="mb-4 text-4xl font-bold text-gray-900">
                {product.title}
              </h1>

              {/* Price */}
              <div className="mb-6 flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  {formatCurrency(product.price_cents, product.currency, locale)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatCurrency(
                      product.compare_at_price_cents!,
                      product.currency,
                      locale
                    )}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <p className="flex items-center gap-2 text-green-600">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">
                      Op voorraad ({product.stock} beschikbaar)
                    </span>
                  </p>
                ) : (
                  <p className="text-red-600">Momenteel niet op voorraad</p>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-6">
                  <p className="text-gray-700">{product.description}</p>
                </div>
              )}

              {/* Add to Cart */}
              <div className="mb-8">
                <AddToCartButton
                  product={product}
                  locale={locale as Locale}
                  disabled={product.stock === 0}
                />
              </div>

              {/* Key Specs */}
              <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-xl font-semibold">Specificaties</h2>
                <dl className="space-y-3">
                  {product.cpu && (
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <dt className="font-medium text-gray-600">Processor</dt>
                      <dd className="text-gray-900">{product.cpu}</dd>
                    </div>
                  )}
                  {product.ram_gb && (
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <dt className="font-medium text-gray-600">Geheugen</dt>
                      <dd className="text-gray-900">{product.ram_gb} GB RAM</dd>
                    </div>
                  )}
                  {product.storage_gb && (
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <dt className="font-medium text-gray-600">Opslag</dt>
                      <dd className="text-gray-900">
                        {product.storage_gb} GB {product.storage_type || 'SSD'}
                      </dd>
                    </div>
                  )}
                  {product.screen_size_inch && (
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <dt className="font-medium text-gray-600">Scherm</dt>
                      <dd className="text-gray-900">
                        {product.screen_size_inch}" {product.screen_resolution}
                      </dd>
                    </div>
                  )}
                  {product.os && (
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <dt className="font-medium text-gray-600">
                        Besturingssysteem
                      </dt>
                      <dd className="text-gray-900">{product.os}</dd>
                    </div>
                  )}
                  <div className="flex justify-between pt-2">
                    <dt className="font-medium text-gray-600">Staat</dt>
                    <dd className="text-gray-900">Grade {product.condition_grade}</dd>
                  </div>
                </dl>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 rounded-lg bg-gray-100 p-4">
                <div className="text-center">
                  <p className="text-2xl">✓</p>
                  <p className="text-xs text-gray-600">12 maanden garantie</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl">✓</p>
                  <p className="text-xs text-gray-600">Gratis verzending</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl">✓</p>
                  <p className="text-xs text-gray-600">14 dagen retour</p>
                </div>
              </div>
            </div>
          </div>

          {/* Extended Specs */}
          {product.specs && (
            <div className="mt-12 rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-6 text-2xl font-bold">Uitgebreide Specificaties</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-100 pb-2">
                    <dt className="font-medium text-gray-600 capitalize">
                      {key.replace(/_/g, ' ')}
                    </dt>
                    <dd className="text-gray-900">
                      {Array.isArray(value) ? value.join(', ') : String(value)}
                    </dd>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer locale={locale as Locale} translations={translations} />
    </>
  )
}
