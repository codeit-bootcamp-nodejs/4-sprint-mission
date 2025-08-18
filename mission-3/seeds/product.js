import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function productSeed() {
  await prisma.product.createMany({
    data: [
      {
        name: '게이밍 마우스',
        description: '초정밀 센서 탑재, 인체공학적 설계',
        price: 45000,
        tags: ['gaming', 'mouse', 'sensor'],
      },
      {
        name: '기계식 키보드',
        description: '청축, RGB 백라이트 포함',
        price: 89000,
        tags: ['keyboard', 'mechanical', 'RGB'],
      },
      {
        name: '27인치 4K 모니터',
        description: 'IPS 패널, 높은 색 재현율',
        price: 320000,
        tags: ['monitor', '4K', 'IPS'],
      },
      {
        name: '무선 헤드셋',
        description: '노이즈 캔슬링, 블루투스 지원',
        price: 110000,
        tags: ['headset', 'wireless', 'bluetooth'],
      },
      {
        name: '게이밍 체어',
        description: '허리 지지, 각도 조절 가능',
        price: 159000,
        tags: ['chair', 'gaming', 'ergonomic'],
      },
    ],
  });
}
