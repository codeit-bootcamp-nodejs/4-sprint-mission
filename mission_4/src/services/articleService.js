import * as articleRepository from "../repository/articleRepository.js";

export async function createPost(data) {
  const result = await articleRepository.createPost(data);

  return result;
}

export async function getPosts(data) {
  // 기본 desc
  data.sort = data.sort === "old" ? "asc" : "desc";

  const result = await articleRepository.getPosts(data);

  return result;
}

export async function getPost(id) {
  const result = await articleRepository.getPost(id);

  return result;
}

export async function patchPost(data) {
  const result = await articleRepository.patchPost(data);

  return result;
}

export async function deletePost(id) {
  const result = await articleRepository.deletePost(id);

  return result;
}

export async function postComment(data) {
  const result = await articleRepository.postComment(data);

  return result;
}

export async function getComments(data) {
  const result = await articleRepository.getComments(data);

  return result;
}

export async function patchComment(data) {
  const result = await articleRepository.patchComment(data);

  return result;
}
export async function deleteComment(data) {
  const result = await articleRepository.deleteComment(data);

  return result;
}
