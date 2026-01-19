#!/usr/bin/env bash
set -e

echo "🚀 Starting backend server (part4-mission10)..."

# 1. 프로젝트 디렉토리로 이동
cd /home/ec2-user/4-sprint-mission/part4-mission10

# 2. pm2로 서버 실행 (dist/server.js 기준)
pm2 start dist/server.js --name part4-mission10

# 3. pm2 상태 저장 (재부팅 후 자동 복원)
pm2 save

echo "✅ Server started with pm2 (part4-mission10)"
