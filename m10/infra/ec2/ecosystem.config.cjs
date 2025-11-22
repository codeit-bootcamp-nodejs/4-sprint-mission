module.exports = {
    apps: [
        {
            name: 'm10',
            script: './dist/server.js',
            exec_mode: 'fork', // 프리티어 1 vCPU → cluster 의미 없음
            instances: 1, // CPU 1개이므로 1개만 실행
            watch: false, // 실무에서도 false가 기본
            max_memory_restart: '300M', // 안정성 위해 추가
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        },
    ],
};
