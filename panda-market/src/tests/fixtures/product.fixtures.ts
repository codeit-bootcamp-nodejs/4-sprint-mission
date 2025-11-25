/* eslint-disable @typescript-eslint/no-unused-vars */
export const MOCK_TIME = new Date('2025-01-01T00:00:00.000Z');
export const MOCK_TIME2 = new Date('2025-01-02T00:00:00.000Z');

export const baseProductData = {
  id: 1,
  name: 'test',
  description: 'test',
  price: 1,
  likeCount: 0,
  tags: [],
  likes: [],
  user: {
    id: 1,
    email: 'test@test.com',
    nickname: 'testUser',
  },
  images: [],
  createdAt: MOCK_TIME,
};
const { likes: _likes, ...baseProductResult } = baseProductData;

export const unlikedData = {
  ...baseProductData,
};
export const unlikedResult = {
  ...baseProductResult,
  isLike: false,
};

export const likedData = {
  ...unlikedData,
  likes: [
    {
      userId: 1,
      productId: 1,
      createdAt: MOCK_TIME,
      updatedAt: MOCK_TIME,
    },
  ],
};
export const likedResult = {
  ...unlikedResult,
  isLike: true,
};

const {
  tags: _tags,
  description: _description,
  ...baseListData
} = baseProductData;
const { likes, ...baselikedListResult } = baseListData;

export const likedListData = {
  ...baseListData,
  likes: [
    {
      userId: 2,
      productId: 1,
      createdAt: MOCK_TIME,
      updatedAt: MOCK_TIME,
    },
  ],
};
export const likedListData2 = {
  ...likedListData,
  id: 2,
  name: 'test2',
  likeCount: 1,
  likes: [
    {
      userId: 1,
      productId: 2,
      createdAt: MOCK_TIME,
      updatedAt: MOCK_TIME,
    },
  ],
  user: {
    id: 2,
    email: 'test2@test.com',
    nickname: 'testUser2',
  },
};
export const unlikedListData = {
  ...baseListData,
};
export const likedListResult = {
  ...baselikedListResult,
  isLike: true,
};
export const unlikedListResult = {
  ...baselikedListResult,
  isLike: false,
};
export const unlikedListResult2 = {
  ...baselikedListResult,
  id: 2,
  name: 'test2',
  likeCount: 1,
  isLike: false,
  user: {
    id: 2,
    email: 'test2@test.com',
    nickname: 'testUser2',
  },
};

export const createParams = {
  name: 'test',
  description: 'testtesttest',
  price: 1,
  tags: ['test'],
};

export const createInput = {
  ...createParams,
  user: { connect: { id: 1 } },
  tags: {
    connectOrCreate: [
      {
        where: { name: 'test' },
        create: { name: 'test' },
      },
    ],
  },
};

export const createData = {
  ...baseProductResult,
  userId: 1,
  tags: [
    {
      id: 1,
      name: 'test',
      productCount: 1,
      createdAt: MOCK_TIME,
      updatedAt: MOCK_TIME,
    },
  ],
};

export const createResult = {
  ...createData,
  images: [
    {
      id: 1,
      publicId: 'test',
      url: 'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test.png',
    },
  ],
  likes: [],
};

export const updateData = {
  ...baseProductData,
  name: 'test1',
  description: '일반 필드 수정 테스트',
};

export const baseUpdateInput = {
  productId: 1,
  userId: 1,
  patchData: {
    name: 'test1',
    description: '일반 필드 수정 테스트',
  },
};

export const updateTagData = {
  ...baseProductData, // productGetData1,
  name: 'test1',
  description: '태그 수정 테스트1',
  tags: [
    {
      id: 1,
      name: 'test',
      createdAt: MOCK_TIME,
      updatedAt: MOCK_TIME,
      productCount: 1,
    },
    {
      id: 2,
      name: 'test2',
      createdAt: MOCK_TIME,
      updatedAt: MOCK_TIME,
      productCount: 1,
    },
  ],
};

export const updateResult = {
  ...baseProductData,
};
