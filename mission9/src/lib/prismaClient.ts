// src/lib/prismaClient.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma; // ✅ 기본(default) export
