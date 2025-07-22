import { euclideanSequencer } from './euclideanSequencer'

describe('euclideanSequencer', () => {
  test('should return a sequence with notes spaced evenly', () => {
    expect(euclideanSequencer(8, 3)).toEqual([0, 2, 5])
  })

  test('should return a sequence with notes spaced as evenly as possible', () => {
    expect(euclideanSequencer(16, 5)).toEqual([0, 3, 6, 9, 12])
  })

  test('should return a sequence rotated by the optional rotation param', () => {
    expect(euclideanSequencer(8, 3, 1)).toEqual([1, 3, 6])
    expect(euclideanSequencer(8, 3, 3)).toEqual([0, 3, 5])
    expect(euclideanSequencer(8, 3, 4)).toEqual([1, 4, 6])
  })

  test('should return an empty sequence when steps or notes are 0', () => {
    expect(euclideanSequencer(0, 0)).toEqual([])
    expect(euclideanSequencer(0, 1)).toEqual([])
    expect(euclideanSequencer(1, 0)).toEqual([])
  })

  test('should return a sequence with all notes when notes equal steps', () => {
    expect(euclideanSequencer(4, 4)).toEqual([0, 1, 2, 3])
  })

  test('should return a sequence with all notes when notes is greater than steps', () => {
    expect(euclideanSequencer(3, 4)).toEqual([0, 1, 2])
  })

  test('should return an error message when inputs are negative', () => {
    expect(() => euclideanSequencer(-2, 3)).toThrowError('Inputs must be positive integers')
  })
})
