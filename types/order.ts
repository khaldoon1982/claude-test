import { Product } from './product'

export type OrderStatus =
  | 'pending'
  | 'payment_pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentProvider = 'stripe' | 'mollie' | 'ideal' | 'creditcard'

export interface Order {
  id: string
  order_number: string
  user_id: string | null
  status: OrderStatus
  subtotal_cents: number
  vat_total_cents: number
  shipping_cents: number
  discount_cents: number
  total_cents: number
  currency: string
  payment_provider: PaymentProvider | null
  payment_intent_id: string | null
  payment_status: string | null
  paid_at: string | null
  shipping_address_id: string | null
  billing_address_id: string | null
  shipping_method: string | null
  tracking_number: string | null
  shipped_at: string | null
  delivered_at: string | null
  customer_email: string | null
  customer_phone: string | null
  customer_name: string | null
  locale: string
  customer_notes: string | null
  internal_notes: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  sku: string
  product_title: string
  product_image_url: string | null
  quantity: number
  unit_price_cents: number
  vat_rate: number
  total_cents: number
  created_at: string
}

export interface OrderItemWithProduct extends OrderItem {
  product?: Product
}

export interface OrderWithItems extends Order {
  items: OrderItemWithProduct[]
}

export type AddressType = 'shipping' | 'billing' | 'both'

export interface Address {
  id: string
  user_id: string
  type: AddressType
  full_name: string
  company_name: string | null
  phone: string | null
  line1: string
  line2: string | null
  city: string
  state_province: string | null
  postal_code: string
  country: string
  is_default: boolean
  created_at: string
  updated_at: string
}
