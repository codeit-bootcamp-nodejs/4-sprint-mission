interface EnvConfig {
  REFRESH_TOKEN_SECRET: string;
}

const getEnvConfig = (): EnvConfig => {
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
  if (!REFRESH_TOKEN_SECRET) {
    throw new Error("환경 변수 REFRESH_TOKEN_SECRET이 설정되지 않았습니다. 설정해주세요.");
  }

  return { REFRESH_TOKEN_SECRET };
};

export default getEnvConfig();
