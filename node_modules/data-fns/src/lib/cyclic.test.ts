import { cyclic } from './cyclic'
import { getItem } from './getItem'

describe('cyclic', () => {
  it('returns the first element when index is 0', () => {
    const myArray = [1, 2, 3]
    expect(getItem(0, myArray, cyclic)).toEqual(1)
  })

  it('returns the first element when index is equal to array length', () => {
    const myArray = [1, 2, 3]
    expect(getItem(3, myArray, cyclic)).toEqual(1)
  })

  it('returns the second element when index is equal to 1', () => {
    const myArray = [1, 2, 3]
    expect(getItem(1, myArray, cyclic)).toEqual(2)
  })

  it('returns the second element when index is greater than array length', () => {
    const myArray = [1, 2, 3]
    expect(getItem(4, myArray, cyclic)).toEqual(2)
  })

  it('returns the first element when index is a multiple of array length', () => {
    const myArray = [1, 2, 3]
    expect(getItem(6, myArray, cyclic)).toEqual(1)
  })

  it('returns the correct element when array has only one element', () => {
    const myArray = [1]
    expect(getItem(0, myArray, cyclic)).toEqual(1)
    expect(getItem(1, myArray, cyclic)).toEqual(1)
  })

  it('returns the correct element when array is empty', () => {
    const myArray: Array<number> = []
    expect(getItem(0, myArray, cyclic)).toBeUndefined()
  })

  it('should map negative index to positive index', () => {
    expect(cyclic(-1, 3)).toBe(2)
    expect(cyclic(-2, 3)).toBe(1)
    expect(cyclic(-9, 3)).toBe(0)
    expect(cyclic(-4, 3)).toBe(2)
    expect(cyclic(-8, 3)).toBe(1)
    expect(cyclic(-7, 3)).toBe(2)
  })
})
