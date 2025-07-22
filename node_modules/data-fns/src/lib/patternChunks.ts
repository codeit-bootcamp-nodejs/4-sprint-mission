import { cyclic } from './cyclic'
import { getItem } from './getItem'

/**
 * Splits an array into chunks based on a pattern.
 * @param array The array to split.
 * @param pattern The pattern to split the array with.
 * @returns An array of arrays representing the splits.
 * @example
 * patternChunks([1, 2, 3, 4, 5, 6, 7, 8], [1, 2, 3])
 * // Returns [[1], [2, 3], [4, 5, 6], [7], [8]]
 *
 * @remarks
 * This function splits the input array into chunks based on the specified pattern. The pattern is an array of
 * numbers that determines the size of each chunk. If the pattern is shorter than the input array, it will be
 * repeated cyclically. If the pattern is longer than the input array, the remaining elements will be discarded.
 */
export const patternChunks = <T>(array: Array<T>, pattern: Array<number>): Array<Array<T>> => {
  const result: Array<Array<T>> = []
  const _array = [...array]
  let i = 0

  while (_array.length > 0) {
    result.push(_array.splice(0, getItem(i, pattern, cyclic)))
    i++
  }

  return result
}
