# Sprint3 Market & Board API

## Quick Start
1. `cp .env.example .env` 후 환경변수 채우기
2. `npm ci`
3. `npm run prisma:generate`
4. `npm run prisma:migrate`
5. `npm run seed` (선택)
6. `npm run dev` 또는 `npm start`

## 주요 엔드포인트

- 상품
  - `POST /products` (name, description, price, tags[])
  - `GET /products?page=&limit=&sort=recent&q=`
  - `GET /products/:id`
  - `PATCH /products/:id`
  - `DELETE /products/:id`

- 게시글
  - `POST /articles` (title, content)
  - `GET /articles?page=&limit=&sort=recent&q=`
  - `GET /articles/:id`
  - `PATCH /articles/:id`
  - `DELETE /articles/:id`

- 댓글 (커서 기반)
  - `POST /products/:productId/comments` (content)
  - `GET /products/:productId/comments?cursor=&limit=`
  - `PATCH /products/:productId/comments/:commentId`
  - `DELETE /products/:productId/comments/:commentId`

  - `POST /articles/:articleId/comments` (content)
  - `GET /articles/:articleId/comments?cursor=&limit=`
  - `PATCH /articles/:articleId/comments/:commentId`
  - `DELETE /articles/:articleId/comments/:commentId`

- 이미지 업로드 (multer)
  - `POST /upload` (FormData: `image`) → `{ path: "/uploads/파일명" }`
