import { Product } from './product'

export interface Cart {
  id: string
  user_id: string | null
  session_id: string | null
  locale: string
  created_at: string
  updated_at: string
  expires_at: string
}

export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  quantity: number
  unit_price_cents: number
  created_at: string
  updated_at: string
}

export interface CartItemWithProduct extends CartItem {
  product: Product
}

export interface CartWithItems extends Cart {
  items: CartItemWithProduct[]
}

export interface CartSummary {
  subtotal_cents: number
  vat_total_cents: number
  shipping_cents: number
  discount_cents: number
  total_cents: number
  item_count: number
}
