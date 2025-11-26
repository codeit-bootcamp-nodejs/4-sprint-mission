import { jest } from '@jest/globals';

// mockDeep이 타입세이프하게 모킹해주는거라고 함
// (정확히는 해당 객체의 타입만 확인해서 프록시 객체를 생성해주는 모킹방식)

// 기존 jest.mock은 private를 추론할 수 없음
// 근데 중첩된 의존성을 거슬러 올라가도 prisma 이런 애들을 제대로 인정을 안해줌 -> 왜였더라?
// 그리고 기능별 개별 mock 방식도 불가 ( 런타임에서 의존성 없어서 오류남 )
// 반드시 객체와 의존성을 mock 정의하고 인스턴스로 생성해야함
// mockDeep, DeepMockProxy는 모킹하고자 하는 객체의 타입만 확인해서 프록시 모킹 객체를 만들어준다.
// 이 과정에서 private, readonly, constructor 같은 실제 구현에 필요한 요소들은 무시된다.

export const mockDeleteS3File = jest.fn();
export const mockDeleteCloudinaryFile = jest.fn();
export const mockCloudinaryStreamUpload = jest.fn();

jest.unstable_mockModule('@/lib/s3-client.js', () => ({
  __esModule: true,

  deleteS3File: mockDeleteS3File,

  getS3Client: jest.fn(),

  extractPublicIdFromS3Url: jest.fn((url: string) => {
    const urlObj = new URL(url);
    return decodeURIComponent(urlObj.pathname.slice(1));
  }),
}));
jest.unstable_mockModule('@/lib/cloudinary.js', () => ({
  __esModule: true,

  deleteCloudinaryFile: mockDeleteCloudinaryFile,

  extractPublicIdFromCloudinaryUrl: jest.fn((url: string) => {
    if (url.includes('test1')) return 'test_files/test1';
    if (url.includes('test2')) return 'test_files/test2';
    if (url.includes('test3')) return 'test_files/test3';
    if (url.includes('test')) return 'test_files/test';
    return 'mock_public_id';
  }),

  cloudinaryStreamUpload: mockCloudinaryStreamUpload,
}));
