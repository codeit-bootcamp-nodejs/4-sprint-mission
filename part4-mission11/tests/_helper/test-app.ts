export async function createTestApp() {
  const mod = await import('../../src/app.js');
  const app = await mod.buildApp({ forTest: true });
  return app as import('express').Express;
}
