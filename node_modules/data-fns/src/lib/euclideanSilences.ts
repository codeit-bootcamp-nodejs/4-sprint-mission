import { euclideanSequencer } from './euclideanSequencer'

/**
 * Generates a sequence of indices representing the "silences" (i.e. rests) in a Euclidean rhythm.
 * @param steps The number of steps in the rhythm.
 * @param notes The number of notes in the rhythm.
 * @param rotation The rotation of the rhythm (default: 0).
 * @returns An array of indices representing the silences in the Euclidean rhythm.
 * @example
 * euclideanSilences(8, 3)
 * // Returns [1, 3, 4, 6, 7]
 */
export const euclideanSilences = (steps: number, notes: number, rotation = 0): Array<number> => {
  // Generate the Euclidean rhythm sequence using the euclideanSequencer function
  const noteSequence = euclideanSequencer(steps, notes, rotation)

  // Initialize an empty silence sequence array
  const silenceSequence: Array<number> = []

  // Iterate through each step in the rhythm and add the index to the silence sequence if it is not in the note sequence
  for (let i = 0; i < steps; i++) {
    if (!noteSequence.includes(i)) {
      silenceSequence.push(i)
    }
  }

  // Return the silence sequence
  return silenceSequence
}
