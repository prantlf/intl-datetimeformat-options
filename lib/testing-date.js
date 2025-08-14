export default function getTestingDate(calendar) {
  let month
  let day
  if (calendar === 'islamic-umalqura') {
    month = 4
    day = 21
  } else if (calendar === 'persian') {
    month = 3
    day = 23
  } else {
    month = 1
    day = 3
  }
  return new Date(1, month, day, 4, 5, 6) // 1901-02-03 04:05:06
}
