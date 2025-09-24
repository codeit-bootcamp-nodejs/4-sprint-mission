import { User } from "@prisma/client";
import * as UserRepo from "../repository/user_repository";
import { AppError } from "../utils/error";

export async function getUserByIdService(id: number) {
  const user = await UserRepo.getUserById(id);
  if (!user) throw new AppError("존재하지 않는 사용자입니다.", 404);
  return user;
}

export async function getUserLikeService(user: User) {
  const userId = user.id;
  const articles = await UserRepo.getArticles(userId);

  const likeArticles = articles
    .map((l) => l.article)
    .filter((article) => article !== null);

  const products = await UserRepo.getProducts(userId);

  const likeProducts = products
    .map((l) => l.product)
    .filter((product) => product !== null);

  return { likeArticles, likeProducts };
}

export async function getUserService() {
  const user = await UserRepo.getUser();
  if (!user || user.length === 0)
    throw new AppError("존재하지 않는 사용자입니다.", 404);

  return user;
}

export async function updateUserService({ id, updateData }: Users.Update) {
  const user = await UserRepo.findUniqueUser(id);
  if (!user) throw new AppError("존재하지 않는 사용자입니다.", 404);
  const updatedUser = await UserRepo.updateUser({ id, updateData });
  return updatedUser;
}
