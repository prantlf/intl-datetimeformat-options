import { readFile } from 'fs/promises'
import { join } from 'path'
import { fileURLToPath } from 'url'
import availableLocales from 'cldr-core/availableLocales.json' assert { type: 'json' }

const __dirname = fileURLToPath(import.meta.url)
const nodeModulesDir  = join(__dirname, '../../node_modules')

const locales = availableLocales.availableLocales.full.sort((left, right) => {
  if (left.includes('-')) {
    return right.includes('-') ? left.localeCompare(right) : 1
  } else {
    return right.includes('-') ? -1 : left.localeCompare(right)
  }
})

async function readCldrJsonFile(pkg, locale, file) {
  const path = join(nodeModulesDir, pkg, 'main', locale, `${file}.json`)
  return JSON.parse(await readFile(path))
}

const numberingSystemsByLocale = {}
const a = new Set()

for (const locale of locales) {
  const numberData = await readCldrJsonFile('cldr-numbers-full', locale, 'numbers')
  const { defaultNumberingSystem, otherNumberingSystems } = numberData.main[locale].numbers
  numberingSystemsByLocale[locale] = [defaultNumberingSystem, otherNumberingSystems?.native]
  a.add(defaultNumberingSystem)
  if (otherNumberingSystems?.native) a.add(otherNumberingSystems?.native)
}

const zeroDigits = { latn: 48 }

for (const locale of locales) {
  const miscData = await readCldrJsonFile('cldr-misc-full', locale, 'characters')
  const { numbers } = miscData.main[locale].characters
  const asciiZeroIndex = numbers.indexOf(' 0')
  if (asciiZeroIndex < 0) {
    console.warn(`Missing zero for locale "${locale}".`)
    continue
  }
  let localZero = numbers.charCodeAt(asciiZeroIndex + 2)
  // Space means that ASCII should be used, otherwise the specific character
  if (localZero === 32) localZero = 48
  const [defaultNumberingSystem, otherNumberingSystem] = numberingSystemsByLocale[locale]
  let numberingSystem = defaultNumberingSystem
  let zeroDigit = zeroDigits[numberingSystem]
  if (zeroDigit && numberingSystem === 'latn' && localZero !== 48 && otherNumberingSystem) {
    numberingSystem = otherNumberingSystem
    zeroDigit = zeroDigits[numberingSystem]
  }
  // console.log(locale, numberingSystem, localZero, numbers)
  if (zeroDigit) {
    if (zeroDigit !== localZero && localZero !== 48) throw new Error(
      `Numbering system "${numberingSystem}" uses zeros "${zeroDigit}" and "${localZero}".`)
  } else {
    zeroDigits[numberingSystem] = localZero
  }
}

console.log(JSON.stringify(zeroDigits))
console.log(Object.keys(zeroDigits).length, 'numbering systems for',
  Object.keys(locales).length, 'locales collected', [...a])
