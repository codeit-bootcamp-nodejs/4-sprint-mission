import { cellularAutomata } from './cellularAutomata'
import { generateSequence } from './generateSequence'

describe('cellularAutomata', () => {
  it('returns the expected sequence for the default ruleset', () => {
    const sequence = [0, 0, 0, 0, 1, 0, 0, 0]

    expect(generateSequence(10, sequence, cellularAutomata)).toEqual([
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 1, 0, 0, 1, 0],
      [0, 1, 1, 0, 1, 1, 1, 1],
      [0, 1, 0, 0, 1, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 0, 0],
      [1, 0, 0, 0, 0, 0, 1, 1],
      [0, 1, 0, 0, 0, 1, 1, 0],
      [1, 1, 1, 0, 1, 1, 0, 1],
      [0, 0, 0, 0, 1, 0, 0, 1],
    ])
  })

  it('should return a sequence of alternating 0s and 1s when given a sequence of alternating 0s and 1s', () => {
    const sequence = [0, 1, 0, 1, 0, 1]

    expect(cellularAutomata(sequence)).toEqual([0, 1, 0, 1, 0, 1])
  })

  it('should return an empty sequence when given an empty sequence', () => {
    const sequence: Array<number> = []
    expect(cellularAutomata(sequence)).toEqual(sequence)
  })
})
