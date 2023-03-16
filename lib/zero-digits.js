const zeroDigits = {}

export default function getZeroDigit(numberingSystem) {
  const zeroDigit = zeroDigits[numberingSystem]
  if (zeroDigit) return zeroDigit
  const parts = new Intl.NumberFormat('en', { numberingSystem }).formatToParts(0)
  const part = parts.find(({ type }) => type === 'integer')
  return (zeroDigits[numberingSystem] = part.value.charCodeAt(0))
}
