export default class NotFoundError extends Error {
  status = 404;

  constructor(resource: string, id: number | string) {
    super(`${resource} with id ${id} not found`);
    this.name = 'NotFoundError';
  }
}
