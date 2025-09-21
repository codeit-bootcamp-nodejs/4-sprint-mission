import Express from 'express';

declare global {
    namespace Express {
        interface Request {
            user: {
                userId: number;
            },
            query: {
                offset?: string;
                limit?: string;
                order?: 'asc' | 'desc';
                search?: string;
            }
        }
    }
}