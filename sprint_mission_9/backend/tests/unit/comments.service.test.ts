import { CommentsService } from '../../src/features/comments/comments.service';
import { CommentsRepository } from '../../src/features/comments/comments.repository';
import { CreateCommentInput, UpdateCommentInput, GetCommentsQuery } from '../../src/features/comments/comments.dto';

// Mock the repository
jest.mock('../../src/features/comments/comments.repository');

describe('CommentsService', () => {
  let service: CommentsService;
  let mockRepository: jest.Mocked<CommentsRepository>;

  beforeEach(() => {
    mockRepository = new CommentsRepository(null as any) as jest.Mocked<CommentsRepository>;
    service = new CommentsService(mockRepository);
    jest.clearAllMocks();
  });

  describe('getComments', () => {
    it('should call repository.findMany with correct filter', async () => {
      const query: GetCommentsQuery = {
        page: 1,
        limit: 10,
        productId: 1,
      };

      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockRepository.findMany = jest.fn().mockResolvedValue(mockResult);

      const result = await service.getComments(query);

      expect(mockRepository.findMany).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        productId: 1,
        articleId: undefined,
      });
      expect(result).toEqual(mockResult);
    });

    it('should handle articleId filter', async () => {
      const query: GetCommentsQuery = {
        page: 2,
        limit: 20,
        articleId: 5,
      };

      const mockResult = {
        data: [],
        total: 0,
        page: 2,
        limit: 20,
        totalPages: 0,
      };

      mockRepository.findMany = jest.fn().mockResolvedValue(mockResult);

      await service.getComments(query);

      expect(mockRepository.findMany).toHaveBeenCalledWith({
        page: 2,
        limit: 20,
        productId: undefined,
        articleId: 5,
      });
    });

    it('should work without productId or articleId', async () => {
      const query: GetCommentsQuery = {
        page: 1,
        limit: 10,
      };

      mockRepository.findMany = jest.fn().mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });

      await service.getComments(query);

      expect(mockRepository.findMany).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        productId: undefined,
        articleId: undefined,
      });
    });
  });

  describe('getCommentById', () => {
    it('should return comment when found', async () => {
      const mockComment = {
        id: 1,
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

      mockRepository.findById = jest.fn().mockResolvedValue(mockComment);

      const result = await service.getCommentById(1);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockComment);
    });

    it('should throw error when comment not found', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(service.getCommentById(999)).rejects.toThrow('Comment not found');
      expect(mockRepository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('createComment', () => {
    it('should create a comment with productId', async () => {
      const input: CreateCommentInput = {
        content: 'New comment',
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

      mockRepository.create = jest.fn().mockResolvedValue(mockCreatedComment);

      const result = await service.createComment(input);

      expect(mockRepository.create).toHaveBeenCalledWith(input);
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
          nickname: 'Test User 2',
          image: null,
        },
      };

      mockRepository.create = jest.fn().mockResolvedValue(mockCreatedComment);

      const result = await service.createComment(input);

      expect(mockRepository.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockCreatedComment);
    });
  });

  describe('updateComment', () => {
    it('should update comment when user is owner', async () => {
      const commentId = 1;
      const userId = 1;
      const updateData: UpdateCommentInput = {
        content: 'Updated content',
      };

      const mockUpdatedComment = {
        id: commentId,
        content: updateData.content,
        userId,
        productId: 1,
        articleId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: userId,
          nickname: 'Test User',
          image: null,
        },
      };

      mockRepository.isOwner = jest.fn().mockResolvedValue(true);
      mockRepository.update = jest.fn().mockResolvedValue(mockUpdatedComment);

      const result = await service.updateComment(commentId, updateData, userId);

      expect(mockRepository.isOwner).toHaveBeenCalledWith(commentId, userId);
      expect(mockRepository.update).toHaveBeenCalledWith(commentId, updateData);
      expect(result).toEqual(mockUpdatedComment);
    });

    it('should throw error when user is not owner', async () => {
      const commentId = 1;
      const userId = 2; // Different user
      const updateData: UpdateCommentInput = {
        content: 'Trying to update',
      };

      mockRepository.isOwner = jest.fn().mockResolvedValue(false);

      await expect(service.updateComment(commentId, updateData, userId)).rejects.toThrow(
        '해당 댓글을 수정할 권한이 없습니다.'
      );

      expect(mockRepository.isOwner).toHaveBeenCalledWith(commentId, userId);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should check ownership before updating', async () => {
      const commentId = 5;
      const userId = 3;
      const updateData: UpdateCommentInput = {
        content: 'New content',
      };

      mockRepository.isOwner = jest.fn().mockResolvedValue(true);
      mockRepository.update = jest.fn().mockResolvedValue({} as any);

      await service.updateComment(commentId, updateData, userId);

      expect(mockRepository.isOwner).toHaveBeenCalled();
      expect(mockRepository.update).toHaveBeenCalled();
    });
  });

  describe('deleteComment', () => {
    it('should delete comment when user is owner', async () => {
      const commentId = 1;
      const userId = 1;

      mockRepository.isOwner = jest.fn().mockResolvedValue(true);
      mockRepository.delete = jest.fn().mockResolvedValue(undefined);

      await service.deleteComment(commentId, userId);

      expect(mockRepository.isOwner).toHaveBeenCalledWith(commentId, userId);
      expect(mockRepository.delete).toHaveBeenCalledWith(commentId);
    });

    it('should throw error when user is not owner', async () => {
      const commentId = 1;
      const userId = 2; // Different user

      mockRepository.isOwner = jest.fn().mockResolvedValue(false);

      await expect(service.deleteComment(commentId, userId)).rejects.toThrow(
        '해당 댓글을 삭제할 권한이 없습니다.'
      );

      expect(mockRepository.isOwner).toHaveBeenCalledWith(commentId, userId);
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should check ownership before deleting', async () => {
      const commentId = 10;
      const userId = 5;

      mockRepository.isOwner = jest.fn().mockResolvedValue(true);
      mockRepository.delete = jest.fn().mockResolvedValue(undefined);

      await service.deleteComment(commentId, userId);

      expect(mockRepository.isOwner).toHaveBeenCalled();
      expect(mockRepository.delete).toHaveBeenCalled();
    });

    it('should not return a value', async () => {
      const commentId = 1;
      const userId = 1;

      mockRepository.isOwner = jest.fn().mockResolvedValue(true);
      mockRepository.delete = jest.fn().mockResolvedValue(undefined);

      const result = await service.deleteComment(commentId, userId);

      expect(result).toBeUndefined();
    });
  });
});
