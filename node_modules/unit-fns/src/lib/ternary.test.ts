import { mix, clamp } from './ternary'

describe('clamp', () => {
  it('clips a Unit with the given lower and upper bounds', () => {
    expect(clamp(0.25, 0.75, 0)).toBe(0.25)
    expect(clamp(0.25, 0.75, 0.25)).toBe(0.25)
    expect(clamp(0.25, 0.75, 0.5)).toBe(0.5)
    expect(clamp(0.25, 0.75, 0.75)).toBe(0.75)
    expect(clamp(0.25, 0.75, 1)).toBe(0.75)
  })
})

describe('mix', () => {
  it('performs linear interpolation', () => {
    expect(mix(0.25, 0.75, 0)).toBe(0.25)
    expect(mix(0.25, 0.75, 0.25)).toBe(0.375)
    expect(mix(0.25, 0.75, 0.5)).toBe(0.5)
    expect(mix(0.25, 0.75, 0.75)).toBe(0.625)
    expect(mix(0.25, 0.75, 1)).toBe(0.75)
  })
})
