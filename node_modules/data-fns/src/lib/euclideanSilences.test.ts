import { euclideanSilences } from './euclideanSilences'

describe('euclideanSilences', () => {
  test('should return indices where notes do not occur with even spacing', () => {
    expect(euclideanSilences(8, 3)).toEqual([1, 3, 4, 6, 7])
  })

  test('should return indices where notes do not occur with spacing as even as possible', () => {
    expect(euclideanSilences(16, 5)).toEqual([1, 2, 4, 5, 7, 8, 10, 11, 13, 14, 15])
  })

  test('should return indices where notes do not occur rotated by the optional rotation param', () => {
    expect(euclideanSilences(8, 3, 1)).toEqual([0, 2, 4, 5, 7])
    expect(euclideanSilences(8, 3, 3)).toEqual([1, 2, 4, 6, 7])
    expect(euclideanSilences(8, 3, 4)).toEqual([0, 2, 3, 5, 7])
  })

  test('should return an empty sequence when steps are 0', () => {
    expect(euclideanSilences(0, 0)).toEqual([])
    expect(euclideanSilences(0, 1)).toEqual([])
  })
  test('should return as many spaces as step when given no notes', () => {
    expect(euclideanSilences(1, 0)).toEqual([0])
    expect(euclideanSilences(2, 0)).toEqual([0, 1])
  })

  test('should return all indices when notes equal steps', () => {
    expect(euclideanSilences(4, 4)).toEqual([])
  })

  test('should return an error message when inputs are negative', () => {
    expect(() => euclideanSilences(-2, 3)).toThrowError('Inputs must be positive integers')
  })
})
