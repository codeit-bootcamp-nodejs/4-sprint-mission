import { cyclic } from './cyclic'

export type CellularAutomataRuleset = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
]
// a common rule that generates an interesting balance between chaos and order
const ruleset110: CellularAutomataRuleset = [0, 1, 1, 1, 1, 0, 0, 0]

export type BoundaryFunction = (index: number, length: number) => number

/**
 * Generates a new sequence using a one-dimensional cellular automaton.
 * @param sequence The initial sequence.
 * @param ruleset The ruleset for the cellular automaton.
 * @param boundaryFn The boundary function to use.
 * @returns The resulting sequence.
 * @example
 *
 * generateSequence(10, sequence, cellularAutomata)
 * // Returns [
 * //  [0, 0, 0, 0, 1, 0, 0, 0],
 * //  [0, 0, 0, 1, 1, 1, 0, 0],
 * //  [0, 0, 1, 1, 0, 0, 1, 0],
 * //  [0, 1, 1, 0, 1, 1, 1, 1],
 * //  [0, 1, 0, 0, 1, 0, 0, 0],
 * //  [1, 1, 1, 1, 1, 1, 0, 0],
 * //  [1, 0, 0, 0, 0, 0, 1, 1],
 * //  [0, 1, 0, 0, 0, 1, 1, 0],
 * //  [1, 1, 1, 0, 1, 1, 0, 1],
 * //  [0, 0, 0, 0, 1, 0, 0, 1],
 * // ]
 *
 * @complexity This function has a time complexity of O(n), where n is the length of the input sequence, and
 * a space complexity of O(n), where n is the length of the input sequence.
 */
export const cellularAutomata = (
  sequence: Array<number>,
  ruleset: CellularAutomataRuleset = ruleset110,
  boundaryFn: BoundaryFunction = cyclic
): Array<number> => {
  const nextSequence = new Array(sequence.length)
  const len = sequence.length

  // Apply the ruleset to each cell in the sequence
  for (let i = 0; i < len; i++) {
    const left = sequence[boundaryFn(i - 1, len)]
    const middle = sequence[i]
    const right = sequence[boundaryFn(i + 1, len)]
    nextSequence[i] = ruleset[left * 4 + middle * 2 + right]
  }

  return nextSequence
}
