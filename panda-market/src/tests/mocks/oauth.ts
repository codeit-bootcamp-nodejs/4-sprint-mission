/* eslint-disable @typescript-eslint/no-explicit-any */
import { GenerateAuthUrlOpts } from 'google-auth-library';
import { jest } from '@jest/globals';

export const mockGenerateAuthUrl = jest.fn(
  (_opts: GenerateAuthUrlOpts) => 'http://mocked-url',
);

export const mockGetToken = jest.fn<() => Promise<any>>();
export const mockVerifyIdToken = jest.fn<() => Promise<any>>();
export const mockAxiosPost = jest.fn<(config?: any) => Promise<any>>();
export const mockAxiosGet = jest.fn<(config?: any) => Promise<any>>();

jest.unstable_mockModule('@/lib/google-oauth.js', () => ({
  getGoogleClient: () => ({
    generateAuthUrl: mockGenerateAuthUrl,
    getToken: mockGetToken,
    verifyIdToken: mockVerifyIdToken,
    setCredentials: jest.fn(),
  }),
}));

jest.unstable_mockModule('axios', () => ({
  __esModule: true,
  default: jest.fn((config: any) => {
    if (config.method === 'post') {
      return mockAxiosPost(config);
    }
    if (config.method === 'get') {
      return mockAxiosGet(config);
    }
  }),
  post: mockAxiosPost,
  get: mockAxiosGet,
}));
