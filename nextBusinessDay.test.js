const { LocalDateTime, ZonedDateTime, ZoneId } = require("@js-joda/core")
const functions = require('./nextBusinessDay')

test('Next Business Day Friday after close', () => {
    expect(functions.nextBusinessDay(2020, 11, 27, 16, 0, 1, 'US/Eastern')).toStrictEqual(ZonedDateTime.of(LocalDateTime.of(2020, 11, 30, 9, 0, 0), ZoneId.of('US/Eastern')))
    expect(functions.nextBusinessDay(2020, 11, 27, 17, 0, 1, 'Europe/London')).toStrictEqual(ZonedDateTime.of(LocalDateTime.of(2020, 11, 30, 8, 30, 0), ZoneId.of('Europe/London')))
    expect(functions.nextBusinessDay(2020, 11, 27, 16, 30, 1, 'Asia/Hong_Kong')).toStrictEqual(ZonedDateTime.of(LocalDateTime.of(2020, 11, 30, 7, 0, 0), ZoneId.of('Asia/Hong_Kong')))
});

test('Now is valid', () => {
    expect(functions.nextBusinessDay(2020, 11, 25, 14, 0, 0, 'US/Eastern')).toStrictEqual(ZonedDateTime.of(LocalDateTime.of(2020, 11, 25, 14, 0, 0), ZoneId.of('US/Eastern')))
    expect(functions.nextBusinessDay(2020, 11, 25, 14, 0, 0, 'Europe/London')).toStrictEqual(ZonedDateTime.of(LocalDateTime.of(2020, 11, 25, 14, 0, 0), ZoneId.of('Europe/London')))
    expect(functions.nextBusinessDay(2020, 11, 25, 14, 0, 0, 'Asia/Hong_Kong')).toStrictEqual(ZonedDateTime.of(LocalDateTime.of(2020, 11, 25, 14, 0, 0), ZoneId.of('Asia/Hong_Kong')))
});

test('Next Business Day Christmas holiday', () => {
    expect(functions.nextBusinessDay(2020, 12, 26, 10, 0, 0, 'Europe/London')).toStrictEqual(ZonedDateTime.of(LocalDateTime.of(2020, 12, 29, 8, 30, 0), ZoneId.of('Europe/London')))
    expect(functions.nextBusinessDay(2020, 12, 25, 10, 0, 0, 'Asia/Hong_Kong')).toStrictEqual(ZonedDateTime.of(LocalDateTime.of(2020, 12, 28, 7, 0, 0), ZoneId.of('Asia/Hong_Kong')))
    expect(functions.nextBusinessDay(2020, 12, 25, 10, 0, 0, 'US/Eastern')).toStrictEqual(ZonedDateTime.of(LocalDateTime.of(2020, 12, 28, 9, 0, 0), ZoneId.of('US/Eastern')))
});

test('Next Business Day Saturday', () => {
    expect(functions.nextBusinessDay(2020, 11, 28, 10, 0, 0, 'US/Eastern')).toStrictEqual(ZonedDateTime.of(LocalDateTime.of(2020, 11, 30, 9, 0, 0), ZoneId.of('US/Eastern')))
    expect(functions.nextBusinessDay(2020, 11, 28, 10, 0, 0, 'Asia/Hong_Kong')).toStrictEqual(ZonedDateTime.of(LocalDateTime.of(2020, 11, 30, 7, 0, 0), ZoneId.of('Asia/Hong_Kong')))
    expect(functions.nextBusinessDay(2020, 11, 28, 10, 0, 0, 'Europe/London')).toStrictEqual(ZonedDateTime.of(LocalDateTime.of(2020, 11, 30, 8, 30, 0), ZoneId.of('Europe/London')))

});

test('Next Business Day UK Lunch Break', () => {
    expect(functions.nextBusinessDay(2020, 11, 25, 12, 30, 0, 'Europe/London')).toStrictEqual(ZonedDateTime.of(LocalDateTime.of(2020, 11, 25, 13, 0, 0), ZoneId.of('Europe/London')))
});

test('Next Business Day bad timezone', () => {
    expect(functions.nextBusinessDay(2020, 11, 25, 12, 30, 0, 'I am not a timezone')).toStrictEqual({"error code" : 400, "message" : "Invalid Timezone, only `US/Eastern`, `Europe/London`, or `Asia/Hong_Kong` accepted"})
});

test('Next Business Day bad date', () => {
    expect(functions.nextBusinessDay(2020, 16, 25, 12, 30, 0, 'Europe/London')).toStrictEqual({"error code" : 400, "message" : "Bad date input"})
});


