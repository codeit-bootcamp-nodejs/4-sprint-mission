import { indicesToBinary } from './indicesToBinary'

describe('indicesToBinary', () => {
  it('should convert an array of indices to a binary array with the indices set to 1', () => {
    expect(indicesToBinary([0, 1, 2], 5)).toEqual([1, 1, 1, 0, 0])
  })

  it('should handle an empty array of indices', () => {
    expect(indicesToBinary([], 3)).toEqual([0, 0, 0])
  })

  it('should handle a length that is less than the maximum index', () => {
    expect(indicesToBinary([0, 1, 2], 2)).toEqual([1, 1])
  })

  it('should handle a length of 0', () => {
    expect(indicesToBinary([1, 2, 3], 0)).toEqual([])
  })

  it('should handle negative indices by ignoring them', () => {
    expect(indicesToBinary([-1, 0, 1], 4)).toEqual([1, 1, 0, 0])
  })
})
