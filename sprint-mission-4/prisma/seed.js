// prisma/seed.ts (TypeScript 예시)
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.create({
    data: {
      name: "Alice",
      description: "Alice's Product",
      price: 10000,
      tags: ["Foo", "Bar"],
    },
  });
  await prisma.product.create({
    data: {
      name: "Bob",
      description: "Bob's Product",
      price: 10500,
      tags: ["Foo"],
    },
  });
  await prisma.product.create({
    data: {
      name: "Chile",
      description: "Chile's Product",
      price: 11000,
    },
  });
  await prisma.product.create({
    data: {
      name: "Delta",
      description: "Delta's Product",
      price: 20000.12,
    },
  });
  await prisma.product.create({
    data: {
      name: "Gamma",
      description: "",
      price: 20000.12,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
