import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { ProductWithRelations } from '@/types/product'

interface CartItem {
  productId: string
  product: ProductWithRelations
  quantity: number
  unitPrice: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getSubtotal: () => number
  getVATTotal: (vatRate?: number) => number
  getTotal: (vatRate?: number) => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === newItem.productId
          )

          if (existingItem) {
            // Update quantity if item already exists
            return {
              items: state.items.map((item) =>
                item.productId === newItem.productId
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item
              ),
            }
          } else {
            // Add new item
            return {
              items: [...state.items, newItem],
            }
          }
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            return {
              items: state.items.filter((item) => item.productId !== productId),
            }
          }

          return {
            items: state.items.map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            ),
          }
        }),

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.unitPrice * item.quantity,
          0
        )
      },

      getVATTotal: (vatRate = 21) => {
        const subtotal = get().getSubtotal()
        return Math.round((subtotal * vatRate) / 100)
      },

      getTotal: (vatRate = 21) => {
        const subtotal = get().getSubtotal()
        const vat = get().getVATTotal(vatRate)
        return subtotal + vat
      },
    }),
    {
      name: 'refurbx-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
