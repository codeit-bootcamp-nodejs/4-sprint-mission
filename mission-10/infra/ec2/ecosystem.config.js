module.exports = {
  apps: [{
    name: 'panda-market',
    script: './dist/app.js',
    instances: 1,
    exec_mode: 'fork'
  }]
};