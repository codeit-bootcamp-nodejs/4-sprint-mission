import { getItem } from "./getItem"

describe('getItem function', () => {
    it('returns the item at the provided index using the provided indexMapFn', () => {
      const myArray = ['a', 'b', 'c', 'd']
      const indexMapFn = (index: number, length: number) => (index + 1) % length
      const item = getItem(3, myArray, indexMapFn)
      expect(item).toBe('a')
    })
  
    it('returns the item at the provided index using a simple indexMapFn', () => {
      const myArray = ['a', 'b', 'c', 'd']
      const indexMapFn = (index: number) => index
      const item = getItem(2, myArray, indexMapFn)
      expect(item).toBe('c')
    })
  
    it('returns the item at the provided index using a complex indexMapFn', () => {
      const myArray = ['a', 'b', 'c', 'd']
      const indexMapFn = (index: number, length: number) => (index * 3 + 1) % length
      const item = getItem(2, myArray, indexMapFn)
      expect(item).toBe('d')
    })
  
    it('wraps around the array if the indexMapFn maps to an index that is out of bounds', () => {
      const myArray = ['a', 'b', 'c', 'd']
      const indexMapFn = (index: number, length: number) => (index + length) % length
      const item = getItem(5, myArray, indexMapFn)
      expect(item).toBe('b')
    })
  })