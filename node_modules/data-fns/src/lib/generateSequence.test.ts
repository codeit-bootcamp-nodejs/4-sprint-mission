import { generateSequence } from './generateSequence'

describe('generateSequence', () => {
  it('should generate a sequence of values by applying a function for a specified number of iterations', () => {
    const result = generateSequence(5, 1, (value) => value * 2)
    expect(result).toEqual([1, 2, 4, 8, 16])
  })

  it('should handle an iteration count of 0', () => {
    const result = generateSequence(0, 1, (value) => value * 2)
    expect(result).toEqual([])
  })

  it('should handle an iteration count of 1', () => {
    const result = generateSequence(1, 1, (value) => value * 2)
    expect(result).toEqual([1])
  })

  it('should throw an error if the number of iterations is negative', () => {
    expect(() => generateSequence(-1, 1, (value) => value * 2)).toThrow(
      'Iterations must be a positive number'
    )
  })
})
