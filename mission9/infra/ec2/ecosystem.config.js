module.exports = {
  apps: [
    {
      name: 'node-mission-10',
      script: './build/main.js',
      exec_mode: 'fork', 
      instances: 1, 
      watch: false, 
      max_memory_restart: '300M', 
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
