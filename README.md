# Intl DateTime Format Patterns

[![Latest version](https://img.shields.io/npm/v/intl-datetimeformat-options)
 ![Dependency status](https://img.shields.io/librariesio/release/npm/intl-datetimeformat-options)
](https://www.npmjs.com/package/intl-datetimeformat-options)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/9f1034029c0747a980cd49f64f16338b)](https://www.codacy.com/app/prantlf/intl-datetimeformat-options?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=prantlf/intl-datetimeformat-options&amp;utm_campaign=Badge_Grade)

Provides localized date/time format patterns for styles `full`, `long`, `medium` and `short`, using [`Intl.DateTimeFormat`]. For example:

| Locale | Style | Pattern | Example |
|:-------|:------|:--------|:--------|
| en     | short | M/d/yy, h:mm a | 2/3/01, 4:05 AM |
| cs     | long  | d. MMMM y H:mm:ss z | 3. února 1901 4:05:06 GMT+1 |


```js
const formatter = new Intl.DateTimeFormat('cs', { dateStyle: 'short'})
const pattern = getDateTimeFormatPattern(formatter) // d.M.yy
```

* ES, CJS and UMD module exports.
* TypeScript type declarations (typings).
* No other dependencies.
* Tiny code base - 1.98 kB minified, 938 B gzipped, 801 B brotlied.
* Resolves four date/time-formatting pattern styles (lengths) - `full`, `long`, `medium`, `short`.

This library needs a working implementation of `Intl.DateTimeFormat`.If you are interested in a library, which does not need `Intl.DateTimeFormat` and uses [CLDR data] to be compliant with [Unicode LDML] too, have look at [datetime-locale-patterns].

## Motivation

When do you need to know the date/time format pattern? When is just formatting a date or time values to a string not enough?

1. **Date/time pickers.** You format with [`Intl.DateTimeFormat`]. [`Intl.DateTimeFormat`] or [luxon] format using a localized pattern decided by a specified locale. No need to provide the format explicitly. But what if you need to display the format pattern, which is used for the formatting? For example, in a date picker field as a value placeholder.
2. **Raw date/time formatting.** You do not format with [`Intl.DateTimeFormat`]. Libraries like [date-and-time], [date-fns] and others format using patterns provided by the developer. But how to get a localized pattern for a particular language and country?

There is no built-in API in browsers or Node.js for getting localized date/time-formatting patterns.

## Synopsis

1. **Date/time pickers.** Get a pattern to see in an abstract way how a concrete date will be formatted:

```js
import { getDateTimeFormatPattern } from 'intl-datetimeformat-options'

const date = new Date(1, 1, 3, 4, 5, 6)
const options = { dateStyle: 'short', timeStyle: 'short' }

const formatter = new Intl.DateTimeFormat('en', options)
const text = formatter.format(date)
console.log(text) // prints '2/3/01, 4:05 AM'

const pattern = getDateTimeFormatPattern('en', options)
console.log(pattern) // prints 'M/d/yy, h:mm a'
```

2. **Raw date/time formatting.** Get a pattern to format a concrete date with:

```js
import { getDateTimeFormatPattern } from 'intl-datetimeformat-options'
import formatter from 'date-and-time'

const date = new Date(1, 1, 3, 4, 5, 6)

const pattern = getDateTimeFormatPattern('en', 'short', 'short')
console.log(pattern) // prints 'M/d/yy, h:mm a'

const text = formatter.format(date, pattern)
console.log(text) // prints '2/3/01, 4:05 AM'
```

## Installation

This module can be installed in your project using [NPM], [PNPM] or [Yarn]. Make sure, that you use [Node.js] version 16.14 or newer.

```sh
$ npm i intl-datetimeformat-options
$ pnpm i intl-datetimeformat-options
$ yarn add intl-datetimeformat-options
```

Functions are exposed as named exports from ES and CJS modules, for example:

```js
import { getDateTimeFormatPattern } from 'intl-datetimeformat-options'
```

```js
const { getDateTimeFormatPattern } = require('intl-datetimeformat-options')
```

A UMD module can be loaded to the browser either directly:

```html
<script src="https://unpkg.com/intl-datetimeformat-options@1.0.0/lib/index.min.js"></script>
<script>
  const { getDateTimeFormatPattern } = window.intlDateTimeFormatOptions
</script>
```

Or using an AMD module loader:

```html
<script>
  require([
    'https://unpkg.com/intl-datetimeformat-options@1.0.0/lib/index.min.js'
  ], ({ getDateTimeFormatPattern }) => {
    ...
  })
</script>
```

## API

This library works well with [`Intl.DateTimeFormat`] by using concepts from [Unicode CLDR] (Common Locale Data Repository):

* It expects [Unicode locales] (2-letter and 3-letter languages and countries from [ISO 639] and [ISO 3166], formatted according to [extended BCP 47]), which [`Intl` locales] is based on.
* It supports [Unicode calendar formats] - `date`, `time`, `dateTime`.
* It expects [Unicode pattern styles] (lengths) - `full`, `long`, `medium`, `short`, as `dateStyle` and `timeStyle` properties of [`Intl.DateTimeFomat` options] do.
* It supplies date/time-formatting patterns using [date fields] from [Unicode LDML] (Locale Data Markup Language) as tokens.

### getDateTimeFormatPattern(locale, dateStyle?, timeStyle?)

Returns a pattern to format a date+time value for the specified locale with the specified style.

The **locale** argument can be either a locale or an instance of `Intl.DateTimeFomat`. The second argument won't be needed in the latter case.

The **dateStyle** argument can be either a string (`full`, `long`, `medium`, `short`) or an object with `dateStyle` and `timeStyle` properties from [`Intl.DateTimeFomat` options]. If it is a string, the **timeStyle** argument will be required (as a string).

```js
import { getDateTimeFormatPattern } from 'intl-datetimeformat-options'

const pattern = getDateTimeFormatPattern('en', 'short', 'short')
console.log(pattern) // prints 'M/d/yy, h:mm a'
```

## Problems

The patterns are guessed by formatting a specific date (1901-02-03 04:05:06), parsing the formatted output and detecting numeric formats, names of days and months and other tokens from [Unicode LDML]. This needs a reliable implementation of [`Intl.DateTimeFormat`].

* If the date/time formatting provided by the underlying OS API is used in the implementation of [`Intl.DateTimeFormat`], the actual pattern may differ from the multi-platform [Unicode CLDR].
* If [ICU] (International Components for Unicode) library, which is supposed to be in sync with [Unicode CLDR], is used by a browser or Node.js, the version of that [ICU] may differ from the latest version of [Unicode CLDR] and from the implementation of [`Intl.DateTimeFormat`]. This can be seen in `long` and `full` styles of the `en` locale, which include a different "glue pattern" for joining data and time patterns. [ICU] includes " at ", while [Unicode CLDR] includes ",".

Patterns returned by this library should match the behaviour of [`Intl.DateTimeFormat`] well. Patterns from [Unicode CLDR] may differ.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.  Add unit tests for any new or changed functionality. Lint and test your code using Grunt.

## License

Copyright (c) 2023 Ferdinand Prantl

Licensed under the MIT license.

[Node.js]: http://nodejs.org/
[NPM]: https://www.npmjs.com/
[PNPM]: https://pnpm.io/
[Yarn]: https://yarnpkg.com/
[date-and-time]: https://github.com/knowledgecode/date-and-time#compileformatstring
[date-fns]: https://github.com/date-fns/date-fns
[luxon]: https://moment.github.io/luxon/
[ICU]: https://icu.unicode.org/
[CLDR data]: https://www.npmjs.com/package/cldr-dates-full
[Unicode LDML]: https://unicode.org/reports/tr35/
[Unicode CLDR]: https://cldr.unicode.org/
[Unicode locales]: https://www.unicode.org/reports/tr35/#Language_and_Locale_IDs
[`Intl` locales]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locale_identification_and_negotiation
[ISO 3166]: https://en.wikipedia.org/wiki/ISO_3166
[ISO 639]: https://en.wikipedia.org/wiki/ISO_639
[extended BCP 47]: https://cldr.unicode.org/index/bcp47-extension
[`Intl.DateTimeFormat`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
[Unicode pattern styles]: https://unicode.org/reports/tr35/tr35-dates.html#24-element-dateformats
[Unicode calendar formats]: https://unicode.org/reports/tr35/tr35-dates.html#2-calendar-elements
[date fields]: http://unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
[`Intl.DateTimeFomat` options]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options
[datetime-locale-patterns]: https://github.com/prantlf/datetime-locale-patterns
