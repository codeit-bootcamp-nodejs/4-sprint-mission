/**
 * Maps an item in an array at a specified index to a new value.
 * @param array The array to map the item in.
 * @param index The index of the item to map.
 * @param mapFn A function that maps the item to a new value.
 * @returns A new array with the mapped item.
 * @example
 * const originalArray = [1, 2, 3, 4, 5]
 * const mappedArray = mapAt(originalArray, 2, (item) => item * 2)
 * // Returns [1, 2, 6, 4, 5]
 */
export const mapAt = <T>(array: Array<T>, index: number, mapFn: (item: T) => T): Array<T> => {
  // Check that the index is within the bounds of the array
  if (index > array.length || index < 0) {
    throw new Error('Index out of range')
  }

  // Get the item at the specified index
  const item = array[index]

  // Map the item to a new value using the mapFn function
  const newItem = mapFn(item)

  // If the new value is the same as the original value, return the original array
  if (newItem === item) {
    return array
  }

  // Create a new array with the mapped item
  const newArray = array.slice()
  newArray[index] = mapFn(array[index])

  return newArray
}
