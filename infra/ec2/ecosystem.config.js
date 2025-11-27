// module.exports = {
//   apps: [
//     {
//       name: "panda",                                      // 앱 이름
//       script: "./dist/app.js",                            // 실행할 스크립트 (상대경로)
//       exec_mode: "fork",                                  // fork 모드
//       instances: 1,                                       // 인스턴스 수
//       watch: false,                                       // 파일 변경 감시 X
//       env: {
//         NODE_ENV: "development"                           // 개발 환경
//       },
//       env_production: {
//         NODE_ENV: "production"                            // 배포 환경
//       },
//       error_file: "/home/ec2-user/.pm2/logs/panda-error.log",  // 에러 로그 경로
//       out_file: "/home/ec2-user/.pm2/logs/panda-out.log",      // 출력 로그 경로
//       pid_file: "/home/ec2-user/.pm2/pids/panda-0.pid"         // PID 파일 경로
//     }
//   ]
// };