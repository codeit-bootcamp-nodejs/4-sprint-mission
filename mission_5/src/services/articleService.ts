import * as articleRepository from "../repository/articleRepository.js";
import type {
  CreatePostDTO,
  GetPostsDTO,
  GetPostDTO,
  PatchPostDTO,
  DeletePostDTO,
  PostCommentDTO,
  GetCommentsDTO,
  PatchCommentDTO,
  DeleteCommentDTO,
} from "../types/article.js";

export async function createPost(data: CreatePostDTO) {
  const result = await articleRepository.createPost(data);

  return result;
}

export async function getPosts(data: GetPostsDTO) {
  const result = await articleRepository.getPosts(data);

  return result;
}

export async function getPost(id: GetPostDTO) {
  const result = await articleRepository.getPost(id);

  return result;
}

export async function patchPost(data: PatchPostDTO) {
  const result = await articleRepository.patchPost(data);

  return result;
}

export async function deletePost(id: DeletePostDTO) {
  const result = await articleRepository.deletePost(id);

  return result;
}

export async function postComment(data: PostCommentDTO) {
  const result = await articleRepository.postComment(data);

  return result;
}

export async function getComments(data: GetCommentsDTO) {
  const result = await articleRepository.getComments(data);

  return result;
}

export async function patchComment(data: PatchCommentDTO) {
  const result = await articleRepository.patchComment(data);

  return result;
}
export async function deleteComment(data: DeleteCommentDTO) {
  const result = await articleRepository.deleteComment(data);

  return result;
}
