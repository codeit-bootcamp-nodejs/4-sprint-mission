import { isUnit, mapToUnit, Unit } from '../..'
import { times } from 'data-fns'

const samples = 50
// TODO: use seeded random?
const randomX = times(samples, Math.random)
const randomY = times(samples, Math.random)
const randomZ = times(samples, Math.random)

// returns sampling array with linearly increasing unit param
export const getUnarySamples = (fn: (x: Unit) => Unit, samples: number) => {
  return times(samples, index => fn(mapToUnit(0, samples, index)))
}
// export const getBinarySamples = (fn: (x: Unit, y: Unit) => Unit, samples: number) => {
//   return times(samples, index => fn(mapToUnit(0, samples, index)))
// }

// to make sure that the function returns 0..1 when given 0..1 as input
export const validateUnaryUnitFn = (fn: (x: Unit) => Unit) => {
  return randomX.map(fn).every(isUnit)
}

export const validateBinaryUnitFn = (fn: (x: Unit, y: Unit) => Unit) => {
  return randomX.map((x, index) => fn(x, randomY[index])).every(isUnit)
}

export const validateTernaryUnitFn = (
  fn: (x: Unit, y: Unit, z: Unit) => Unit
) => {
  return randomX
    .map((x, index) => fn(x, randomY[index], randomZ[index]))
    .every(isUnit)
}
