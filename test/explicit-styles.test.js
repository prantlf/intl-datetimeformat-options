import tehanu from 'tehanu'
import { strictEqual } from 'node:assert'
import { getDateTimeFormatPattern } from '../lib/index.js'

const test = tehanu(import.meta.url)

function normalizeWhitespace(pattern) {
  return pattern.replaceAll('\u202f', ' ')
}

function getNumericPattern(style, locale = 'en') {
  return getDateTimeFormatPattern(locale, {
    year: style, month: style, day: style, hour: style
  })
}

function getTextualPattern(style, locale = 'en') {
  return getDateTimeFormatPattern(locale, {
    era: style, year: 'numeric', month: style, weekday: style
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
