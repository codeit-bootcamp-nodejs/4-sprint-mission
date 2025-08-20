import { ARTICLES, PRODUCTS } from './mock.js';

async function main(){
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  await prisma.article.createMany({
    data: ARTICLES,
    skipDuplicates: true,
  });
  await prisma.product.createMany({
    data: PRODUCTS,
    skipDuplicates: true,
  });
}

main()
.then(async() => {
  await prisma.$disconnect();
})
.catch(async (e) => {
  consolo.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
