import { quantize } from './other'

describe('quantize', () => {
  it('quantizes the given unit', () => {
    expect(quantize(0.5, 0.5)).toBe(0.5)

    // TODO: this is incorrect it seems
    // expect(quantize(1, 0.5)).toBe(1)
    expect(quantize(1, 0)).toBe(0)
  })

  it('handles 0 edge case', () => {
    expect(quantize(0, 0.5)).toBe(0.5)
  })
})
