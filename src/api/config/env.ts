interface EnvConfig {
  REFRESH_TOKEN_SECRET: string;
  JWT_SECRET: string;
  ACCESS_TOKEN_SECRET: string;
}

const getEnvConfig = (): EnvConfig => {
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
  const JWT_SECRET = process.env.JWT_SECRET;
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

  if (!ACCESS_TOKEN_SECRET) {
    throw new Error("환경 변수 ACCESS_TOKEN_SECRET이 설정되지 않았습니다. 설정해주세요.");
  }

  if (!REFRESH_TOKEN_SECRET) {
    throw new Error("환경 변수 REFRESH_TOKEN_SECRET이 설정되지 않았습니다. 설정해주세요.");
  }

  if (!JWT_SECRET) {
    throw new Error("환경 변수 JWT_SECRET이 설정되지 않았습니다. 설정해주세요.");
  }
  return { REFRESH_TOKEN_SECRET, JWT_SECRET, ACCESS_TOKEN_SECRET };
};

export default getEnvConfig();
