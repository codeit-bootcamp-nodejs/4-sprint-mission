import { Unit, isUnit } from '../lib/core'

import { HALF_PI } from './constants'

export const clip = (value: number): Unit => {
  return Math.max(0, Math.min(1, value))
}

export const degreesToUnit = (degrees: number): Unit => {
  return wrap(degrees / 360)
}

export const fraction = (value: number): Unit => {
  return 1 / value
}

export const fractional = (value: number): Unit => {
  return Math.abs(value % 1)
}

export const mapRange = (
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  value: number
): number => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

export const mapToUnit = (
  inMin: number,
  inMax: number,
  value: number
): Unit => {
  return mapRange(inMin, inMax, 0, 1, value)
}

export const radiansToUnit = (radians: number): Unit => {
  return wrap(radians / HALF_PI)
}

export const toIndex = (length: number, unit: Unit): number => {
  return Math.floor(unit * (length - 1))
}

export const wrap = (value: number): Unit => {
  if (isUnit(value)) return value

  return value < 0 ? 1 - (-value % 1) : value % 1
}

export const wrapInclusive = (value: number): Unit => {
  if (isUnit(value)) return value

  if (value % 1 === 0) return 1

  return value < 0 ? 1 - (-value % 1) : value % 1
}
