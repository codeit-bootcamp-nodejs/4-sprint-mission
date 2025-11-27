# 1. Node.js 베이스 이미지 (가볍게 alpine 사용)
FROM node:20-alpine

# 2. 컨테이너 안에서 작업할 디렉토리
WORKDIR /usr/src/app

# 3. 의존성 설치를 위해 package.json만 먼저 복사
COPY package*.json ./

# 4. 의존성 설치
RUN npm install

# 5. 나머지 소스코드 복사
COPY . .

# 6. 업로드용 폴더 미리 생성 (없어도 컨테이너 실행 시 보장)
RUN mkdir -p uploads

# 7. Express 서버 포트 노출
EXPOSE 3000

# 8. 컨테이너 시작 시 실행할 명령 (package.json의 "start" 스크립트 기준)
CMD ["npm", "start"]
