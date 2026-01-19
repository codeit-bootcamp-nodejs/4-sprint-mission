import { NotificationType as P } from '@prisma/client';
import { Server } from 'socket.io';

import {
  mapDomainToWire,
  publishToUser,
  __resetWsForTest,
  __getUserSocketsForTest,
} from '../../src/lib/ws.js';

beforeEach(() => __resetWsForTest());

test('mapDomainToWire: PRICE_CHANGE → system', () => {
  expect(mapDomainToWire(P.PRICE_CHANGE)).toBe('system');
});

test('mapDomainToWire: NEW_COMMENT → chat', () => {
  expect(mapDomainToWire(P.NEW_COMMENT)).toBe('chat');
});

test('mapDomainToWire: default fallback', () => {
  // @ts-expect-error 테스트용 가짜 값
  expect(mapDomainToWire('__UNKNOWN__')).toBe('system');
});

test('publishToUser uses provided io', () => {
  const io = new Server();
  const emitted: Array<{ event: string; payload: unknown }> = [];

  type ToReturn = ReturnType<Server['to']>;

  const fakeBroadcast = {
    emit: (event: string, payload?: unknown) => {
      emitted.push({ event, payload });
      return true;
    },
  } as unknown as ToReturn;

  const toSpy = jest.spyOn(io, 'to').mockReturnValue(fakeBroadcast);

  __getUserSocketsForTest().set(7, new Set(['sid1']));

  publishToUser(io, {
    userId: 7,
    event: 'notification',
    payload: { ok: true },
  });

  expect(toSpy).toHaveBeenCalledWith('sid1');
  expect(emitted[0]).toEqual({ event: 'notification', payload: { ok: true } });
});
