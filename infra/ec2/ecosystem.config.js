// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: "panda-market",
      script: "dist/main.js",
      instances: 1,
      exec_mode: "fork",
      watch: false,

      // 기본 환경 변수 설정
      env: {
        NODE_ENV: "development",
      },

      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
