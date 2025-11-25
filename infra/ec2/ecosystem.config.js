module.exports = {
  apps: [
    {
      name: 'panda-market',
      script: './dist/server.js',
      instances: 0,
      exec_mode: 'cluster',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
        HOST: '0.0.0.0',
        DATABASE_URL: 'postgresql://postgres:******@codeit-panda.cbeeyw6ucbfm.ap-northeast-2.rds.amazonaws.com:5432/postgres',
        AWS_REGION: 'ap-northeast-2',
        AWS_ACCESS_KEY_ID: '******',
        AWS_SECRET_ACCESS_KEY: '********',
        AWS_S3_BUCKET_NAME: 'codit-panda',
        JWT_SECRET= '***********',
        JWT_EXPIRES_IN: '7d',
        CORS_ORIGIN: '*',
        UPLOAD_TYPE: 's3',
        MAX_FILE_SIZE: '5242880',
        API_BASE_URL: 'http://3.34.124.122:3000',
      },
    },
  ],
};