import { MESSAGE, STATUS_CODE } from '../../constants/constant.js';
import { HttpException } from '../../utils/http-exception.js';
import { postRepository } from './post.repository.js';
import { createDataInput } from './post.type.js';

class PostService {
  getById = async (postId: number) => {
    const post = await postRepository.findById(postId);
    if (!post) {
      throw new HttpException(STATUS_CODE.NOT_FOUND, MESSAGE.postNotFound);
    }
    return post;
  };
  create = async (createData: createDataInput) => {
    const post = await postRepository.create(createData);
    return post;
  };
}

export const postService = new PostService();
