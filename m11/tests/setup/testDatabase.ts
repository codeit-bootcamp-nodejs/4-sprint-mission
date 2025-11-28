import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

export const setupTestDatabase = async () => {
    try {
        // 테스트 데이터베이스에 최신 마이그레이션 실행
        console.log('Running test database migrations...');
        execSync('npx prisma migrate deploy', {
            stdio: 'inherit',
        });
        console.log('Test database ready');
    } catch (error) {
        console.error('Failed to setup test database:', error);
        throw error;
    }
};

export const cleanDatabase = async () => {
    try {
        // Delete all data in reverse order of dependencies
        await prisma.notification.deleteMany();
        await prisma.like.deleteMany();
        await prisma.comment.deleteMany();
        await prisma.productTag.deleteMany();
        await prisma.tag.deleteMany();
        await prisma.post.deleteMany();
        await prisma.product.deleteMany();
        await prisma.refreshToken.deleteMany();
        await prisma.user.deleteMany();

        console.log('Database cleaned');
    } catch (error) {
        console.error('Failed to clean database:', error);
        throw error;
    }
};

export const closeDatabase = async () => {
    await prisma.$disconnect();
};

// PostgreSQL 사용 시 파일 삭제 불필요
// cleanDatabase()로 데이터만 삭제하면 충분
export const deleteTestDatabase = () => {
    console.log('PostgreSQL 사용 중 - 데이터베이스 파일 삭제 불필요');
};

export { prisma };
