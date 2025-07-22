import { mapAt } from './mapAt'

describe('mapAt', () => {
  test('should return a new array with the modified item', () => {
    const myArray = [1, 2, 3, 4, 5]
    const index = 2
    const mapFn = (item: number) => item * 2
    const modifiedArray = mapAt(myArray, index, mapFn)
    expect(modifiedArray).toEqual([1, 2, 6, 4, 5])
  })

  test('should not modify the original array', () => {
    const myArray = [1, 2, 3, 4, 5]
    const index = 2
    const mapFn = (item: number) => item * 2
    const modifiedArray = mapAt(myArray, index, mapFn)
    expect(myArray).toEqual([1, 2, 3, 4, 5])
    expect(modifiedArray).not.toBe(myArray)
  })

  test('should throw an error if the index is out of range', () => {
    const myArray = [1, 2, 3, 4, 5]
    const index = 10
    const mapFn = (item: number) => item * 2
    expect(() => mapAt(myArray, index, mapFn)).toThrowError(
      'Index out of range'
    )
  })
    
  test('should return the original array if mapFn returns the same value', () => {
    const myArray = [1, 2, 3, 4, 5]
    const index = 2
    const mapFn = (item: number) => item
    const modifiedArray = mapAt(myArray, index, mapFn)
    expect(modifiedArray).toBe(myArray)
  })

    
})
