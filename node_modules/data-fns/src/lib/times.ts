/**
 * Calls a callback function a specified number of times and returns the results in an array.
 * @param iterations The number of times to call the callback function.
 * @param callback The callback function to call.
 * @returns An array containing the results of each callback function call.
 * @example
 * times(5, (i) => i * 2)
 * // Returns [0, 2, 4, 6, 8]
 *
 */
export const times = <T>(iterations: number, callback: (index: number) => T): Array<T> => {
  // Initialize an empty array to store the results
  const result: Array<T> = []

  // Loop `iterations` number of times, calling the callback function on each iteration
  for (let i = 0; i < iterations; i++) {
    // Call the callback function with the current index and push the result to the results array
    result.push(callback(i))
  }

  // Return the results array
  return result
}
