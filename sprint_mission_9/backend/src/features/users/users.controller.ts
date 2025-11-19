import { Request, Response } from 'express';
import { AuthRequest } from '../../shared/middlewares/auth.middleware';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { registerSchema, loginSchema, updateUserSchema } from './users.dto';
import prisma from '../../shared/database/prisma.client';

const repository = new UsersRepository(prisma);
const service = new UsersService(repository);

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = registerSchema.parse(req.body);
    const result = await service.register(userData);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({ message: 'Invalid registration data', errors: error });
      return;
    }
    if (error instanceof Error && error.message.includes('already exists')) {
      res.status(409).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Failed to register user' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const loginData = loginSchema.parse(req.body);
    const result = await service.login(loginData);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({ message: 'Invalid login data', errors: error });
      return;
    }
    if (error instanceof Error && error.message === 'Invalid email or password') {
      res.status(401).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Failed to login' });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token is required' });
      return;
    }

    const result = await service.refreshToken(refreshToken);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid refresh token') {
      res.status(401).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Failed to refresh token' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await service.getUser(req.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

export const updateMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const updateData = updateUserSchema.parse(req.body);
    const user = await service.updateUser(req.userId, updateData);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({ message: 'Invalid user data', errors: error });
      return;
    }
    res.status(500).json({ message: 'Failed to update user' });
  }
};

export const deleteMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const deleted = await service.deleteUser(req.userId);
    if (!deleted) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};
