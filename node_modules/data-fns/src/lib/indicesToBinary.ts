/**
 * Converts an array of indices to a binary array where the indices are 1 and the other digits are 0.
 * @param indices An array of indices.
 * @param length The length of the binary array to be returned.
 * @returns A binary array where the indices are 1 and the other digits are 0.
 * @example
 * // Basic usage
 * indicesToBinary([0, 2, 4], 5)
 * // Returns [1, 0, 1, 0, 1]
 *
 * // Ignoring negative indices
 * indicesToBinary([0, -1, 2, -2, 4], 5)
 * // Returns [1, 0, 1, 0, 1]
 *
 * // Indices outside range are ignored
 * indicesToBinary([0, 2, 4, 6], 5)
 * // Returns [1, 0, 1, 0, 1]
 */
export const indicesToBinary = (indices: Array<number>, length: number): Array<number> => {
  // Initialize a binary array of the given length, filled with 0s.
  const binary: Array<number> = Array(length).fill(0)

  // Loop through the indices array.
  for (const index of indices) {
    // Ignore negative indices.
    if (index >= 0) {
      // If the index is within range, set the corresponding digit to 1.
      if (index < length) {
        binary[index] = 1
      }
    }
  }

  // Return the binary array.
  return binary
}
