import { Unit } from './core'
import { radiansToUnit, wrapInclusive } from './number'
import { unitMax } from './core'
import { unitMin } from './core'

// TODO: the reverse
export const angle = (x: Unit, y: Unit): Unit => {
  return radiansToUnit(Math.atan(y / x))
}

export const distance = (x: Unit, y: Unit): Unit => {
  return Math.sqrt(x * x + y * y) / Math.SQRT2
}

export const maximum = Math.max as (x: Unit, y: Unit) => Unit

export const minimum = Math.min as (x: Unit, y: Unit) => Unit

export const offset = (amount: Unit, unit: Unit): Unit => {
  return wrapInclusive(amount + unit)
}

export const peak = (peak: Unit, unit: Unit): Unit => {
  return unit < peak ? unit / peak : ((unit - peak) * -1) / (1 - peak) + 1
}

// TODO: is this unit and should it be in this dir?
export const radial = (x: number, y: number) => {
  return 1 - distance(x * 2 - 1, y * 2 - 1)
}

export const repeat = (scale: Unit, t: Unit): Unit => {
  const times = 1 / scale
  return (t * times) % 1
}

export const threshold = (threshold: Unit, t: Unit): Unit => {
  return t < threshold ? unitMin : unitMax
}

export const multiply = (a: number, b: number) => {
  return a * b
}
export const screen = (a: number, b: number) => {
  return 1 - (1 - a) * (1 - b)
}
export const darken = (a: number, b: number) => {
  return Math.min(a, b)
}
export const lighten = (a: number, b: number) => {
  return Math.max(a, b)
}
export const difference = (a: number, b: number) => {
  return Math.abs(a - b)
}
export const exclusion = (a: number, b: number) => {
  return a + b - 2 * a * b
}
export const overlay = (a: number, b: number) => {
  return a < 0.5 ? 2.0 * a * b : 1.0 - 2.0 * (1.0 - a) * (1.0 - b)
}
export const hardLight = (a: number, b: number) => {
  return b < 0.5 ? 2.0 * a * b : 1.0 - 2.0 * (1.0 - a) * (1.0 - b)
}
export const softLight = (a: number, b: number) => {
  return b < 0.5
    ? 2.0 * a * b + a * a * (1.0 - 2.0 * b)
    : Math.sqrt(a) * (2.0 * b - 1.0) + 2.0 * a * (1.0 - b)
}
export const colorDodge = (a: number, b: number) => {
  return a / (1.0 - b)
}
export const linearDodge = (a: number, b: number) => {
  return a + b
}
export const burn = (a: number, b: number) => {
  return 1.0 - (1 - a) / b
}
export const linearBurn = (a: number, b: number) => {
  return a + b - 1.0
}
