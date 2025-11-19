export const dbg = (...args: unknown[]) => {
  if (process.env.NODE_ENV === 'test') console.log('[DBG]', ...args);
};
export const dbe = (...args: unknown[]) => {
  if (process.env.NODE_ENV === 'test') console.error('[DBG:ERR]', ...args);
};
