const numSort = (a: number, b: number) => a - b

/**
 * Generates a Euclidean rhythm sequence.
 * @param steps The number of steps in the sequence.
 * @param notes The number of notes in the sequence.
 * @param rotation The rotation of the sequence (default: 0).
 * @returns An array of indices representing the Euclidean rhythm sequence.
 * @example
 * euclideanSequencer(8, 3, 1)
 * // Returns [1, 3, 6]
 */
export const euclideanSequencer = (steps: number, notes: number, rotation = 0): Array<number> => {
  // Check that inputs are positive integers
  if (steps < 0 || notes < 0) {
    throw new Error('Inputs must be positive integers')
  }

  // Initialize an empty sequence array
  const sequence: Array<number> = []

  // Determine the maximum number of notes in the sequence
  const maxNotes = notes > steps ? steps : notes

  // Iterate through the number of notes and calculate the index for each note
  for (let i = 0; i < maxNotes; i++) {
    const index = Math.floor((i * steps) / maxNotes) // Calculate the index using the Euclidean algorithm
    sequence.push((index + rotation) % steps) // Add the index to the sequence, with rotation applied
  }

  // Sort the sequence in ascending order
  return sequence.sort(numSort)
}
