import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../src/shared/middlewares/error.middleware';

describe('Error Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('errorHandler', () => {
    it('should return 400 for SyntaxError', () => {
      const syntaxError = new SyntaxError('Unexpected token');

      errorHandler(
        syntaxError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid JSON format' });
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', syntaxError);
    });

    it('should return 500 for generic Error with message', () => {
      const error = new Error('Something went wrong');

      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Something went wrong' });
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', error);
    });

    it('should return 500 with default message when error has no message', () => {
      const error = new Error();

      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    it('should log error to console', () => {
      const error = new Error('Test error');

      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', error);
    });

    it('should handle JSON parsing error (SyntaxError)', () => {
      const jsonError = new SyntaxError('Unexpected token < in JSON at position 0');

      errorHandler(
        jsonError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid JSON format' });
    });

    it('should handle database errors', () => {
      const dbError = new Error('Database connection failed');

      errorHandler(
        dbError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Database connection failed' });
    });

    it('should handle validation errors', () => {
      const validationError = new Error('Validation failed: email is required');

      errorHandler(
        validationError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Validation failed: email is required',
      });
    });

    it('should not call next() function', () => {
      const error = new Error('Test');

      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle TypeError', () => {
      const typeError = new TypeError('Cannot read property of undefined');

      errorHandler(
        typeError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Cannot read property of undefined',
      });
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle ReferenceError', () => {
      const refError = new ReferenceError('variable is not defined');

      errorHandler(
        refError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'variable is not defined',
      });
    });

    it('should always call status() before json()', () => {
      const error = new Error('Test');

      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      const statusMock = mockResponse.status as jest.Mock;
      const jsonMock = mockResponse.json as jest.Mock;

      expect(statusMock.mock.invocationCallOrder[0]).toBeLessThan(
        jsonMock.mock.invocationCallOrder[0]
      );
    });
  });
});
