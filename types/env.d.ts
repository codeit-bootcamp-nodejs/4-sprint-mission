declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET: string;
    REFRESH_SECRET: string;
  }
}