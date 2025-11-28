import 'dotenv/config';

/**
 * 필요한 모든 환경 변수가 .env 파일에 정의되어 있는지 확인합니다.
 * 하나라도 누락된 경우, 에러를 발생시켜 애플리케이션 시작을 중단시킵니다.
 */
export function validateEnv() {
  const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET_KEY',
    'JWT_REFRESH_SECRET_KEY',
    'PORT',
    // 프로덕션 환경에서만 필요한 변수들
    ...(process.env.NODE_ENV === 'production'
      ? [
          'AWS_S3_BUCKET_NAME',
          'AWS_REGION',
          'AWS_ACCESS_KEY_ID',
          'AWS_SECRET_ACCESS_KEY',
        ]
      : []),
  ];

  const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

  if (missingEnvVars.length > 0) {
    throw new Error(
      `필수 환경 변수가 누락되었습니다: ${missingEnvVars.join(', ')}`,
    );
  }
}
