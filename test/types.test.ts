import { getDateTimeFormatPattern, PatternStyle } from '../lib/index.js'

declare type testCallback = () => void
declare function test (label: string, callback: testCallback): void

test('Type declarations for TypeScript', () => {
  const patternStyle: PatternStyle = 'short'
  let _pattern: string
  _pattern = getDateTimeFormatPattern('cs', patternStyle, patternStyle)
  _pattern = getDateTimeFormatPattern('cs', { dateStyle: patternStyle, timeStyle: patternStyle })
  const formatter = new Intl.DateTimeFormat('cs')
  _pattern = getDateTimeFormatPattern(formatter)
})
