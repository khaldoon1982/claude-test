import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { locales } from '@/lib/i18n/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://refurbx.nl'
  const supabase = await createClient()

  // Static pages
  const staticPages = [
    '',
    '/laptops',
    '/deals',
    '/brands',
    '/zakelijk',
    '/service',
    '/service/faq',
    '/service/retour',
    '/service/garantie',
    '/over-ons',
    '/contact',
  ]

  // Generate URLs for all locales
  const staticUrls: MetadataRoute.Sitemap = []
  for (const locale of locales) {
    for (const page of staticPages) {
      staticUrls.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 1 : 0.8,
      })
    }
  }

  // Fetch all active products
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('is_active', true)

  const productUrls: MetadataRoute.Sitemap = []
  if (products) {
    for (const locale of locales) {
      for (const product of products) {
        productUrls.push({
          url: `${baseUrl}/${locale}/laptops/${product.slug}`,
          lastModified: new Date(product.updated_at),
          changeFrequency: 'daily',
          priority: 0.9,
        })
      }
    }
  }

  // Fetch all active brands
  const { data: brands } = await supabase
    .from('brands')
    .select('slug, updated_at')
    .eq('is_active', true)

  const brandUrls: MetadataRoute.Sitemap = []
  if (brands) {
    for (const locale of locales) {
      for (const brand of brands) {
        brandUrls.push({
          url: `${baseUrl}/${locale}/brands/${brand.slug}`,
          lastModified: new Date(brand.updated_at),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }
    }
  }

  return [...staticUrls, ...productUrls, ...brandUrls]
}
