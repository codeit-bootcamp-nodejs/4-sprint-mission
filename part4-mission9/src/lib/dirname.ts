import path from 'path';
import { fileURLToPath } from 'url';

export function dirnameFromMeta(metaUrl: string) {
  if (typeof __dirname !== 'undefined') return __dirname; // CJS
  const __filename = fileURLToPath(metaUrl); // ESM
  return path.dirname(__filename);
}
