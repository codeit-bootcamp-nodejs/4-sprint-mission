import request from 'supertest';
import app from '../../src/app.js';

export const testRequest = request(app);

export const expectError = (response: request.Response, statusCode: number, messageContains?: string) => {
    expect(response.status).toBe(statusCode);

    if (messageContains && response.body.message) {
        expect(response.body.message).toContain(messageContains);
    }
};

export const expectSuccess = (response: request.Response, statusCode: number = 200) => {
    expect(response.status).toBe(statusCode);
    expect(response.body).toHaveProperty('message');
};

export const waitFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
