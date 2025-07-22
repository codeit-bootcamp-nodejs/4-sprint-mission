/**
 * Returns the remainder of dividing the dividend by the divisor, with support for negative dividends.
 * @param dividend The dividend to divide.
 * @param divisor The divisor to divide by.
 * @returns The remainder of dividing the dividend by the divisor.
 * @example
 * // Basic usage
 * modulo(5, 3)
 * // Returns 2
 *
 * // Support for negative dividends
 * modulo(-5, -3)
 * // Returns 2
 *
 * // Support for negative divisors
 * modulo(-5, 3)
 * // Returns -2
 *
 * // Support for negative dividends and divisors
 * modulo(5, -3)
 * // Returns -2
 *
 */
export const modulo = (dividend: number, divisor: number): number => {
  // Compute the remainder of dividing the absolute value of the dividend by the absolute value of the divisor.
  const remainder = Math.abs(dividend) % Math.abs(divisor)

  // Compute the sign of the result based on the sign of the dividend and divisor.
  const sign = Math.sign(dividend) * Math.sign(divisor)

  // Compute the result by adjusting the remainder based on the sign.
  const result = remainder * sign

  // Return the result.
  return result
}
