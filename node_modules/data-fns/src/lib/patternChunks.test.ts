import { patternChunks } from './patternChunks'

describe('patternChunks', () => {
  it('returns empty array when given empty array', () => {
    const result = patternChunks([], [1])
    expect(result).toEqual([])
  })

  it('returns array with single chunk when pattern is longer than array', () => {
    const result = patternChunks(['a', 'b', 'c'], [4])
    expect(result).toEqual([['a', 'b', 'c']])
  })

  it('creates subarrays of correct size according to pattern', () => {
    const array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
    const pattern = [2, 3]
    const result = patternChunks(array, pattern)
    expect(result).toEqual([['a', 'b'], ['c', 'd', 'e'], ['f', 'g'], ['h', 'i', 'j']])
  })

  it('cycles pattern when pattern is shorter than array', () => {
    const array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
    const pattern = [2, 3]
    const result = patternChunks(array, pattern)
    expect(result).toEqual([['a', 'b'], ['c', 'd', 'e'], ['f', 'g'], ['h', 'i', 'j']])
  })
})