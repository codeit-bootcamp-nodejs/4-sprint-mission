import { modulo } from './modulo'

describe('modulo', () => {
  it('should return the remainder of dividing the dividend by the divisor', () => {
    expect(modulo(5, 3)).toBe(2)
    expect(modulo(-5, -3)).toBe(2)
    expect(modulo(-5, 3)).toBe(-2)
    expect(modulo(5, -3)).toBe(-2)
    expect(modulo(10, 4)).toBe(2)
    expect(modulo(-10, 4)).toBe(-2)
    expect(modulo(10, -4)).toBe(-2)
    expect(modulo(-10, -4)).toBe(2)
  })

  it('should return NaN if the divisor is 0', () => {
    expect(modulo(5, 0)).toBeNaN()
    expect(modulo(0, 0)).toBeNaN()
    expect(modulo(-5, 0)).toBeNaN()
  })

  it('should return zero if the divisor is 1', () => {
    expect(modulo(5, 1)).toBe(0)
    expect(modulo(-5, 1)).toBe(-0)
  })
})
