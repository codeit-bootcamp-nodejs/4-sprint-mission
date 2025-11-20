import * as usersRepository from '../repositories/usersRepository';
import * as productsRepository from '../repositories/productsRepository';
import * as favoritesRepository from '../repositories/favoritesRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import User from '../types/User';
import { PagePaginationParams } from '../types/pagination';

export async function getUser(id: number): Promise<User> {
  const user = await usersRepository.getUser(id);
  if (!user) {
    throw new NotFoundError('User', id);
  }
  return user;
}

export async function updateUser(
  id: number,
  data: Partial<Omit<User, 'id' | 'email' | 'password' | 'createdAt' | 'updatedAt'>>,
): Promise<User> {
  const user = await usersRepository.updateUser(id, data);
  return user;
}

export async function getMyProductList(userId: number, params: PagePaginationParams) {
  return { list: [], totalCount: 0 };
}

export async function getMyFavoriteList(userId: number, params: PagePaginationParams) {
  return { list: [], totalCount: 0 };
}
