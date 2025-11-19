import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

export const setupTestDatabase = async () => {
    try {
        // Check if test.db exists, if not create it
        const testDbPath = path.resolve(__dirname, '../../test.db');
        if (!fs.existsSync(testDbPath)) {
            console.log('Creating test database...');
            execSync('npx prisma migrate deploy', {
                env: { ...process.env, DATABASE_URL: 'file:./test.db' },
                stdio: 'inherit',
            });
        }
        console.log('Test database ready');
    } catch (error) {
        console.error('Failed to setup test database:', error);
        throw error;
    }
};

export const cleanDatabase = async () => {
    try {
        // Delete all data in reverse order of dependencies
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

export const deleteTestDatabase = () => {
    const testDbPath = path.resolve(__dirname, '../../prisma/test.db');
    if (fs.existsSync(testDbPath)) {
        fs.unlinkSync(testDbPath);
        console.log('Test database file deleted');
    }
};

export { prisma };
