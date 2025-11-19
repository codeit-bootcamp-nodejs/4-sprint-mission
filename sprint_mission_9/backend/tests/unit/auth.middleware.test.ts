import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken, optionalAuth, AuthRequest } from '../../src/shared/middlewares/auth.middleware';
import { env } from '../../src/shared/config/env';

jest.mock('jsonwebtoken');
jest.mock('../../src/shared/config/env', () => ({
  env: {
    JWT_SECRET: 'test-secret-key',
  },
}));

describe('Auth Middleware', () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticateToken', () => {
    it('should call next() with valid token', () => {
      const mockToken = 'valid-token';
      const mockDecoded = { userId: 1 };

      mockRequest.headers = {
        authorization: `Bearer ${mockToken}`,
      };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      authenticateToken(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, env.JWT_SECRET);
      expect(mockRequest.userId).toBe(1);
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return 401 when no authorization header', () => {
      mockRequest.headers = {};

      authenticateToken(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Authentication token required' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header has no token', () => {
      mockRequest.headers = {
        authorization: 'Bearer ',
      };

      authenticateToken(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Authentication token required' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header has no Bearer prefix', () => {
      mockRequest.headers = {
        authorization: 'some-token',
      };

      authenticateToken(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 with invalid token', () => {
      const mockToken = 'invalid-token';

      mockRequest.headers = {
        authorization: `Bearer ${mockToken}`,
      };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      authenticateToken(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, env.JWT_SECRET);
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 with expired token', () => {
      const mockToken = 'expired-token';

      mockRequest.headers = {
        authorization: `Bearer ${mockToken}`,
      };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        const error = new Error('jwt expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      authenticateToken(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should extract token correctly from Bearer scheme', () => {
      const mockToken = 'test-token-123';
      const mockDecoded = { userId: 5 };

      mockRequest.headers = {
        authorization: `Bearer ${mockToken}`,
      };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      authenticateToken(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, env.JWT_SECRET);
      expect(mockRequest.userId).toBe(5);
    });

    it('should set userId on request object', () => {
      const mockToken = 'valid-token';
      const mockDecoded = { userId: 42 };

      mockRequest.headers = {
        authorization: `Bearer ${mockToken}`,
      };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      authenticateToken(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockRequest.userId).toBe(42);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should use correct JWT_SECRET for verification', () => {
      const mockToken = 'token';
      const mockDecoded = { userId: 1 };

      mockRequest.headers = {
        authorization: `Bearer ${mockToken}`,
      };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      authenticateToken(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret-key');
    });
  });

  describe('optionalAuth', () => {
    it('should set userId and call next() with valid token', () => {
      const mockToken = 'valid-token';
      const mockDecoded = { userId: 1 };

      mockRequest.headers = {
        authorization: `Bearer ${mockToken}`,
      };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      optionalAuth(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, env.JWT_SECRET);
      expect(mockRequest.userId).toBe(1);
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should call next() without userId when no token provided', () => {
      mockRequest.headers = {};

      optionalAuth(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(jwt.verify).not.toHaveBeenCalled();
      expect(mockRequest.userId).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should call next() without userId when token is invalid', () => {
      const mockToken = 'invalid-token';

      mockRequest.headers = {
        authorization: `Bearer ${mockToken}`,
      };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      optionalAuth(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, env.JWT_SECRET);
      expect(mockRequest.userId).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should call next() without userId when token is expired', () => {
      const mockToken = 'expired-token';

      mockRequest.headers = {
        authorization: `Bearer ${mockToken}`,
      };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        const error = new Error('jwt expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      optionalAuth(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRequest.userId).toBeUndefined();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should extract userId from valid token', () => {
      const mockToken = 'token';
      const mockDecoded = { userId: 99 };

      mockRequest.headers = {
        authorization: `Bearer ${mockToken}`,
      };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      optionalAuth(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockRequest.userId).toBe(99);
    });

    it('should not throw error on invalid token', () => {
      const mockToken = 'bad-token';

      mockRequest.headers = {
        authorization: `Bearer ${mockToken}`,
      };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Token validation failed');
      });

      expect(() => {
        optionalAuth(mockRequest as AuthRequest, mockResponse as Response, mockNext);
      }).not.toThrow();

      expect(mockNext).toHaveBeenCalled();
    });

    it('should always call next() regardless of token validity', () => {
      // Test 1: No token
      optionalAuth(mockRequest as AuthRequest, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);

      jest.clearAllMocks();

      // Test 2: Valid token
      mockRequest.headers = { authorization: 'Bearer valid' };
      (jwt.verify as jest.Mock).mockReturnValue({ userId: 1 });
      optionalAuth(mockRequest as AuthRequest, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);

      jest.clearAllMocks();

      // Test 3: Invalid token
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid');
      });
      optionalAuth(mockRequest as AuthRequest, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });
});
