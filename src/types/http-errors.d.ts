import "http-errors";

declare module "http-errors" {
  interface HttpError {
    details?: unknown;
  }
}
