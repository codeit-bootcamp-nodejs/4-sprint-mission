export type Unit = number

export const isUnit = (value: number): value is Unit => {
  return value >= 0 && value <= 1
}

export const unitMax = 1
export const unitMin = 0
