module.exports = {
  apps: [
    {
      name: "app",
      script: "dist/app.js",
      cwd: "/home/ec2-user/4-sprint-mission",
      watch: false,
      env: {
        NODE_ENV: "production",
	PORT: 3000,
      }
    }
  ]
};

