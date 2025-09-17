import { User } from "@prisma/client";
import * as UserRepo from "../repository/user_repository";

export async function getUserByIdService(id: number) {
  const user = await UserRepo.getUserById(id);
  if (!user) throw new Error("NOT FOUND");

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
  if (!user || user.length === 0) throw new Error("NOT FOUND");

  return user;
}

export async function updateUserService({ id, updateData }: Users.Update) {
  const user = await UserRepo.findUniqueUser(id);
  if (!user) throw new Error("NOT_FOUND");
  const updatedUser = await UserRepo.updateUser({ id, updateData });
  return updatedUser;
}
