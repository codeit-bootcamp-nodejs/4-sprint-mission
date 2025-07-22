/**
 * Gets an item from an array based on a mapped index.
 * @param index The index of the item to get.
 * @param array The array to get the item from.
 * @param indexMapFn A function that maps the index to a new index.
 * @returns The item at the mapped index in the array.
 * @example
 * const array = ['a', 'b', 'c', 'd', 'e']
 * const indexMapFn = (index, length) => (index * 2) % length
 * getItem(2, array, indexMapFn)
 * // Returns 'e'
 */
export const getItem = <T>(
  index: number,
  array: Array<T>,
  indexMapFn: (index: number, length: number) => number
): T => {
  // Map the index to a new index using the indexMapFn function
  const mappedIndex = indexMapFn(index, array.length)

  // Return the item at the mapped index in the array
  return array[mappedIndex]
}
