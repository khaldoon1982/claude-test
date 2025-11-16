'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Brand, Category, ProductWithRelations } from '@/types/product'
import { Locale } from '@/lib/i18n/config'
import ProductGrid from '@/components/products/ProductGrid'
import ProductFilters, { FilterState } from '@/components/products/ProductFilters'

interface ProductCatalogProps {
  locale: Locale
  brands: Brand[]
  categories: Category[]
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function ProductCatalog({
  locale,
  brands,
  categories,
  searchParams,
}: ProductCatalogProps) {
  const [products, setProducts] = useState<ProductWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('created_at_desc')

  const fetchProducts = async (filters: FilterState) => {
    setLoading(true)
    const supabase = createClient()

    let query = supabase
      .from('products')
      .select(
        `
        *,
        brand:brands(*),
        category:categories(*)
      `
      )
      .eq('is_active', true)

    // Apply filters
    if (filters.brands.length > 0) {
      query = query.in('brand_id', filters.brands)
    }

    if (filters.categories.length > 0) {
      query = query.in('category_id', filters.categories)
    }

    if (filters.conditionGrades.length > 0) {
      query = query.in('condition_grade', filters.conditionGrades)
    }

    if (filters.ramOptions.length > 0) {
      query = query.in('ram_gb', filters.ramOptions)
    }

    if (filters.storageOptions.length > 0) {
      query = query.in('storage_gb', filters.storageOptions)
    }

    if (filters.minPrice !== undefined) {
      query = query.gte('price_cents', filters.minPrice)
    }

    if (filters.maxPrice !== undefined) {
      query = query.lte('price_cents', filters.maxPrice)
    }

    // Apply sorting
    const [field, direction] = sortBy.split('_')
    const isAsc = direction === 'asc'

    if (field === 'price') {
      query = query.order('price_cents', { ascending: isAsc })
    } else if (field === 'created') {
      query = query.order('created_at', { ascending: isAsc })
    } else if (field === 'title') {
      query = query.order('title', { ascending: isAsc })
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching products:', error)
    } else {
      setProducts(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchProducts({
      brands: [],
      categories: [],
      conditionGrades: [],
      ramOptions: [],
      storageOptions: [],
    })
  }, [sortBy])

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {/* Filters Sidebar */}
      <aside className="lg:col-span-1">
        <ProductFilters
          brands={brands}
          categories={categories}
          onFilterChange={fetchProducts}
        />
      </aside>

      {/* Products Grid */}
      <div className="lg:col-span-3">
        {/* Sort Bar */}
        <div className="mb-6 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">
            {loading ? 'Laden...' : `${products.length} producten gevonden`}
          </p>

          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-gray-600">
              Sorteer op:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="created_at_desc">Nieuwste eerst</option>
              <option value="created_at_asc">Oudste eerst</option>
              <option value="price_asc">Prijs: laag naar hoog</option>
              <option value="price_desc">Prijs: hoog naar laag</option>
              <option value="title_asc">Naam: A-Z</option>
              <option value="title_desc">Naam: Z-A</option>
            </select>
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-96 animate-pulse rounded-lg bg-gray-200"
              />
            ))}
          </div>
        ) : (
          <ProductGrid products={products} locale={locale} />
        )}
      </div>
    </div>
  )
}
