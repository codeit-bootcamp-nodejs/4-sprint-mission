module.exports = {
  apps: [
    {
      name: 'm10',
      script: './build/server.js',
      exec_mode: 'fork',      
      instances: 1,          
      watch: false,          
      max_memory_restart: '300M', 
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};