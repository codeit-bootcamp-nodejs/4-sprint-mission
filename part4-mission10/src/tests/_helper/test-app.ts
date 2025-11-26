export async function createTestApp() {
  const mod = await import('../../app.js');
  const app = await mod.buildApp({ forTest: true });
  return app as import('express').Express;
}
