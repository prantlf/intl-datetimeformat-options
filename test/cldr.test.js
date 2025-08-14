import tehanu from 'tehanu'
import { fail, ok, strictEqual } from 'node:assert'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import availableLocales from 'cldr-core/availableLocales.json' with { type: 'json' }
import { getDateTimeFormatPattern } from '../lib/index.js'
import getTestingDate from '../lib/testing-date.js'

const test = tehanu(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))
const localeDir  = join(__dirname, '../node_modules/cldr-dates-full/main')

function normalizeWhitespace(pattern) {
  return pattern.replaceAll('\u202f', ' ').replaceAll('\'', '')
}

function readJSONFile(path) {
  return JSON.parse(readFileSync(`${path}.json`))
}

const differences = readJSONFile(join(__dirname, 'differences'))

// Locales listed by cldr-core should match directories in cldr-dates-full
for (const locale of availableLocales.availableLocales.modern) {
  const calendarData = readJSONFile(join(localeDir, locale, 'ca-gregorian'))
  const { gregorian: cldrPatterns } = calendarData.main[locale].dates.calendars

  // Test date and time formats separately using keys
  // dateFormats and timeFormats for CLDR and dateStyle and timeStyle for Intl
  for (const format of ['date', 'time']) {
    for (const style of ['full', 'long', 'medium', 'short']) {
      const testKey = `${locale}:${format}:${style}`

      test(testKey, () => {
        try {
          const declaredPattern = cldrPatterns[`${format}Formats`][style]
          const expectedPattern = normalizeWhitespace(declaredPattern)
          const patternOptions = { [`${format}Style`]: style }
          const inferredPattern = getDateTimeFormatPattern(locale, patternOptions)
          const actualPattern = normalizeWhitespace(inferredPattern)
          const formatter = new Intl.DateTimeFormat(locale, patternOptions)
          const { calendar } = formatter.resolvedOptions()
          const date = getTestingDate(calendar)
          const text = formatter.format(date)
          if (expectedPattern === actualPattern) {
            ok(true, 'matches')
          } else {
            const difference = differences[testKey]
            if (difference && expectedPattern === difference[0] &&
              actualPattern === difference[1] && text === difference[2]) {
              ok(true, 'skipped known difference')
            } else {
              if (expectedPattern !== actualPattern) {
                console.log(`"${testKey}": ["${expectedPattern}", "${actualPattern}", "${text}"]`)
                console.log(formatter.formatToParts(date))
              }
              strictEqual(expectedPattern, actualPattern, 'unexpected difference')
            }
          }
        } catch ({ message }) {
          if (locale in differences) {
            ok(true, 'skipped unsupported locale')
          } else {
            fail(message)
          }
        }
      })

    }
  }
}
