export default class ForbiddenError extends Error {
  status = 403;

  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
  }
}
