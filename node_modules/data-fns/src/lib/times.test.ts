import { times } from './times'

describe('times', () => {
  it('should call the given callback function the specified number of times and return an array of the results', () => {
    const result = times(5, (index) => index * 2)
    expect(result).toEqual([0, 2, 4, 6, 8])
  })

  it('should return an empty array when called with an iteration count of 0', () => {
    const result = times(0, (index) => index)
    expect(result).toEqual([])
  })

  it('should return an array of undefined values when called with a callback that returns undefined', () => {
    const result = times(5, () => undefined)
    expect(result).toEqual([undefined, undefined, undefined, undefined, undefined])
  })

  it('should call the given callback function with the correct index for each iteration', () => {
    const callback = jest.fn()
    times(3, callback)
    expect(callback).toHaveBeenCalledWith(0)
    expect(callback).toHaveBeenCalledWith(1)
    expect(callback).toHaveBeenCalledWith(2)
  })
})