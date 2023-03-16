const partTokens = {
  era: ['G', 'GGGG'],
  month: ['MMM', 'MMMM'],
  weekday: ['E', 'EEEE']
}
const partPatterns = {}

function getPartValue(locale, date, part, style) {
  const options = { day: 'numeric', [part]: style }
  const parts = new Intl.DateTimeFormat(locale, options).formatToParts(date)
  return parts.find(({ type }) => type === part).value
}

function getPartValues(locale, date, style) {
  const values = {}
  for (const part in partTokens) {
    values[part] = getPartValue(locale, date, part, style)
  }
  return values
}

function valueToPattern(shortValues, longValues, part) {
  const shortValue = shortValues[part]
  const longValue = longValues[part]
  const [shortToken, longToken] = partTokens[part]
  return shortValue !== longValue ? {
    [shortValue]: () => shortToken,
    [longValue]: () => longToken
  } : {
    [shortValue]: style => style === 'short' || style === 'medium' ? shortToken : longToken
  }
}

function getPartPatterns(locale, date) {
  let patterns = partPatterns[locale]
  if (patterns) return patterns
  const shortValues = getPartValues(locale, date, 'short')
  const longValues = getPartValues(locale, date, 'long')
  patterns = {}
  for (const part in partTokens) {
    patterns[part] = valueToPattern(shortValues, longValues, part)
  }
  return (partPatterns[locale] = patterns)
}

export default function getPartPattern(locale, date, part, style, value) {
  const pattern = getPartPatterns(locale, date)[part][value]
  if (pattern) return pattern(style)
  const tokens = partTokens[part]
  /* c8 ignore next */
  return style === 'short' || style === 'medium' ? tokens[0] : tokens[1]
}
