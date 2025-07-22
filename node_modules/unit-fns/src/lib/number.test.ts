import {
  clip,
  fraction,
  mapToUnit,
  fractional,
  toIndex,
  wrapInclusive,
} from './number'

describe('clip', () => {
  it('converts a number to Unit, clips numbers outside the range', () => {
    expect(clip(2)).toBe(1)
    expect(clip(-1)).toBe(0)
    expect(clip(0.5)).toBe(0.5)
  })
})

describe('fraction', () => {
  it('divides 1 by number', () => {
    expect(fraction(5)).toBe(1 / 5)
    expect(fraction(10)).toBe(1 / 10)
  })

  it('handles numbers that are less than 1', () => {
    // TODO: consider throwing error if input is less than 1
    expect(fraction(0)).toBe(Infinity)
  })
})

describe('fractional', () => {
  it('gets the fractional part of a number as a Unit', () => {
    expect(fractional(-1.5)).toBe(0.5)
    expect(fractional(-0.75)).toBe(0.75)
    expect(fractional(-1)).toBe(0)
    expect(fractional(0)).toBe(0)
    expect(fractional(0.75)).toBe(0.75)
    expect(fractional(1)).toBe(0)
    expect(fractional(1.5)).toBe(0.5)
  })
})

describe('mapToUnit', () => {
  it('map numbers in given range to Unit', () => {
    expect(mapToUnit(50, 100, 0)).toBe(-1)
    expect(mapToUnit(50, 100, 50)).toBe(0)
    expect(mapToUnit(50, 100, 75)).toBe(0.5)
    expect(mapToUnit(50, 100, 100)).toBe(1)
    expect(mapToUnit(50, 100, 200)).toBe(3)
  })
})

describe('toIndex', () => {
  it('gets an index based on length and Unit', () => {
    const testArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

    expect(toIndex(testArr.length, 0)).toBe(0)
    expect(toIndex(testArr.length, 1)).toBe(9)
    expect(toIndex(testArr.length, 0.5)).toBe(4)
  })
})

describe('wrapInclusive', () => {
  it('leaves numbers between 0-1 inclusive intact', () => {
    expect(wrapInclusive(0.5)).toBe(0.5)
    expect(wrapInclusive(0)).toBe(0)
    expect(wrapInclusive(1)).toBe(1)
  })

  it('works correctly with positive numbers', () => {
    expect(wrapInclusive(2.5)).toBe(0.5)
    expect(wrapInclusive(2)).toBe(1)
  })

  it('works correctly with negative numbers', () => {
    expect(wrapInclusive(-0.25)).toBe(0.75)
    expect(wrapInclusive(-1.25)).toBe(0.75)
    expect(wrapInclusive(-1.5)).toBe(0.5)
    expect(wrapInclusive(-1)).toBe(1)
    expect(wrapInclusive(-2)).toBe(1)
  })
})
