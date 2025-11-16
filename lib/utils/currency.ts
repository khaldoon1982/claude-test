export function formatCurrency(
  amountInCents: number,
  currency: string = 'EUR',
  locale: string = 'nl-NL'
): string {
  const amount = amountInCents / 100

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function calculateVAT(
  amountInCents: number,
  vatRate: number
): number {
  return Math.round((amountInCents * vatRate) / 100)
}

export function calculatePriceWithVAT(
  amountInCents: number,
  vatRate: number
): number {
  return amountInCents + calculateVAT(amountInCents, vatRate)
}

export function calculatePriceWithoutVAT(
  amountInCentsWithVAT: number,
  vatRate: number
): number {
  return Math.round((amountInCentsWithVAT * 100) / (100 + vatRate))
}

export function formatDiscount(
  originalPrice: number,
  currentPrice: number
): string {
  const discount = Math.round(
    ((originalPrice - currentPrice) / originalPrice) * 100
  )
  return `-${discount}%`
}
