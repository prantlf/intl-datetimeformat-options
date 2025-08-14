const zeroDigits = {}

export default function getZeroDigit(numberingSystem) {
  let zeroDigit = zeroDigits[numberingSystem]
  if (zeroDigit) return zeroDigit
  const parts = new Intl.NumberFormat('en', { numberingSystem }).formatToParts(0)
  const part = parts.find(({ type }) => type === 'integer')
  zeroDigit = part.value.charCodeAt(0)
  zeroDigits[numberingSystem] = zeroDigit
  return zeroDigit
}
