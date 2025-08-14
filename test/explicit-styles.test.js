import tehanu from 'tehanu'
import { strictEqual, throws } from 'node:assert'
import { getDateTimeFormatPattern } from '../lib/index.js'

const test = tehanu(import.meta.url)

function normalizeWhitespace(pattern) {
  return pattern.replaceAll('\u202f', ' ')
}

function getNumericPattern(style, locale = 'en', calendar = undefined) {
  return getDateTimeFormatPattern(locale, {
    year: style, month: style, day: style, hour: style, calendar
  })
}

function getTextualPattern(style, locale = 'en', calendar = undefined) {
  return getDateTimeFormatPattern(locale, {
    era: style, year: 'numeric', month: style, weekday: style, calendar
  })
}

test('recognises 2-digit styles', () => {
  strictEqual(normalizeWhitespace(getNumericPattern('2-digit')), 'MM/dd/yy, hh a')
})

test('recognises numeric styles', () => {
  strictEqual(normalizeWhitespace(getNumericPattern('numeric')), 'M/d/y, h a')
})

test('recognises short styles', () => {
  strictEqual(getTextualPattern('short'), 'MMM y G E')
})

test('recognises long styles', () => {
  strictEqual(getTextualPattern('long'), 'MMMM y GGGG EEEE')
})

test('accepts Intl.DateTimeFormat', () => {
  const formatter = new Intl.DateTimeFormat('en', { dateStyle: 'short'})
  strictEqual(getDateTimeFormatPattern(formatter), 'M/d/y')
})

test('ignores country in the locale', () => {
  const pattern = getDateTimeFormatPattern('en-us', 'medium')
  strictEqual(pattern, 'MMM d, y')
})

test('ignores invalid country', () => {
  const pattern = getDateTimeFormatPattern('en-xx', 'long')
  strictEqual(pattern, 'MMMM d, y')
})

test('fails with invalid language', () => {
  throws(
    () => getDateTimeFormatPattern('xx', 'short'),
    {
      name: 'Error',
      message: /Requested locale "xx" differs from resolved "[^"]+"./
    }
  )
})

test('accepts strings instead of object', () => {
  strictEqual(normalizeWhitespace(getDateTimeFormatPattern(
    'en', 'short', 'short')), 'M/d/yy, h:mm a')
})

test('recognises 2-digit styles Japanese', () => {
  strictEqual(normalizeWhitespace(getNumericPattern('2-digit', 'ja')), 'yy/MM/dd HH時')
})

test('recognises numeric styles Japanese', () => {
  strictEqual(normalizeWhitespace(getNumericPattern('numeric', 'ja')), 'y/M/d H時')
})

test('recognises short styles Japanese', () => {
  strictEqual(getTextualPattern('short', 'ja'), 'GGGGy年M月 E')
})

test('recognises long styles Japanese', () => {
  strictEqual(getTextualPattern('long', 'ja'), 'GGGGy年M月 EEEE')
})

test('uses special testing date for islamic-umalqura', () => {
  strictEqual(normalizeWhitespace(getNumericPattern('2-digit', 'ar', 'islamic-umalqura')), 'dd‏/MM‏/yy GGGG، hh a')
})

test('uses special testing date for persian', () => {
  strictEqual(normalizeWhitespace(getNumericPattern('2-digit', 'fa', 'persian')), 'yy/MM/dd, HH')
})

test('supports 1-digit second', () => {
  const pattern = getDateTimeFormatPattern('en', { second: 'numeric' })
  strictEqual(normalizeWhitespace(pattern), 's')
})

test('supports 1-digit minute', () => {
  const pattern = getDateTimeFormatPattern('en', { minute: 'numeric' })
  strictEqual(normalizeWhitespace(pattern), 'm')
})

test('supports 2-digit minutes and seconds', () => {
  const pattern = getDateTimeFormatPattern('en', { minute: '2-digit', second: '2-digit' })
  strictEqual(normalizeWhitespace(pattern), 'mm:ss')
})

test('supports locale zh-hant', () => {
  const pattern = getDateTimeFormatPattern('zh-hant', { dayPeriod: 'short' })
  strictEqual(normalizeWhitespace(pattern), 'B')
})
