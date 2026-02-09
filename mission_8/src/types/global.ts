declare global {
  interface Error {
    statusCode?: number;
  }
}