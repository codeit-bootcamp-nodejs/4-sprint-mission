import express, { type ErrorRequestHandler } from 'express';
import passport from 'passport';

import { localStrategy } from '../../src/lib/passport/localStrategy.js';

type MaybeHttpError = {
  status?: unknown;
  message?: unknown;
};

export function createPassportTestApp() {
  const app = express();
  app.use(express.json());
  passport.use(localStrategy);
  app.use(passport.initialize());

  app.post(
    '/login',
    passport.authenticate('local', { session: false }),
    (req, res) => {
      res.status(200).json({ ok: true, user: req.user });
    }
  );

  // 에러 바디 노출 (디버깅용)
  const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    const e = err as MaybeHttpError;
    const status = typeof e.status === 'number' ? e.status : 500;
    const message =
      typeof e.message === 'string' ? e.message : 'Internal Server Error';
    res.status(status).json({ message });
  };
  app.use(errorHandler);

  return app;
}
