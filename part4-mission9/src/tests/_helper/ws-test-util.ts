import type { Socket } from 'socket.io-client';

export function waitConnect(s: Socket) {
  return new Promise<void>((res, rej) => {
    const ok = () => {
      cleanup();
      res();
    };
    const er = (e: unknown) => {
      cleanup();
      rej(e);
    };
    const cleanup = () => {
      s.off('connect', ok);
      s.off('connect_error', er as (e: Error) => void);
    };
    s.once('connect', ok);
    s.once('connect_error', er as (e: Error) => void);
  });
}

export function waitDisconnect(s: Socket) {
  return new Promise<void>((res) => {
    const done = () => {
      s.off('disconnect', done);
      res();
    };
    s.once('disconnect', done);
  });
}

export async function cleanClient(s?: Socket) {
  if (!s) return;
  try {
    s.removeAllListeners();
    s.disconnect(); // alias: close()
    await waitDisconnect(s);
  } catch {
    // ignore
  }
}
