export function formatCurrency(
  cents: number,
  locale = 'fr-FR',
  currency = 'EUR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(cents / 100)
}
