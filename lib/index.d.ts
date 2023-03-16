export type PatternStyle = 'full' | 'long' | 'medium' | 'short'

export type DateTimeOptions  = Record<string, unknown>

declare type DateTimeParts = { type: string, value: string}[]

export function getDateTimeFormatPattern(locale: Intl.DateTimeFormat | string,
  dateStyle?: PatternStyle | DateTimeOptions, timeStyle?: PatternStyle): string
