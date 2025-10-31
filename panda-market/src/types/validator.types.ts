import type { Request } from 'express';

export type ValidationFn = (req: Request) => void;
