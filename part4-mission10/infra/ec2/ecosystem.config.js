module.exports = {
  apps: [
    {
      name: 'part4-mission10',
      script: 'dist/server.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      max_memory_restart: '300M',
    },
  ],
};
