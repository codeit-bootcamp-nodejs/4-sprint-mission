import { palindrome } from './palindrome'

describe('palindrome', () => {
  it('should return 0 for sequence with only one element', () => {
    expect(palindrome(0, 1)).toBe(0)
    expect(palindrome(1, 1)).toBe(0)
    expect(palindrome(-1, 1)).toBe(0)
  })

  it('should map positive index to palindrome pattern', () => {
    expect(palindrome(0, 3)).toBe(0)
    expect(palindrome(1, 3)).toBe(1)
    expect(palindrome(2, 3)).toBe(2)
    expect(palindrome(3, 3)).toBe(1)
    expect(palindrome(4, 3)).toBe(0)
    expect(palindrome(5, 3)).toBe(1)
    expect(palindrome(6, 3)).toBe(2)
    expect(palindrome(7, 3)).toBe(1)
    expect(palindrome(8, 3)).toBe(0)
  })

  it('should map negative index to palindrome pattern', () => {
    expect(palindrome(-0, 3)).toBe(0)
    expect(palindrome(-1, 3)).toBe(1)
    expect(palindrome(-2, 3)).toBe(2)
    expect(palindrome(-3, 3)).toBe(1)
    expect(palindrome(-4, 3)).toBe(0)
    expect(palindrome(-5, 3)).toBe(1)
    expect(palindrome(-6, 3)).toBe(2)
    expect(palindrome(-7, 3)).toBe(1)
    expect(palindrome(-8, 3)).toBe(0)
  })
})
