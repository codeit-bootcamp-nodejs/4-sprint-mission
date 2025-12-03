module.exports = {
  apps: [
    {
      name: 'panda-market',
      cwd: '/home/ec2-user/panda-market/panda-market',
      script: './dist/server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
