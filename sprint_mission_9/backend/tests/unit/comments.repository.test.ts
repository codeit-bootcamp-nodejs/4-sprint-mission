import { CommentsRepository } from '../../src/features/comments/comments.repository';
import { PrismaClient } from '@prisma/client';
import { CreateCommentInput, UpdateCommentInput } from '../../src/features/comments/comments.dto';

// Mock PrismaClient
const mockPrismaClient = {
  comment: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
} as unknown as PrismaClient;

describe('CommentsRepository', () => {
  let repository: CommentsRepository;

  beforeEach(() => {
    repository = new CommentsRepository(mockPrismaClient);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a comment with productId', async () => {
      const input: CreateCommentInput = {
        content: 'Test comment',
        userId: 1,
        productId: 1,
      };

      const mockCreatedComment = {
        id: 1,
        ...input,
        articleId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 1,
          nickname: 'Test User',
          image: null,
        },
      };

      (mockPrismaClient.comment.create as jest.Mock).mockResolvedValue(mockCreatedComment);

      const result = await repository.create(input);

      expect(mockPrismaClient.comment.create).toHaveBeenCalledWith({
        data: input,
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
              image: true,
            },
          },
        },
      });
      expect(result).toEqual(mockCreatedComment);
    });

    it('should create a comment with articleId', async () => {
      const input: CreateCommentInput = {
        content: 'Article comment',
        userId: 2,
        articleId: 5,
      };

      const mockCreatedComment = {
        id: 2,
        ...input,
        productId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 2,
          nickname: 'User 2',
          image: 'avatar.jpg',
        },
      };

      (mockPrismaClient.comment.create as jest.Mock).mockResolvedValue(mockCreatedComment);

      const result = await repository.create(input);

      expect(mockPrismaClient.comment.create).toHaveBeenCalledWith({
        data: input,
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
              image: true,
            },
          },
        },
      });
      expect(result).toEqual(mockCreatedComment);
    });
  });

  describe('findById', () => {
    it('should find a comment by id', async () => {
      const commentId = 1;
      const mockComment = {
        id: commentId,
        content: 'Test comment',
        userId: 1,
        productId: 1,
        articleId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 1,
          nickname: 'Test User',
          image: null,
        },
      };

      (mockPrismaClient.comment.findUnique as jest.Mock).mockResolvedValue(mockComment);

      const result = await repository.findById(commentId);

      expect(mockPrismaClient.comment.findUnique).toHaveBeenCalledWith({
        where: { id: commentId },
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
              image: true,
            },
          },
        },
      });
      expect(result).toEqual(mockComment);
    });

    it('should return null when comment not found', async () => {
      (mockPrismaClient.comment.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('findMany', () => {
    it('should find comments with pagination', async () => {
      const filter = {
        page: 1,
        limit: 10,
      };

      const mockComments = [
        {
          id: 1,
          content: 'Comment 1',
          userId: 1,
          productId: 1,
          articleId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: { id: 1, nickname: 'User 1', image: null },
        },
        {
          id: 2,
          content: 'Comment 2',
          userId: 2,
          productId: 1,
          articleId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: { id: 2, nickname: 'User 2', image: null },
        },
      ];

      (mockPrismaClient.comment.findMany as jest.Mock).mockResolvedValue(mockComments);
      (mockPrismaClient.comment.count as jest.Mock).mockResolvedValue(2);

      const result = await repository.findMany(filter);

      expect(mockPrismaClient.comment.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
              image: true,
            },
          },
        },
      });
      expect(mockPrismaClient.comment.count).toHaveBeenCalledWith({ where: {} });
      expect(result).toEqual({
        data: mockComments,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should filter by productId', async () => {
      const filter = {
        page: 1,
        limit: 10,
        productId: 5,
      };

      const mockComments = [
        {
          id: 1,
          content: 'Product comment',
          userId: 1,
          productId: 5,
          articleId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: { id: 1, nickname: 'User 1', image: null },
        },
      ];

      (mockPrismaClient.comment.findMany as jest.Mock).mockResolvedValue(mockComments);
      (mockPrismaClient.comment.count as jest.Mock).mockResolvedValue(1);

      await repository.findMany(filter);

      expect(mockPrismaClient.comment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { productId: 5 },
        })
      );
      expect(mockPrismaClient.comment.count).toHaveBeenCalledWith({ where: { productId: 5 } });
    });

    it('should filter by articleId', async () => {
      const filter = {
        page: 1,
        limit: 10,
        articleId: 3,
      };

      const mockComments = [
        {
          id: 2,
          content: 'Article comment',
          userId: 2,
          productId: null,
          articleId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: { id: 2, nickname: 'User 2', image: null },
        },
      ];

      (mockPrismaClient.comment.findMany as jest.Mock).mockResolvedValue(mockComments);
      (mockPrismaClient.comment.count as jest.Mock).mockResolvedValue(1);

      await repository.findMany(filter);

      expect(mockPrismaClient.comment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { articleId: 3 },
        })
      );
    });

    it('should calculate correct pagination', async () => {
      const filter = {
        page: 3,
        limit: 20,
      };

      (mockPrismaClient.comment.findMany as jest.Mock).mockResolvedValue([]);
      (mockPrismaClient.comment.count as jest.Mock).mockResolvedValue(100);

      const result = await repository.findMany(filter);

      expect(mockPrismaClient.comment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 40, // (3-1) * 20
          take: 20,
        })
      );
      expect(result).toEqual({
        data: [],
        total: 100,
        page: 3,
        limit: 20,
        totalPages: 5, // 100 / 20
      });
    });

    it('should order by createdAt desc', async () => {
      const filter = {
        page: 1,
        limit: 10,
      };

      (mockPrismaClient.comment.findMany as jest.Mock).mockResolvedValue([]);
      (mockPrismaClient.comment.count as jest.Mock).mockResolvedValue(0);

      await repository.findMany(filter);

      expect(mockPrismaClient.comment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'desc' },
        })
      );
    });
  });

  describe('update', () => {
    it('should update a comment', async () => {
      const commentId = 1;
      const updateData: UpdateCommentInput = {
        content: 'Updated content',
      };

      const mockUpdatedComment = {
        id: commentId,
        content: 'Updated content',
        userId: 1,
        productId: 1,
        articleId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 1,
          nickname: 'Test User',
          image: null,
        },
      };

      (mockPrismaClient.comment.update as jest.Mock).mockResolvedValue(mockUpdatedComment);

      const result = await repository.update(commentId, updateData);

      expect(mockPrismaClient.comment.update).toHaveBeenCalledWith({
        where: { id: commentId },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
              image: true,
            },
          },
        },
      });
      expect(result).toEqual(mockUpdatedComment);
    });
  });

  describe('delete', () => {
    it('should delete a comment', async () => {
      const commentId = 1;
      const mockDeletedComment = {
        id: commentId,
        content: 'Deleted',
        userId: 1,
        productId: 1,
        articleId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrismaClient.comment.delete as jest.Mock).mockResolvedValue(mockDeletedComment);

      const result = await repository.delete(commentId);

      expect(mockPrismaClient.comment.delete).toHaveBeenCalledWith({
        where: { id: commentId },
      });
      expect(result).toEqual(mockDeletedComment);
    });
  });

  describe('isOwner', () => {
    it('should return true when user is owner', async () => {
      const commentId = 1;
      const userId = 1;

      (mockPrismaClient.comment.findUnique as jest.Mock).mockResolvedValue({
        userId: 1,
      });

      const result = await repository.isOwner(commentId, userId);

      expect(mockPrismaClient.comment.findUnique).toHaveBeenCalledWith({
        where: { id: commentId },
        select: { userId: true },
      });
      expect(result).toBe(true);
    });

    it('should return false when user is not owner', async () => {
      const commentId = 1;
      const userId = 2;

      (mockPrismaClient.comment.findUnique as jest.Mock).mockResolvedValue({
        userId: 1, // Different userId
      });

      const result = await repository.isOwner(commentId, userId);

      expect(result).toBe(false);
    });

    it('should return false when comment not found', async () => {
      const commentId = 999;
      const userId = 1;

      (mockPrismaClient.comment.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.isOwner(commentId, userId);

      expect(result).toBe(false);
    });
  });
});
