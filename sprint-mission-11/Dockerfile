# 베이스 이미지
ARG NODE_VERSION
FROM node:20-alpine

# 환경 변수 선언: express 서버를 실행할 포트
ENV SERVER_PORT=3000

# 이미지 빌드 간 현재 디렉토리 설정: 프로젝트 루트 디렉토리
WORKDIR /app

# 이미지 빌드 간 복사할 파일: 소스 코드 복사
COPY . /app/

# 이미지 빌드 시 실행할 명령어: 종속성 설치
RUN npm install
RUN mkdir -p uploads
RUN npx prisma generate

# 컨테이너 실행 시 수행할 명령어: express 서버 실행
ENTRYPOINT ["npm", "run", "start"]