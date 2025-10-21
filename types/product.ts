export type ConditionGrade = 'A' | 'A-' | 'B+' | 'B' | 'C'

export interface Product {
  id: string
  sku: string
  brand_id: string | null
  category_id: string | null
  title: string
  slug: string
  description: string | null
  condition_grade: ConditionGrade
  condition_notes: string | null
  cpu: string | null
  ram_gb: number | null
  storage_gb: number | null
  storage_type: string | null
  gpu: string | null
  screen_size_inch: number | null
  screen_resolution: string | null
  screen_type: string | null
  battery_cycles: number | null
  battery_health_percent: number | null
  os: string | null
  price_cents: number
  compare_at_price_cents: number | null
  currency: string
  vat_rate: number
  stock: number
  is_active: boolean
  is_featured: boolean
  is_outlet: boolean
  images: ProductImages | null
  specs: ProductSpecs | null
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}

export interface ProductImages {
  main: string
  gallery?: string[]
}

export interface ProductSpecs {
  [key: string]: any
  ports?: string[]
  weight_kg?: number
  warranty_months?: number
}

export interface ProductI18n {
  id: string
  product_id: string
  locale: string
  title: string | null
  description: string | null
  condition_notes: string | null
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}

export interface Brand {
  id: string
  name: string
  slug: string
  logo_url: string | null
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
  description: string | null
  icon: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ProductWithRelations extends Product {
  brand?: Brand
  category?: Category
  translations?: ProductI18n[]
}

export interface ProductFilter {
  brands?: string[]
  categories?: string[]
  condition_grades?: ConditionGrade[]
  min_price_cents?: number
  max_price_cents?: number
  min_ram_gb?: number
  max_ram_gb?: number
  min_storage_gb?: number
  max_storage_gb?: number
  screen_sizes?: number[]
  is_outlet?: boolean
  is_featured?: boolean
  search?: string
}

export interface ProductSort {
  field: 'price_cents' | 'created_at' | 'title' | 'stock'
  direction: 'asc' | 'desc'
}
