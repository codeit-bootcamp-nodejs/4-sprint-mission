import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export default async function articleSeed() {
  await prisma.article.createMany({
    data: [
      {
        title: '첫 번째 게시글',
        content: '이건 첫 번째 게시글입니다.',
      },
      {
        title: '두 번째 게시글',
        content: '두 번째 내용입니다.',
      },
      {
        title: '세 번째 게시글',
        content: '세 번째 내용입니다.',
      },
      {
        title: '네 번째 게시글',
        content: '네 번째 내용입니다.',
      },
      {
        title: '다섯 번째 게시글',
        content: '다섯 번째 내용입니다.',
      },
    ],
  })
}
