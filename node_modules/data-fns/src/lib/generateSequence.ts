/**
 * Generates a sequence of values by applying a given function to an initial value for a specified number of iterations.
 * @param iterations The number of iterations to perform.
 * @param initialValue The initial value of the sequence.
 * @param iteratorFn The function to apply to the initial value and each subsequent value.
 * @returns An array containing all the iterations.
 * @example
 * generateSequence(5, 1, (value) => value * 2)
 * // Returns [1, 2, 4, 8, 16]
 */
export const generateSequence = <T>(
  iterations: number,
  initialValue: T,
  iteratorFn: (value: T) => T
): T[] => {
  if (iterations < 0) {
    throw new Error('Iterations must be a positive number')
  }

  if (iterations === 0) {
    return []
  }

  const sequence: T[] = [initialValue]
  let value = initialValue

  for (let i = 1; i < iterations; i++) {
    value = iteratorFn(value)
    sequence.push(value)
  }

  return sequence
}
