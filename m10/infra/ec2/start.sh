#!/bin/bash
# 📝 PM2 실행에 사용한 명령어 기록 (미션 제출용)

# 애플리케이션 최초 실행 시 사용
pm2 start ecosystem.config.cjs

# 실행된 프로세스를 저장해 재부팅 후에도 유지
pm2 save

# PM2를 시스템 부팅 시 자동으로 시작하도록 설정 (최초 1회)
pm2 startup systemd -u ec2-user --hp /home/ec2-user

# startup 후 실행중인 프로세스 리스트를 다시 저장
pm2 save

# 코드 변경 후 재시작 시 사용
pm2 restart m10
