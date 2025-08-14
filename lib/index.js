import getZeroDigit from './zero-digits.js'
import getPartPattern from './part-patterns.js'
import getTestingDate from './testing-date.js'

function escapeTokens(value) {
  // return value.replace(/([\p{Alphabetic}\p{Mark}\p{Decimal_Number}\p{Connector_Punctuation}\p{Join_Control}]+)/ug, '\'$1\'')
  return value.replace(/([A-Za-z]+)/g, '\'$1\'')
}

const patternAnalyser = {
  literal(value) {
    return escapeTokens(value)
  },
  year(value) { // 1901, 01
    return value.length === 4 ? 'y' : 'yy'
  },
  month(value, { locale, style, zeroDigit, date }) { // 2, 02, Feb., February
    if (/^\p{Decimal_Number}+$/u.test(value)) {
      const firstDigit = value.charCodeAt(0)
      return firstDigit === zeroDigit ? 'MM' : 'M'
    }
    return getPartPattern(locale, date, 'month', style, value)
  },
  day(value, { zeroDigit }) { // 3, 03
    const firstDigit = value.charCodeAt(0)
    return firstDigit === zeroDigit ? 'dd' : 'd'
  },
  hour(value, { hourCycle, zeroDigit }) { // 4, 04
    const firstDigit = value.charCodeAt(0)
    switch (hourCycle) {
      case 'h23':
        return firstDigit === zeroDigit ? 'HH' : 'H'
      case 'h12':
        return firstDigit === zeroDigit ? 'hh' : 'h'
        /* c8 ignore next 4 */
      case 'h24':
        return firstDigit === zeroDigit ? 'kk' : 'k'
      default: // h11
        return firstDigit === zeroDigit ? 'KK' : 'K'
    }
  },
  minute(value, { zeroDigit }) { // 5, 05
    const firstDigit = value.charCodeAt(0)
    return firstDigit === zeroDigit ? 'mm' : 'm'
  },
  second(value, { zeroDigit }) { // 6, 06
    const firstDigit = value.charCodeAt(0)
    return firstDigit === zeroDigit ? 'ss' : 's'
  },
  dayPeriod(_value, { locale }) { // AM, PM
    return locale === 'zh-hant' ? 'B' : 'a'
  },
  era(value, { locale, style, date }) {
    return getPartPattern(locale, date, 'era', style, value)
  },
  weekday(value, { locale, style, date }) { // Sun, Sunday
    return getPartPattern(locale, date, 'weekday', style, value)
  },
  /* c8 ignore next 3 */
  timeZoneName(value) { // GMT+1, GMT+01:00
    return value.includes(':') || value.includes('.') || /\d{4}/.test(value) ? 'zzzz' : 'z'
  }
}

// Enforce lower-case and dash as a delimiter
function normalizeLocale(locale) {
  return locale.toLowerCase().replace('_', '-')
}

// Cut the first part of the locale before the first dash (language)
function getLanguage(locale) {
  const separator = locale.indexOf('-')
  return separator > 0 && locale.substring(0, separator)
}

function inferPattern(locale, options) {
  locale = normalizeLocale(locale)
  const language = getLanguage(locale)
  let formatter = new Intl.DateTimeFormat(locale, options)
  let { locale: resolvedLocale, hourCycle, numberingSystem, calendar } = formatter.resolvedOptions()

  // If language with country is not supported - the created formatter uses
  // a different (fallback) locale - try the language alone
  if (locale !== resolvedLocale.toLowerCase()) {
    if (language) {
      formatter = new Intl.DateTimeFormat(language, options);
      ({ locale: resolvedLocale, hourCycle } = formatter.resolvedOptions())
    }
    if (language !== resolvedLocale) {
      throw new Error(`Requested locale "${locale}" differs from resolved "${resolvedLocale}".`)
    }
  }

  const date = getTestingDate(calendar)
  const dateParts = formatter.formatToParts(date)
  const zeroDigit = getZeroDigit(numberingSystem) // zeroDigits[numberingSystem]
  const patternOptions = {
    locale,
    style: options.dateStyle,
    hourCycle,
    zeroDigit,
    date
  }
  let pattern = ''
  for (const { type, value } of dateParts) {
    pattern += patternAnalyser[type](value, patternOptions)
  }
  return pattern
}

const patterns = {}

export function getDateTimeFormatPattern(locale, dateStyle, timeStyle) {
  if (typeof locale !== 'string') {
    ({ locale, dateStyle, timeStyle } = locale.resolvedOptions())
  } else if (typeof dateStyle === 'string') {
    dateStyle = { dateStyle, timeStyle }
  }
  const key = `${locale}:${JSON.stringify(dateStyle)}`
  let pattern = patterns[key]
  if (!pattern) {
    pattern = patterns[key] = inferPattern(locale, dateStyle)
  }
  return pattern
}
