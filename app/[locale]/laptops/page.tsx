import { Metadata } from 'next'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { Locale } from '@/lib/i18n/config'
import { getTranslations } from '@/lib/i18n/utils'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCatalog from './ProductCatalog'

export const metadata: Metadata = {
  title: 'Refurbished Laptops - Alle Merken',
  description:
    'Koop refurbished laptops van topkwaliteit. Dell, HP, Lenovo en meer. Gratis verzending vanaf €75. 12 maanden garantie.',
}

export default async function LaptopsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { locale } = await params
  const translations = await getTranslations(locale as Locale)
  const supabase = await createClient()

  // Fetch brands and categories for filters
  const [{ data: brands }, { data: categories }] = await Promise.all([
    supabase.from('brands').select('*').eq('is_active', true).order('name'),
    supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order'),
  ])

  return (
    <>
      <Header locale={locale as Locale} translations={translations} />

      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold text-gray-900">
              Refurbished Laptops
            </h1>
            <p className="text-lg text-gray-600">
              Ontdek onze collectie refurbished laptops met topkwaliteit en 12
              maanden garantie
            </p>
          </div>

          {/* Product Catalog */}
          <Suspense fallback={<ProductCatalogSkeleton />}>
            <ProductCatalog
              locale={locale as Locale}
              brands={brands || []}
              categories={categories || []}
              searchParams={await searchParams}
            />
          </Suspense>
        </div>
      </main>

      <Footer locale={locale as Locale} translations={translations} />
    </>
  )
}

function ProductCatalogSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <div className="h-96 animate-pulse rounded-lg bg-gray-200" />
      <div className="lg:col-span-3">
        <div className="mb-4 h-12 animate-pulse rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      </div>
    </div>
  )
}
