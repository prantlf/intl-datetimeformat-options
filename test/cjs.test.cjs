const test = require('tehanu')(__filename)
const { strictEqual } = require('node:assert')
const { getDateTimeFormatPattern } = require('../lib/index.cjs')

test('exports a named function', () => {
  strictEqual(typeof getDateTimeFormatPattern, 'function')
  getDateTimeFormatPattern('cs', 'short', 'short')
})
