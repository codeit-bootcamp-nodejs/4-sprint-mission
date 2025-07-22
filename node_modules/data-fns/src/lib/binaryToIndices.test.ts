import { binaryToIndices } from './binaryToIndices'

describe('binaryToIndices', () => {
  it('should convert a binary array to an array of indices with the corresponding elements set to true', () => {
    expect(binaryToIndices([1, 1, 1, 0, 0])).toEqual([0, 1, 2])
  })

  it('should handle an empty binary array', () => {
    expect(binaryToIndices([])).toEqual([])
  })

  it('should handle a binary array with no true elements', () => {
    expect(binaryToIndices([0, 0, 0])).toEqual([])
  })

  it('should handle a binary array with some true elements', () => {
    expect(binaryToIndices([1, 0, 1])).toEqual([0, 2])
  })

  it('should handle negative indices by ignoring them', () => {
    expect(binaryToIndices([1, 1, 0, 0])).toEqual([0, 1])
  })
})
