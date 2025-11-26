jest.mock('../../src/lib/token.js', () => ({
  __esModule: true,
  verifyAccessToken: jest.fn(),
}));

import { verifyAccessToken } from '../../src/lib/token.js';
import { parseUserIdFromToken } from '../../src/lib/wsAuth.js';

test('parseUserIdFromToken → null (non-string)', () => {
  expect(parseUserIdFromToken(undefined)).toBeNull();
});

test('parseUserIdFromToken → null (verify throws)', () => {
  (verifyAccessToken as jest.Mock).mockImplementation(() => {
    throw new Error('bad');
  });
  expect(parseUserIdFromToken('X')).toBeNull();
});

test('parseUserIdFromToken → number (ok)', () => {
  const fakeVerify = (_t: string) => ({ userId: 42 });
  expect(parseUserIdFromToken('good', fakeVerify)).toBe(42);
});
